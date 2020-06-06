const fs = require('fs');

function removeFile(fname) {
    if (fs.existsSync(fname)) fs.unlinkSync(fname);
}

function findFiles(dir) {
    const files = [];
    fs.readdirSync(dir).forEach((file) => {
        const name = dir + '/' + file;
        if (fs.statSync(name).isDirectory()) files.push(...findFiles(name));
        else files.push(name);
    });
    return files;
}

function indexFiles() {
    console.log('Creating content index for index.html...');

    // Raw JSONs shouldn't be served
    removeFile('public/api/id/covid19/national.json');
    removeFile('public/api/id/covid19/progress-national.json');
    removeFile('public/api/id/covid19/provinces.json');
    removeFile('public/api/id/covid19/hospitals.json');

    const content = findFiles('public/api/id')
        .map((fname) => {
            const path = fname.replace('public/', '');
            return `<p><a href="${path}">${path}</a></p>`;
        })
        .join('\n');

    const index = fs.readFileSync('public/index.html', 'utf-8').toString();
    const modifiedIndex = index.replace('<!--index-->', content);
    fs.writeFileSync('public/index.html', modifiedIndex);

    console.log('COMPLETED.');
}

indexFiles();
