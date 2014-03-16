var http = require('http');
var fs = require('fs');
var parser = require('url');

var registry = {};

function Livecss(port) {
    if (!port) {
        throw new Error('Port argument needed for livecss server');
    }

    if (registry[port]) {
        return registry[port];
    }

    if (global === this) {
        return new Livecss(port);
    }

    registry[port] = this;

    this.server = this.start(port);
    this.responses = [];
    this.initialListOfReplacings = {};
}

Livecss.prototype.start = function(port) {
    var context = this;

    return http.createServer(function(req, res) {
        var path = parser.parse(req.url).pathname;
        var isEventSource = req.headers.accept && req.headers.accept == 'text/event-stream';
        if (path === '/listen' && isEventSource) {
            context.addConnection(req, res);
        } else if (path === '/Livecss.js') {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(fs.readFileSync(__dirname + '/Livecss.js'));
            res.end();
        } else if (path === '/crossdomain') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(fs.readFileSync(__dirname + '/crossdomain.html'));
            res.end();
        } else {
            res.writeHead(404);
            res.end();
        }
    }).listen(port);
};

function notifyResponse(obj, res) {
    res.write("data: " + JSON.stringify(obj) + '\n\n');
}

Livecss.prototype.addToInitialListOfReplacings = function(fileName, insteadFile) {
    this.initialListOfReplacings[fileName] = insteadFile;
};

Livecss.prototype.notify = function(fileName, insteadFile) {
    this.responses.forEach(function(res) {
        notifyResponse({
            file: fileName,
            instead: insteadFile
        }, res);
    });
};

Livecss.prototype.addConnection = function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    this.responses.push(res);
    req.on('close', function() {
        for (var n = 0; n < this.responses.length; n++) {
            if (this.responses[n] === res) {
                this.responses.splice(n, 1);
                break;
            }
        }
    }.bind(this));

    for (var n in this.initialListOfReplacings) {
        notifyResponse({
            file: n,
            instead: this.initialListOfReplacings[n]
        }, res);
    }
};

module.exports = Livecss;