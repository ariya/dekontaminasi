const fs = require('fs');

const now = Date.now();
console.log(`Now is ${new Date(now).toGMTString()}`);

const headers = fs.readFileSync('public/_headers', 'utf-8').toString();
const pingHeaders = ['/ping', '  X-Update-Timestamp: ' + now.toString()].join('\n');
const modifiedHeaders = headers.replace('#ping-placeholder', pingHeaders);
fs.writeFileSync('public/_headers', modifiedHeaders);
fs.writeFileSync('public/ping', 'OK');
