var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var errorHandler = require('./server/utils/errorHandler')();
var logger = require('morgan');

var config = require('./server/config');

var onetScoresService = require('./server/services/onetScores.service');

/** MongoDB **/
var mongoose = require('mongoose');
mongoose.connect(config.mongoUri);

var port =  process.env.LR_PORT || process.env.PORT || 3000;
var routes;

var environment = process.env.NODE_ENV;

var compression = require('compression');
app.use(compression({filter: function(req, res) {
    // iPhone: Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E233 Safari/601.1
    // Chrome: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36
    // console.dir('Ua: ' +req.headers['user-agent']);
    if (req.headers['user-agent'].indexOf('iPhone')!=-1 || req.headers['user-agent'].indexOf('iPad')!=-1) {
        console.log("IPHONE DETECTED.  Disabling compression");
        return false;
    }
    return compression.filter(req, res);
}}));

app.use(bodyParser.urlencoded({extended: true, limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb'}));
app.use(logger('dev'));
app.use(cors());                // enable ALL CORS requests
app.use(errorHandler.init);
app.use(require('./server/middlewares/force-https.middleware'));


routes = require('./server/routes')(app);

switch (environment){
    case 'production':
        console.log('** PRODUCTION ON Modulus **');
        console.log('serving from ' + './server/dist/');

        app.use('/', express.static('./server/dist/'));
        break;
    case 'stage':
    case 'build':
        console.log('** BUILD **');
        console.log('serving from ' + './server/dist/');
        app.use('/', express.static('./server/dist/'));
        break;
    default:
        console.log('** DEV **');
        console.log('serving from ' + './server/src/client/ and ./');
        app.use('/', express.static(__dirname +'/client/www/')); //ded
        app.use('/', express.static(__dirname + '/'));

        break;
}

function startListening() {
    app.listen(port, function () {
        console.log('Express server listening on port ' + port);
        console.log('env = ' + app.get('env') +
            '\n__dirname = ' + __dirname +
            '\nprocess.cwd = ' + process.cwd());
    });
}


if (config.appMode == 'crunchMuncher') {
    console.log("Running in crunchMuncher mode...");
    var UserService = require('./server/services/user.service');

    console.log("Priming onetScoresCache...");
    onetScoresService.getAll().then(function() {
        console.log("onetScoresCache is primed");
        // UserService.updateQueuedUserMetrics();
        setInterval(UserService.updateQueuedUserMetrics, 10000);
        startListening();
    });

} else {
    // Standard Express mode
    if (config.primeOnetScoresCache) {
        console.log("Priming onetScoresCache...");
        onetScoresService.getAll().then(function () {
            console.log("onetScoresCache is primed");
            startListening();
        });
    } else {
        startListening();
    }
}
