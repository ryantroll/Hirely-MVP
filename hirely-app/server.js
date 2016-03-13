var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var errorHandler = require('./server/utils/errorHandler')();
var logger = require('morgan');
var tinylr  = require('tiny-lr');

var config = require('./server/config');

var onetScoresService = require('./server/services/onetScores.service');

/** MongoDB **/
var mongoose = require('mongoose');
var connectMongo = require('connect-mongo');
mongoose.connect(config.mongoUri);

var port =  process.env.LR_PORT || process.env.PORT || 3000;
var routes;

var environment = process.env.NODE_ENV;

app.use(bodyParser.urlencoded({extended: true, limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb'}));
app.use(logger('dev'));
app.use(cors());                // enable ALL CORS requests
app.use(errorHandler.init);


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
app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});

if (config.primeOnetScoresCache) {
    onetScoresService.getAll().then(
        function(onetScoresCache) {
            console.log("onetScoresCache is primed");
        },
        function(err) {
            console.log("onetScoresCache error: " +err);
        }
    );
}