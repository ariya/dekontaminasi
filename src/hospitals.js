const child_process = require('child_process');
const fs = require('fs');

const mkdirp = require('./mkdirp');

function updateCovid19Hospitals() {
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
        return hh;
    });

    fs.writeFileSync('public/api/id/covid19/hospitals', JSON.stringify(hospitals, null, 2));

    console.log('COMPLETED.');
}

updateCovid19Hospitals();
