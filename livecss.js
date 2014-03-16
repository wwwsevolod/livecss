(function() {
    function deleteStyle(fileName) {
        var links = [].filter.call(document.querySelectorAll('link[rel=stylesheet]'), function(link) {
            return link.href.search(fileName) !== -1
        });
        links.forEach(function(link) {
            link.remove();
        });
    }

    function insertStyle(fileName) {
        var style = document.createElement('link');
        style.rel = "stylesheet";
        style.href = fileName;
        document.head.appendChild(style);
    }

    window.addEventListener('message', function(e) {
        var json = {};
        try {
            json = JSON.parse(e.data);
        } catch (e) {}

        if (!(json instanceof Object)) {
            return;
        }

        if (json.file) {
            deleteStyle(json.file);
            deleteStyle(json.instead);
            insertStyle(json.file);
        }
    });

    var scripts = document.querySelectorAll('script[data-host]');

    var host = [].filter.call(scripts, function(script) {
        return script.src.search('livecss.js') !== -1;
    }).pop().getAttribute('data-host');

    var url = 'http://' + host;
    var iframe = document.createElement('iframe');
    iframe.src = url + '/crossdomain';
    iframe.style.opacity = 0;
    iframe.style.height = 0;
    iframe.style.width = 0;
    document.body.appendChild(iframe);
})();