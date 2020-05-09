const fs = require('fs');

const now = Date.now();
console.log(`Now is ${new Date(now).toGMTString()}`);

const headerConfig = ['/ping', ' X-Update-Timestamp: ' + now.toString()].join('\n');
fs.writeFileSync('public/_headers', headerConfig);
fs.writeFileSync('public/ping', 'OK');
