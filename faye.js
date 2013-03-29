var http = require('http'),
    faye = require('faye'),
    fs   = require('fs');

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.listen(9090);

// Handle non-Bayeux requests
var server = http.createServer(function(request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end(fs.readFileSync('views/index.erb'));
});

server.listen(8080);
bayeux.attach(server);
