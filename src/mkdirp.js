const fs = require('fs');

function mkdirp(dirname) {
    try {
        fs.mkdirSync(dirname);
    } catch (e) {
        // ignore, directory already exists
    }
}

module.exports = mkdirp;
