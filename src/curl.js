const child_process = require('child_process');
const fs = require('fs');

const DEFAULT_TIMEOUT = 23; // seconds
const MAX_SIZE = 4 * 1024 * 1024; // bytes

function curl(url, fileName, timeout) {
    timeout = timeout || DEFAULT_TIMEOUT;

    const cmd = `curl -L -s -o ${fileName} -D - --max-time ${timeout} "${url}"`;

    let content = null;
    try {
        const response = child_process.execSync(cmd).toString();
        const headers = response.split('\r\n');
        if (headers.length < 1) {
            console.error(`Invalid HTTP response: ${response}`);
        } else {
            const status = headers[0].trim().split(' ');
            if (['200', '301', '302'].indexOf(status[1]) < 0) {
                console.error(`Unexpected HTTP status: ${headers[0]}`);
            } else {
                const responseSize = fs.statSync(fileName).size;
                if (responseSize < MAX_SIZE) {
                    content = fs.readFileSync(fileName, 'utf-8').toString();
                } else {
                    console.error(`Download is too big: ${responseSize} (exceeding ${MAX_SIZE / 1024 / 1024} MB)`);
                }
            }
        }
    } catch (err) {
        // Usually indicate a timeout situation
        console.error(`Failed cmd: ${err.message}`);
    }
    return content;
}

module.exports = curl;
