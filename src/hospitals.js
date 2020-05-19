const child_process = require('child_process');
const fs = require('fs');

const mkdirp = require('./mkdirp');

function updateCovid19Hospitals(metadata) {
    console.log('Updating Indonesia COVID-19 Hospitals...');

    mkdirp('public/api');
    mkdirp('public/api/id');
    mkdirp('public/api/id/covid19');

    const fileName = 'public/api/id/covid19/hospitals.json';
    const rawName = 'public/api/cache/RS_Rujukan_COVID19_Indonesia';
    const jqScript = 'src/hospitals.jq';

    child_process.execSync(`cat ${rawName} | jq -f ${jqScript} > ${fileName}`);
    const rawHospitalList = JSON.parse(fs.readFileSync(fileName, 'utf-8').toString());
    console.log(`Found ${rawHospitalList.length} hospitals`);
    const hospitals = rawHospitalList.map((h) => {
        let hh = {};
        Object.keys(h).forEach((k) => (hh[k] = typeof h[k] === 'string' ? h[k].trim() : h[k]));
        if (!metadata[hh.province]) {
            console.log(`  Missing ${hh.province}`);
        }
        return hh;
    });

    console.log('Rearranging hospitals...');
    let sortedHospitals = [];
    Object.keys(metadata).forEach((key) => {
        const meta = metadata[key];

        function score(h) {
            let points = 0;
            const metaname = h.name + ' ' + (h.address ? h.address : '');
            if (metaname.toLowerCase().indexOf(meta.capital.toLowerCase()) > 0) points += 100;
            if (h.description.indexOf('Kemenkes') > 0) points += 50;
            if (h.description.indexOf('Laboratorium') > 0) points += 30;
            return points;
        }

        if (meta.type === 'province') {
            const filteredHospitals = hospitals.filter((h) => h.province === meta.name);
            console.log(' ', meta.name, filteredHospitals.length);
            const orderedHospitals = filteredHospitals.sort((h1, h2) => score(h2) - score(h1));
            sortedHospitals = sortedHospitals.concat(orderedHospitals);
        }
    });
    fs.writeFileSync('public/api/id/covid19/hospitals', JSON.stringify(sortedHospitals, null, 2));

    console.log('COMPLETED.');
}

const metadata = JSON.parse(fs.readFileSync('metadata.json', 'utf-8').toString());
updateCovid19Hospitals(metadata);
