const curl = require('../src/curl');

const fileName = 'test.html';
const url = 'http://dekontaminasi.com';

const content = curl(url, fileName);
console.log(url, content);
