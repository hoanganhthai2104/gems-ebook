const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    
    // Strip query parameters from req.url to prevent file-not-found errors for static assets with cache busters
    const cleanUrl = req.url.split('?')[0];
    let filePath = cleanUrl === '/' ? './index.html' : '.' + decodeURIComponent(cleanUrl);
    
    // Resolve absolute path to ensure we are within workspace
    const absolutePath = path.resolve(filePath);
    const workspacePath = path.resolve(__dirname);
    
    if (!absolutePath.startsWith(workspacePath)) {
        console.log(`[FORBIDDEN] ${absolutePath}`);
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
    }

    fs.stat(absolutePath, (err, stats) => {
        if (err || !stats.isFile()) {
            console.log(`[NOT FOUND - FALLBACK] ${absolutePath}`);
            // Fallback to index.html for SPA routing if file not found
            fs.readFile(path.join(workspacePath, 'index.html'), (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(data);
                }
            });
            return;
        }

        const ext = path.extname(absolutePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        fs.readFile(absolutePath, (err, data) => {
            if (err) {
                console.log(`[ERR] Reading ${absolutePath}: ${err.message}`);
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Internal Server Error');
            } else {
                console.log(`[OK] Served ${absolutePath} (${contentType})`);
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    });
});

function startServer(port) {
    server.listen(port, () => {
        console.log(`\n======================================================`);
        console.log(`🚀 GEMS Medical E-Reader App is running locally!`);
        console.log(`👉 Access URL: http://localhost:${port}`);
        console.log(`======================================================\n`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️  Port ${port} is in use, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
}

startServer(8081);
