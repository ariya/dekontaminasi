const fs = require('fs');

const penjabarberita = require('@ariya/penjabarberita');

const curl = require('./curl');
const mkdirp = require('./mkdirp');

const sources = [
    'antara',
    'bbcindonesia',
    'cnbcindonesia',
    'cnnindonesia',
    'intisari',
    'jawapos',
    'kompas',
    'kontan',
    'liputan6',
    'pikiranrakyat',
    'republika',
    'suara',
    'tempo',
    'theconversation',
    'turnbackhoax',
    'vivanews'
];

const urls = {
    antara: 'https://www.antaranews.com/tag/corona',
    bbcindonesia: 'https://www.bbc.com/indonesia/topics/cgljjjepvv6t',
    cnbcindonesia: 'https://www.cnbcindonesia.com/tag/covid_19',
    cnnindonesia: 'https://www.cnnindonesia.com/tag/corona',
    intisari: 'https://intisari.grid.id/tag/covid-19',
    jawapos: 'https://www.jawapos.com/tag/covid-19',
    kompas: 'https://www.kompas.com/tag/virus-corona',
    kontan: 'https://www.kontan.co.id/tag/covid-19',
    liputan6: 'https://www.liputan6.com/tag/covid-19?type=text',
    pikiranrakyat: 'https://www.pikiran-rakyat.com/tag/COVID-19',
    republika: 'https://republika.co.id/tag/covid19',
    suara: 'https://www.suara.com/tag/corona',
    tempo: 'https://www.tempo.co/tag/covid-19?type=berita',
    theconversation: 'https://theconversation.com/id/topics/covid-19-82797',
    turnbackhoax: 'https://turnbackhoax.id/tag/coronavirus',
    vivanews: 'https://www.vivanews.com/tag/coronavirus'
};

function updateCovid19News() {
    console.log('Updating News related to COVID-19...');

    mkdirp('public/api');
    mkdirp('public/api/id');
    mkdirp('public/api/id/covid19');

    let articles = {};
    sources.forEach((source) => {
        articles[source] = [];
        const url = urls[source];
        const start = Date.now();
        const content = curl(url, `${source}.log`);
        if (!content) {
            console.error('  Failed to obtain', source);
        } else {
            const news = penjabarberita(content).map((n) => {
                if (n.url.startsWith('/')) {
                    return {
                        ...n,
                        url: 'https:' + n.url
                    };
                }
                return n;
            });
            const elapsed = Date.now() - start;
            if (!Array.isArray(news) || news.length <= 0) {
                console.error('  Unable to parse news from', source);
            } else {
                articles[source] = news;
                console.log(`  From ${source}: ${news.length} articles (${elapsed} ms)`);
            }
        }
    });

    let allArticles = [];
    console.log();
    console.log('Consolidating all articles:');
    sources.forEach((source) => {
        const news = articles[source].sort((p, q) => q.timestamp - p.timestamp).slice(0, 7);
        console.log(`  Adding ${news.length} from ${source}...`);
        allArticles = allArticles.concat(news);
    });

    // sorted chronologically
    console.log();
    console.log('ALL ARTICLES:', allArticles.length);
    allArticles.forEach((n) => {
        const source = new URL(n.url).hostname.replace('www.', '');
        console.log(`  ${new Date(n.timestamp).toUTCString()}  ${n.title} [${source}]`);
    });

    fs.writeFileSync('public/api/id/covid19/news', JSON.stringify(allArticles, null, 2));

    console.log('COMPLETED.');
}

updateCovid19News();
