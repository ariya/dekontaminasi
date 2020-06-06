const curl = require('./curl');
const mkdirp = require('./mkdirp');

// https://inacovid19.maps.arcgis.com/
function createArcGISURL(serviceName, condition) {
    const where = condition ? `(${condition}) AND (1=1)` : '1=1';
    const pathname = [
        'VS6HdKS0VfIhv8Ct',
        'arcgis',
        'rest',
        'services',
        serviceName,
        'FeatureServer',
        '0',
        'query'
    ].join('/');
    let query = new URLSearchParams({
        f: 'json',
        where,
        returnGeometry: 'false',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: '*',
        resultOffset: '0',
        cacheHint: 'true'
    });
    const targetURL = new URL(pathname, 'https://services5.arcgis.com');
    targetURL.search = query.toString();
    return targetURL.toString();
}

function isBlocked(content) {
    let blocked = false;
    try {
        const parsed = JSON.parse(content);
        if (parsed && parsed.error) blocked = true;
    } catch (e) {
        // can't infer anything, assuming the best
        blocked = false;
    }
    return blocked;
}

function cacheArcGIS() {
    console.log('Caching important covid19.go.id and ArcGIS data...');

    mkdirp('public/api');
    mkdirp('public/api/cache');

    const paths = ['update.json', 'prov.json'];
    paths.forEach((path) => {
        const fileName = 'public/api/cache/' + path;
        const serviceUrl = 'https://data.covid19.go.id/public/api/' + path;
        const content = curl(serviceUrl, fileName);
        if (content.length <= 0) {
            console.log(`  ERROR: Unable to retrieve ${serviceName} properly`);
            const previousData = 'https://dekontaminasi.com/api/cache/' + path;
            curl(previousData, fileName);
        } else {
            console.log(`  ${path} -> ${content.length} bytes`);
        }
    });

    const services = {
        Statistik_Perkembangan_COVID19_Indonesia: null,
        COVID19_Indonesia_per_Provinsi: null,
        RS_Rujukan_COVID19_Indonesia: null,
        RS_Rujukan_Update_May_2020: "tipe='RS_RUJUKAN_NASIONAL'"
    };
    Object.keys(services).forEach((serviceName) => {
        const fileName = 'public/api/cache/' + serviceName;
        const condition = services[serviceName];
        const serviceUrl = createArcGISURL(serviceName, condition);
        const content = curl(serviceUrl, fileName);
        if (isBlocked(content)) {
            console.log(`  ERROR: Unable to retrieve ${serviceName} properly`);
            const previousData = `https://dekontaminasi.com/api/cache/${serviceName}`;
            curl(previousData, fileName);
        } else {
            console.log(`  ${serviceName} -> ${content.length} bytes`);
        }
    });

    console.log('COMPLETED.');
}

cacheArcGIS();
