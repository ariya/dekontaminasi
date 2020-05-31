const child_process = require('child_process');
const fs = require('fs');

const curl = require('./curl');
const fuzzyMatch = require('./fuzzy-match');
const mkdirp = require('./mkdirp');

function updateCovid19Stats(metadata) {
    console.log('Updating Indonesia COVID-19 Statistics...');

    const prefix = 'public/api/id/covid19/';
    mkdirp('public/api');
    mkdirp('public/api/id');
    mkdirp(prefix);

    function updateNational() {
        const fileName = 'public/api/id/covid19/progress-national.json';
        const rawName = 'public/api/cache/Statistik_Perkembangan_COVID19_Indonesia';
        const jqScript = 'src/progress-national.jq';
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

    const progressNationalStats = JSON.parse(fs.readFileSync(prefix + 'progress-national.json', 'utf-8').toString())
        .filter((s) => s.name === 'Indonesia')
        .filter((s) => s.numbers && typeof s.numbers.infected === 'number')
        .sort((p, q) => p.day - q.day);
    const nationalStats = progressNationalStats.slice(-1).pop();

    const provincesStats = JSON.parse(fs.readFileSync(prefix + 'provinces.json', 'utf-8').toString())
        .filter((p) => p.name !== 'Indonesia')
        .map((prov) => {
            let pp = prov;
            if (!metadata[prov.name]) {
                const match = fuzzyMatch(Object.keys(metadata), prov.name);
                console.log(`  Missing ${prov.name}: closest match is ${match.name}`);
                pp.name = match.name;
            }
            return pp;
        })
        .sort((p, q) => p.name.localeCompare(q.name));
    fs.writeFileSync(prefix + 'provinces.json', JSON.stringify(provincesStats, null, 2));

    const stats = { ...nationalStats, regions: provincesStats.sort((p, q) => q.numbers.infected - p.numbers.infected) };
    fs.writeFileSync(prefix + 'stats', JSON.stringify(stats, null, 2));

    const timestampName = prefix + 'stats.timestamp';
    const timestampUrl = 'https://dekontaminasi.com/api/id/covid19/stats.timestamp';
    const timestamp = parseInt(curl(timestampUrl, timestampName).trim(), 10);

    const previousStatsUrl = 'https://dekontaminasi.com/api/id/covid19/stats';
    const previousStatsContent = curl(previousStatsUrl, 'previous.log');
    if (!previousStatsContent) {
        console.error('Unable to grab previous stats. Can not compare for now');
    } else {
        const previousStats = JSON.parse(previousStatsContent);
        if (JSON.stringify(stats) === JSON.stringify(previousStats)) {
            console.log(`Previous timestamp is ${timestamp} -> ${new Date(timestamp).toGMTString()}`);
            console.log('Previous stats are already up-to-date! Skipping update...');
        } else {
            const now = Date.now();
            console.log(`Fresh stats: updating timestamp to ${now}`);
            fs.writeFileSync(timestampName, now.toString());
        }
    }
    console.log('COMPLETED.');
}

const metadata = JSON.parse(fs.readFileSync('metadata.json', 'utf-8').toString());
updateCovid19Stats(metadata);
