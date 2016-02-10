var config = require('../config')
var mongoose = require('mongoose');
var ApplicationModel = require('../models/application.model.js');

mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:') );

db.once('open', function(){
    var a = new ApplicationModel({
        userId: mongoose.Types.ObjectId('568fde202127fa312543f50e'),
        positionId: mongoose.Types.ObjectId('56952b8f0c3d16003e49a3e2'),
        status:1,
        prescreenAnswers:[
            {
                question:'what\'s up?',
                answer: 'Nothing'
            }
        ],
        scores: {
            exp: .2,
            edu: .1,
            qual: .2,
            psy: .2,
            overall: .8
        }
    });

    a.save(function(err, user){
        if(err){
            return console.error(err);
            process.exit(1);
        }
        console.log(user);

        process.exit(1);
    })
});
