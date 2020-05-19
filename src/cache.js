const curl = require('./curl');
const mkdirp = require('./mkdirp');

// https://inacovid19.maps.arcgis.com/
function createArcGISURL(serviceName, sortOrder, condition) {
    condition = condition || '1=1';
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
        where: condition,
        returnGeometry: 'false',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: '*',
        resultOffset: '0',
        cacheHint: 'true'
    });
    if (sortOrder) query.append('orderByFields', sortOrder);
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
    console.log('Caching important ArcGIS data...');

    mkdirp('public/api');
    mkdirp('public/api/cache');

    const services = [
        'Statistik_Perkembangan_COVID19_Indonesia',
        'COVID19_Indonesia_per_Provinsi',
        'RS_Rujukan_COVID19_Indonesia'
    ];
    services.forEach((serviceName) => {
        const fileName = 'public/api/cache/' + serviceName;
        const content = curl(createArcGISURL(serviceName), fileName);
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
