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
        console.log(`  ${serviceName} -> ${content.length} bytes`);
    });

    console.log('COMPLETED.');
}

cacheArcGIS();
