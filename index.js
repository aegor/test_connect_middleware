var connect = require('connect');
var http = require('http');
var redirect = require('connect-redirection');
var url = require('url');
var proxy = require('proxy-middleware');
var cookies = require('connect-cookies');
var serveStatic = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config');

var app = connect();

app.use(function(req, res, next){
console.log("generic route", req.url);
res.write("generic route");
console.log("after end of generic");
//next();
}
);

app.use("/a", function(req, res, next){
console.log("/a route ", req.url);
res.end("a route");
console.log("after end of a");
next();
}
);

app.use("/b", function(req, res, next){
console.log("/b route ", req.url);
res.end("b route");
console.log("after end of b");
next();
}
);

  proxyStart = function (urls) {
    console.log("urls: ", urls);
    for (var i in urls) {
      app.use(urls[i], function (req,res,next){
        console.log(req.url);
        slamDataSecurity(req,res,next)
      });
      app.use( urls[i], proxy(url.parse(config.slamDataURL + urls[i])) );
      //app.use(urls[i], chain([slamDataSecurity, proxy(url.parse(config.slamDataURL + urls[i]))]));
    }
  };

// Proxy to quasar API
  proxyStart([
    '/metadata',
    '/mount',
    '/data',
    '/compile',
    '/query',
    '/server'
  ]);

  // Serve static content (meteor public folder serving is real shit)
  const serve = serveStatic('./public', {'index': ['index.html']});
  app.use('/public', function (req, res, next) {
    var tmp = serve(req, res, next);
    return tmp;
  });


  // body parsers for json and forms
  app.use(bodyParser.json());                       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({extended: true})); // to support URL-encoded bodies


http.createServer(app).listen(4000);
