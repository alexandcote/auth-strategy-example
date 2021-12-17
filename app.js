const http = require('http');
var fs = require('fs');
var path = require('path');
const { parse } = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            fs.readFile('first.html', function(_, content) {
                res.end(content.toString().replace('{{token}}', result.token), 'utf-8');
            });
        });
    }

    if (req.method === 'GET') {
        const file = req.url.split('/')[1];
        fs.readFile(file, function(_, content) {
            res.end(content, 'utf-8');
        });
    }
});
server.listen(3000);

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}