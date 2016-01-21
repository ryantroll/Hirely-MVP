var config = require('../config')
var mongoose = require('mongoose');
var UserModel = require('../models/user.model.js');

mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:') );

db.once('open', function(){

    UserModel.findOne({email:'iyad.bitar@gmail.com'}, 'workExperience').exec()
    .then(
        function(user){
            console.log('user found')
            return user;
        },//// fun. reslove
        function(err){
            console.log('user not foud');
            process.exit(0);
            return null;
        }
    )///// find.then()
    .then(
        function(user){
            exp = {
                formattedAddress:'IBM, Parsippany Road, NJ, United States',
                city:'Parsippany',
                state:'NJ',
                googlePlaceId:'google-palce-good-id',
                dateStart: '01-mar-2015',
                dateEnd: '01-Jun-2015',
                reportedJobName:'Developer',
                onetOccupationId:'11-1011.00',
                accomplishments:'some good work'
            };

            user.workExperience.push(exp);
            user.save(function(err, result){
                console.log('Error: ', err);
                console.log('Result: ', result);
            })
        }
    )

    // user.save(function(err, user){
    //     if(err){
    //         return console.error(err);
    //         process.exit(1);
    //     }
    //     console.log(user);

    //     process.exit(1);
    // })
});
