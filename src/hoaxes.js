const fs = require('fs');
const penjabarberita = require('@ariya/penjabarberita');

const curl = require('./curl');
const mkdirp = require('./mkdirp');

function updateTurnbackHoax() {
    console.log('Updating hoaxes related to COVID-19...');

    const urls = [
        'https://turnbackhoax.id/tag/coronavirus',
        'https://turnbackhoax.id/tag/covid-19',
        'https://turnbackhoax.id/?s=covid-19'
    ];

    const collectedArticles = urls
        .map((url) => {
            const content = curl(url, 'turnbackhoax.log', 5);
            if (!content) {
                console.error('  Failed to obtain', url);
                return [];
            }
            const list = penjabarberita(content);
            console.log(url);
            console.log(list.map((n) => n.title).join('\n'));
            return list;
        })
        .reduce((previous, current) => [...previous, ...current], []);

    // remove duplicates
    const titles = [];
    const uniqueArticles = [];
    collectedArticles.forEach((n) => {
        if (!titles.includes(n.title)) {
            uniqueArticles.push(n);
            titles.push(n.title);
        }
    });

    // sorted chronologically
    const sortedArticles = uniqueArticles.sort((p, q) => q.timestamp - p.timestamp);

    console.log();
    console.log('All articles (sorted chronologically):');
    sortedArticles.forEach((n) => {
        console.log(`  ${new Date(n.timestamp).toUTCString()}  ${n.title}`);
    });

    fs.writeFileSync('public/api/id/covid19/hoaxes', JSON.stringify(sortedArticles, null, 2));
    console.log('COMPLETED.');
}

updateTurnbackHoax();
