const child_process = require('child_process');
const fs = require('fs');

const mkdirp = require('./mkdirp');

function updateCovid19Stats(metadata) {
    console.log('Updating Indonesia COVID-19 Statistics...');

    const prefix = 'public/api/id/covid19/';
    mkdirp('public/api');
    mkdirp('public/api/id');
    mkdirp(prefix);

    function updateNational() {
        const fileName = 'public/api/id/covid19/national.json';
        const rawName = 'public/api/cache/Statistik_Perkembangan_COVID19_Indonesia';
        const jqScript = 'src/national.jq';
        child_process.execSync(`cat ${rawName} | jq -f ${jqScript} > ${fileName}`);
    }

    function updateProvinces() {
        const fileName = 'public/api/id/covid19/provinces.json';
        const rawName = 'public/api/cache/COVID19_Indonesia_per_Provinsi';
        const jqScript = 'src/provinces.jq';
        child_process.execSync(`cat ${rawName} | jq -f ${jqScript} > ${fileName}`);
    }

    updateNational();
    updateProvinces();

    const nationalStats = JSON.parse(fs.readFileSync(prefix + 'national.json', 'utf-8').toString());
    const provincesStats = JSON.parse(fs.readFileSync(prefix + 'provinces.json', 'utf-8').toString()).filter(
        (p) => p.name !== 'Indonesia'
    );

    const stats = { ...nationalStats, regions: provincesStats };
    fs.writeFileSync(prefix + 'stats', JSON.stringify(stats, null, 2));

    console.log('COMPLETED.');
}

const metadata = JSON.parse(fs.readFileSync('metadata.json', 'utf-8').toString());
updateCovid19Stats(metadata);
