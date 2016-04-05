var connect = require('connect');
var serveStatic = require('serve-static');
var path = __dirname + '/demo/dist';
var ip = process.env.IP || '127.0.0.1';
var port = process.env.PORT || 8080;

connect().use('/', serveStatic(path)).listen(port, ip, function() {
    console.log('Web Server running on ' + ip + ':' + port + '...');
});