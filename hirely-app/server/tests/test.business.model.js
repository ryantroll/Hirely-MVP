var config = require('../config')
var mongoose = require('mongoose');
var BusinessModel = require('../models/business.model.js');

mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:') );

db.once('open', function(){
    var b = new BusinessModel({
        name: 'Starbucks',
        email: 'iyad.bitar@gmail.com',
        website:'http://test.com',
        agreedToTerms:true,
        locations:[
            {
                name:'Clifton',

                country:'USA',
                state:'NJ',
                city:'Montclair',
                street1:'24 Kenter Pl.',
                street2: '',
                street3: '',
                postalCode: '07012',
                formattedAddress: '24 Kenter Pl, Montclair, NJ 07012',
                lng: 12.39439493,
                lat: -99.88888,

                positions:[
                    {
                        title: 'Barista',
                        onetClass: '11-1011.03',

                        variants:[
                            {
                                workType          :     'part-time',
                                hoursPerWeekMin   :     1,
                                hoursPerWeekMax   :     2,
                                minOpeningShifts  :     2,
                                minClosingShifts  :     3,
                                minWeekdayShifts  :     3,
                                minWeekendShifts  :     3,
                                openings          :     3,

                                compensation:
                                {
                                  wageType        :     'hourly',
                                  wageAmount      :     10,
                                  commission      :     false,
                                  tips            :     false
                                },

                                benefits:
                                {
                                  paidVacation    :     true,
                                  paidSickTime    :     false,
                                  flexibleSchedul :     false,
                                  healthInsurance :     false,
                                  dentalInsurance :     true,
                                  retirementPlan  :     true,
                                  discounts       :     false
                                },

                                shifts:
                                  {
                                    mon           :       [1, 2, 2],
                                    tue           :       [0,4,5],
                                    wed           :       [1],
                                    thu           :       [],
                                    fri           :       [],
                                    sat           :       [],
                                    sun           :       [],
                                    required      :       false
                                  },

                                applications:[
                                    {
                                        userId:'lkd098098sds98d09',
                                        status:1,
                                        prescreenAnswers:[
                                            {
                                                question:'what\'s up?',
                                                answer: 'Nothing'
                                            }
                                        ]
                                    }
                                ]/// applicaiton object
                            }///variant object
                        ]
                    }
                ]//// psostions array

            }
        ]//// location array
    });

    b.save(function(err, user){
        if(err){
            return console.error(err);
            process.exit(1);
        }
        console.log(user);

        process.exit(1);
    })
});
