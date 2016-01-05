var config = require('../config')
var mongoose = require('mongoose');
var UserModel = require('../models/user.model.js');

mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:') );

db.once('open', function(){
    var user = new UserModel({
        firstName:'Iyad',
        lastName: 'Bitar',
        email: 'iyad.bitar@mail.com',
        mobile: '90909009',

        provider: 'facebook',
        userType: 'JS',

        country:'USA',
        state:'NJ',
        city:'Clifton',
        street1:'24 Kenter Pl.',
        street2: '',
        street3: '',
        postalCode: '07012',
        formattedAddress: '24 Kenter Pl, Clifon, NJ 07012',
        lng: 12.39439493,
        lat: -99.88888,

        preferences: {
            desiredWageMin      :       10,
            paidVacation        :       true,
            paidSickTime        :       true,
            flexibleSchedule    :       true,
            healthInsurance     :       true,
            dentalInsurance     :       false,
            retirementPlan      :       false,
            discounts           :       true
        },

        personalityExams:[
            {
              extId: 'tritify-exam-id',
              skills: []
            }
        ],

        availability: {
            seekerStatus        :       0, //// 0 = inactive, 1 = active
            startAvailability   :       2,
            hoursPerWeekMin     :       2,
            hoursPerWeekMax     :       4,
            mon                 :       [12, 12, 12],
            tue                 :       [12],
            wed                 :       [1],
            thu                 :       [2],
            fri                 :       [4],
            sat                 :       [5],
            sun                 :       [1]
        },

        spokenLanguages: {
            English:true,
            Spanish:false
        }
    })

    user.save(function(err, user){
        if(err){
            return console.error(err);
            process.exit(1);
        }
        console.log(user);

        process.exit(1);
    })
});
