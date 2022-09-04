const https = require('https');
const fs = require('fs');
const path = require('path');
module.exports = {
    server: null,
    port: 4000,

    init: function (server, port) {
        this.server = server;
        this.port = port || this.port;
    },

    connect: function () {
        https.createServer(this.getSSLOptions(), this.server).listen(this.port, () => {
            console.log(`[Server] listening on port ${this.port}`);
        });
    },

    setMiddleWare: function (middleWare) {
        this.server.use(middleWare);
    },

    api: function (method, url, callback) {
        this.server[method](url, callback);
    },

    getSSLOptions: function () {
        return {
            key: fs.readFileSync(path.resolve(`${process.cwd()}/server/ssl/private.pem`)),
            cert: fs.readFileSync(path.resolve(`${process.cwd()}/server/ssl/public.pem`))
        }
    },
}