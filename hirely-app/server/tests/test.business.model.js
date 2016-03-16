var config = require('../config')
var mongoose = require('mongoose');
var BusinessModel = require('../models/business.model.js');
//var ObjectID = require('mongoose').ObjectID;

mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:') );

db.once('open', function(){

    // Now replace tmp ids with unique
    var locationId = new mongoose.Types.ObjectId().toHexString();
    var positionId = new mongoose.Types.ObjectId().toHexString();
    var locationId2 = new mongoose.Types.ObjectId().toHexString();
    var positionId2 = new mongoose.Types.ObjectId().toHexString();

    var bdata = {
        name: 'Compass Coffee',
        slug: 'compass-coffee',
        email: Math.round(Math.random()*1000).toString() + 'IYAD.bitar@gmail.com',
        website:'http://compasscoffee.com',
        description: 'A local coffee shop in a cool neighborhood.  We look for friendly, enthusiastic, hardworking, teachable coffee lovers.',
        agreedToTerms:true,
        hasOpenings: true,
        heroImageURL: 'http://compasscoffee.com/assets/img/compassbackground.jpg',
        logoImageURL: 'http://compasscoffee.com/assets/img/compasslogo.png',
        // photoUrl:  "http://compasscoffee.com/assets/img/compassbackground.jpg",
        locations: {
            tmpLocationId: {
                _id: locationId,
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
                googlePlaceId: 'dslkjflsdk',
                lng: -77.0576414,
                lat: 38.9340854,
                neighborhood: 'Shaw',
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
                positionSlugs: {
                    'barista': positionId,
                }

            },
            tmpLocationId2: {
                _id: locationId2,
                name:'C3 Workplace',
                country:'USA',
                state:'NJ',
                city:'Montclair',
                street1:'26 Park St.',
                street2: '',
                street3: '',
                postalCode: '07012',
                phone: '+1.222.222.2222',
                formattedAddress: '24 Kenter Pl, Montclair, NJ 07012',
                googlePlaceId:  'sdlkfjsdlkjf',
                lng: -77.0576414,
                lat: 38.9340854,
                neighborhood: 'Shaw',
                slug: 'dc-washington-shaw-2',
                hoursOfOperation: {
                    mon   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    tue   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    wed   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    thu   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    fri   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    sat   : [6, 7, 8, 9 ,10, 11, 12, 13, 14, 15, 16, 17, 18],
                    sun   : [8, 9 ,10, 11, 12, 13, 14, 15, 16, 17]
                },
                positionSlugs: {
                    'web-developer': positionId2,
                }
            }
        }, //// location array
        locationSlugs: {
            'dc-washington-shaw': locationId,
            'dc-washington-shaw-2': locationId2
        },
        positions: {
            tmpPositionId: {
                _id: positionId,
                location_id: locationId,
                title: 'Barista',
                occId: '35-3022.01',
                slug: 'barista',
                workType: 'part-time',
                description: 'Compass Coffee Barista are passionate about bikes and dedicated to the people that ride them. We love to teach, so if you love to learn about bicycles and share your expertise with others, and you are devoted to providing an exceptional customer service experience, learn more about becoming a Sales Associate at Revolution Cycles.',
                hoursPerWeekMin: 1,
                hoursPerWeekMax: 2,
                minOpeningShifts: 2,
                minClosingShifts: 3,
                minWeekdayShifts: 3,
                minWeekendShifts: 3,
                openingsCount: 3,
                expLvl: 2,

                scoreWeights: {
                    exp: .2,
                    edu: .1,
                    qual: .2,
                    psy: .5
                },

                compensation: {
                    wageType: 'hourly',
                    wageAmount: 10,
                    commission: false,
                    tips: false
                },

                benefits: {
                    paidVacation: true,
                    paidSickTime: true,
                    flexibleSchedul: true,
                    healthInsurance: true,
                    dentalInsurance: true,
                    retirementPlan: true,
                    discounts: true,
                    commission: true,
                    tips: true,
                    bonus: true
                },

                shifts: {
                    mon: [1, 2, 2],
                    tue: [0, 4, 5],
                    wed: [1],
                    thu: [],
                    fri: [],
                    sat: [],
                    sun: [],
                    required: false
                },

                prescreenQuestions: [
                    {
                        question: 'what\'s up?',
                    }
                ],

                jobDuties: [
                    'Complete an industry-leading 30 day training program which involves in-store training as well as paid, at-home internet-based training',
                    'Interact with customers and provide exemplary customer service; educate customers about bicycles, bicycle accessories and clothing, and any other cycling-related products in the store',
                    'Perform bike fittings for bikes of all makes and models',
                    'Learn from your coworkers and share knowledge regarding new products and events',
                    'Perform other tasks assigned by management',
                    'Learn, understand and adhere to company policy, programs and standards'
                ],
                idealCandidate:[
                    'Should be passionate about cycling as well as promoting the benefits of a cycling lifestyle and culture. Candidate doesn’t necessarily need to have prior sales or bicycle retail experience, but must be willing to learn about bicycles, cycling accessories, and cycling culture.',
                    'Is comfortable working as part of a commission-based system where sales performance is measured',
                    'Enthusiastically embraces the concept of serving the customer and providing an exceptional retail experience',
                    'Is capable of safely lifting and carrying 40lbs on a regular basis',
                    'Is intrinsically motivated, able to work both independently and as a member of a team, and thrives in a dynamic, fast-paced environment'
                ]
            },
            tmpPositionId2: {
                _id: positionId2,
                location_id: locationId2,
                title: 'Web Developer',
                occId: '15-1199.09',
                slug: 'web-developer',
                workType          :     'part-time',
                hoursPerWeekMin   :     1,
                hoursPerWeekMax   :     2,
                minOpeningShifts  :     2,
                minClosingShifts  :     3,
                minWeekdayShifts  :     3,
                minWeekendShifts  :     3,
                openingsCount     :     3,
                expLvl: 3,
                scoreWeights: {
                    exp: .2,
                    edu: .1,
                    qual: .2,
                    psy: .5
                },

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

                prescreenQuestions:[
                    {
                        question:'what\'s up?',
                    }
                ],

                jobDuties: [
                    'Complete an industry-leading 30 day training program which involves in-store training as well as paid, at-home internet-based training',
                    'Interact with customers and provide exemplary customer service; educate customers about bicycles, bicycle accessories and clothing, and any other cycling-related products in the store',
                    'Perform bike fittings for bikes of all makes and models',
                    'Learn from your coworkers and share knowledge regarding new products and events',
                    'Perform other tasks assigned by management',
                    'Learn, understand and adhere to company policy, programs and standards'
                ],
                idealCandidate:[
                    'Should be passionate about cycling as well as promoting the benefits of a cycling lifestyle and culture. Candidate doesn’t necessarily need to have prior sales or bicycle retail experience, but must be willing to learn about bicycles, cycling accessories, and cycling culture.',
                    'Is comfortable working as part of a commission-based system where sales performance is measured',
                    'Enthusiastically embraces the concept of serving the customer and providing an exceptional retail experience',
                    'Is capable of safely lifting and carrying 40lbs on a regular basis',
                    'Is intrinsically motivated, able to work both independently and as a member of a team, and thrives in a dynamic, fast-paced environment'
                ]
            }
        }, // positions array
    };


    // Now replace tmp ids with unique
    bdata['locations'][locationId] = bdata['locations']['tmpLocationId'];
    delete bdata['locations']['tmpLocationId'];

    bdata['positions'][positionId] = bdata['positions']['tmpPositionId'];
    delete bdata['positions']['tmpPositionId'];

    bdata['locations'][locationId2] = bdata['locations']['tmpLocationId2'];
    delete bdata['locations']['tmpLocationId2'];

    bdata['positions'][positionId2] = bdata['positions']['tmpPositionId2'];
    delete bdata['positions']['tmpPositionId2'];


    //console.dir()

    var b = new BusinessModel(bdata);

    b.save(function(err, user){
        if(err){
            return console.error(err);
            process.exit(1);
        }
        console.log(user);

        process.exit(1);
    })
});
