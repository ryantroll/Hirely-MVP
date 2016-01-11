var config = require('../config')
var mongoose = require('mongoose');
var BusinessModel = require('../models/business.model.js');

mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:') );

db.once('open', function(){
    var b = new BusinessModel({
        name: 'compass coffee',
        email: Math.round(Math.random()*1000).toString() + 'IYAD.bitar@gmail.com',
        website:'http://compasscoffee.com',
        description: 'A local coffee shop in a cool neighborhood.  We look for friendly, enthusiastic, hardworking, teachable coffee lovers.',
        agreedToTerms:true,
        photoUrl:  "http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2013/12/starbucks-canal-street-NOLA-store-6.jpg",
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
                phone: '+1.222.222.2222',
                formattedAddress: '24 Kenter Pl, Montclair, NJ 07012',
                lng: -77.0576414,
                lat: 38.9340854,

                slug: 'dc-washington-shaw',

                hoursOfOperation: {
                    mon   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    tue   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    wed   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    thu   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    fri   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    sat   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    sun   : [8, 9 ,10, 11, 12, 13, 14, 15, 16, 17]
                },

                positions:[
                    {
                        title: 'Barista',
                        onetClass: '11-1011.03',

                        slug: 'barista',

                        variants:[
                            {
                                title             :     'Morning Barista',
                                workType          :     'part-time',
                                slug              :     'morning-barista',
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
