#Livecss

This is server, for automate updates of css in browser.
All you need – start it

```js
    //node.js file
    var getLiveCssServer = require('livecss');
    var server = getLiveCssServer(4242); //pass port to listen.
    //Also livecss module is factory – it will not create more than one copy of server for every port.
    //So if you do getLiveCssServer(4242) one more time, you'll get the same copy.
```

Add script to your page (don't forget to add it only on dev server)

```html
    <!DOCTYPE html>
    <html>
        <head>
            <link rel="stylesheet" href="/static/compiled/stylesheet.css" />
        </head>
        <body>
            <script data-host="localhost:4242" src="localhost:4242/livecss.js"></script>
        </body>
    </html>
```

And push file name to server

```js
    //node.js file
    var fileToGet = '/static/stylesheet-updated.css';
    var fileToDeleteInstead = '/static/compiled/stylesheet.css';
    server.notify(fileToGet, fileToDeleteInstead);
```

And for reconnection purposes add it to list of files to update on browser connection (for example when browser reload page).

```js
    server.addToInitialListOfReplacings(fileToGet, fileToDeleteInstead);
```

There is module for gulp – [gulp-livecss](https://github.com/wwwsevolod/gulp-livecss) to automate server notifys, with good example, how to build css.

At the moment, some of css preprocessors, like [Stylus](https://github.com/LearnBoost/stylus/) can't produce source maps, LiveCss server
