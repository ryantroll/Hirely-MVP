var config = require('../config')
var mongoose = require('mongoose');
var FavoriteModel = require('../models/positionFavorite.model.js');

mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:') );

db.once('open', function(){
    var a = new FavoriteModel({
        type: 'position',
        userId: mongoose.Types.ObjectId('56c5cbd7af9e1d2cac2dd062'),
        positionId: mongoose.Types.ObjectId('56e1acf4bddd26112b2c7645'),
        locationId: mongoose.Types.ObjectId('56e1acf4bddd26112b2c7644'),
        businessId: mongoose.Types.ObjectId('56e1acf4bddd26112b2c7646')
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
