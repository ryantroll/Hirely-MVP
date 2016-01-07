/**
 * Created by labrina.loving on 9/18/2015.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var errorHandler = require('./utils/errorHandler')();
var logger = require('morgan');
var tinylr  = require('tiny-lr');

var config = require('./config');

/** MongoDB **/
var mongoose = require('mongoose');
var connectMongo = require('connect-mongo');
mongoose.connect(config.mongoUri);

var port =  process.env.LR_PORT || process.env.PORT || 7200;
var routes;

var environment = process.env.NODE_ENV;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());                // enable ALL CORS requests
app.use(errorHandler.init);


routes = require('./routes')(app);

switch (environment){
    case 'production':
        console.log('** PRODUCTION ON Modulus **');
        console.log('serving from ' + './dist/');

        app.use('/', express.static('./dist/'));
        break;
    case 'stage':
    case 'build':
        console.log('** BUILD **');
        console.log('serving from ' + './dist/');
        app.use('/', express.static('./dist/'));
        break;
    default:
        console.log('** DEV **');
        console.log('serving from ' + './src/client/ and ./');
        app.use('/', express.static(__dirname +'/../client/www/')); //ded
        app.use('/', express.static(__dirname + '/../'));

        break;
}
app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});
