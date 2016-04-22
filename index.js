var port = process.env.PORT || 5000,
    express = require('express'),
    app = express(),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Promise = require("bluebird"),
    lessMiddleware = require('less-middleware'),
    mandrill = require('mandrill-api'),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    phpdate = require('phpdate-js'),
    weather = require('weather-js'),
    position = {
        lat: 34.025922,
        lng: -118.779757
    },
    googleApiKey = 'AIzaSyB_4dRutIokY9FtrRD6oX3f7TlRU0oLBoI',
    assets = {
        styles: [
            'public/_build/css.css',
            'public/_build/less.css',
            'public/_build/fonts/fonts.css'
        ],
        scripts: [
            'public/_build/general.js'
        ]
    },
    timeStamp = (new Date()).getTime();

_.forEach(assets, function (group) {
    _.forEach(group, function (line, key) {
        group[key] = line + '?noCache=' + timeStamp;
    });
});

var hbs = exphbs.create({
    defaultLayout: "main",
    partialsDir: "views/partials/",
    layoutsDir: "views/layouts/",
    helpers: {
        equal: require("handlebars-helper-equal"),
        /**
         * Last argument is always a Handlebars argument!
         */
        styles: function () {
            var list = assets.styles;
            if (arguments.length > 1) {
                list = arguments[0];
            }
            var out = _.map(list, function (val) {
                return '<link rel="stylesheet" href="' + val + '"/>\n';
            });
            return out.join('');
        },
        scripts: function () {
            var list = assets.scripts;
            if (arguments.length > 1) {
                list = arguments[0];
            }
            var out = _.map(list, function (val) {
                return '<script src="' + val + '"></script>\n';
            });
            return out.join('');
        },
        phpdate: function () {
            var dateFormat = 'd/m/y - h.i A',
                dateText = (new Date()).getTime();
            if (arguments.length > 1) {
                dateText = arguments[0];
            }
            if (arguments.length > 2) {
                dateFormat = arguments[1];
            }
            return phpdate(dateFormat, dateText);
        },
        jsonStringify: function () {
            var json;
            if (arguments.length > 1) {
                json = arguments[0];
            }
            return JSON.stringify(json);
        }
    }
});

app
    .use('/public/less', lessMiddleware(path.join(__dirname, 'public', 'less'), {
        force: true,
        debug: true
    }))
    .use('/bower_components', express.static('bower_components'))
    .use('/public', express.static('public'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
    .engine('handlebars', hbs.engine)
    .set('view engine', 'handlebars')
;


var renderPart = function (req, res, name, opts) {
    if (typeof name == 'undefined') {
        name = 'index';
    }
    opts = _.merge({
        assets: assets,
        layout: 'main',
        position: position
    }, opts);
    if (req.xhr) {
        opts.layout = 'ajax';
    }
    res.render(name, opts);
};


app.get('/', function (req, res) {
    renderPart.call(this, req, res, 'index');
});

app.listen(port, function () {
    console.log('App listening on port: ' + port);
});