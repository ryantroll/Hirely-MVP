var config = require('../config')
var mongoose = require('mongoose');
var UserModel = require('../models/user.model.js');

mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:') );

db.once('open', function(){

    UserModel.findOne({email:'iyad.bitar@gmail.com'}, 'education').exec()
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
            edu = {
                institutionName:'IBM, Parsippany Road, NJ, United States',
                city:'Parsippany',
                state:'NJ',
                dateStart: '01-Jan-2015',
                dateEnd: '01-Jun-2015',
                programType: 'Associates',
                degree: 'Good Degree',
                isComplete: false,
                isOnline: true
            };

            user.education.push(edu);
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
