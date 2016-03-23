var config = require('../config')
var mongoose = require('mongoose');
var UserModel = require('../models/user.model.js');

mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:') );

db.once('open', function(){
    var user = new UserModel({
        firstName:'Brian',
        lastName: 'Dombrowski',
        email: 'bdombro@gmail.com',
        mobile: '90909009',

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
        businessesAppliedTo: [],
        businessesOwned: [],
        locationsManaged: [],
        businessesStaffOf: [],
        tenureAvg: 0,

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
              scores: {}
            }
        ],

        availability: {
            seekerStatus        :       0, //// 0 = inactive, 1 = active
            startAvailability   :       2,
            hoursPerWeekMin     :       2,
            hoursPerWeekMax     :       4,
            mon                 :       [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
            tue                 :       [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
            wed                 :       [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
            thu                 :       [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
            fri                 :       [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
            sat                 :       [],
            sun                 :       []
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
