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
    var variantId = new mongoose.Types.ObjectId().toHexString();
    var locationId2 = new mongoose.Types.ObjectId().toHexString();
    var positionId2 = new mongoose.Types.ObjectId().toHexString();
    var variantId2 = new mongoose.Types.ObjectId().toHexString();
    var variantId3 = new mongoose.Types.ObjectId().toHexString();

    var bdata = {
        name: 'Compass Coffee',
        slug: 'compass-coffee',
        email: Math.round(Math.random()*1000).toString() + 'IYAD.bitar@gmail.com',
        website:'http://compasscoffee.com',
        description: 'A local coffee shop in a cool neighborhood.  We look for friendly, enthusiastic, hardworking, teachable coffee lovers.',
        agreedToTerms:true,
        photoUrl:  "http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2013/12/starbucks-canal-street-NOLA-store-6.jpg",
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
                onetClass: '11-1011.03',
                slug: 'barista'
            },
            tmpPositionId2: {
                _id: positionId2,
                location_id: locationId2,
                title: 'Web Developer',
                onetClass: '11-1011.03',
                slug: 'barista2'
            }
        }, // positions array
        positionSlugs: {
            'barista': positionId,
            'barista2': positionId2
        },
        variants: {
            tmpVariantId: {
                _id: variantId,
                location_id: locationId,
                position_id: positionId,
                title: 'Morning Barista',
                workType: 'part-time',
                slug: 'morning-barista',
                hoursPerWeekMin: 1,
                hoursPerWeekMax: 2,
                minOpeningShifts: 2,
                minClosingShifts: 3,
                minWeekdayShifts: 3,
                minWeekendShifts: 3,
                openings: 3,

                compensation: {
                    wageType: 'hourly',
                    wageAmount: 10,
                    commission: false,
                    tips: false
                },

                benefits: {
                    paidVacation: true,
                    paidSickTime: false,
                    flexibleSchedul: false,
                    healthInsurance: false,
                    dentalInsurance: true,
                    retirementPlan: true,
                    discounts: false
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


            }, ///variant object
            tmpVariantId2: {
                _id: variantId2,
                location_id: locationId2,
                position_id: positionId2,
                title             :     'Late night developer',
                workType          :     'part-time',
                slug              :     'morning-barista2',
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

                prescreenQuestions:[
                    {
                        question:'what\'s up?',
                    }
                ],


            },///variant object
            tmpVariantId3: {
                _id: variantId3,
                location_id: locationId2,
                position_id: positionId2,
                title             :     'Morning Developer',
                workType          :     'part-time',
                slug              :     'morning-barista3',
                hoursPerWeekMin   :     1,
                hoursPerWeekMax   :     2,
                minOpeningShifts  :     2,
                minClosingShifts  :     3,
                minWeekdayShifts  :     3,
                minWeekendShifts  :     3,
                openings          :     3,
                experienceLvl     :     1,

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


            }///variant object
        }, // variants array
        variantSlugs: {
            'morning-barista': variantId,
            'morning-barista2': variantId2,
            'morning-barista3': variantId3,
        }
    };

    
    // Now replace tmp ids with unique
    bdata['locations'][locationId] = bdata['locations']['tmpLocationId'];
    delete bdata['locations']['tmpLocationId'];

    bdata['positions'][positionId] = bdata['positions']['tmpPositionId'];
    delete bdata['positions']['tmpPositionId'];

    bdata['variants'][variantId] = bdata['variants']['tmpVariantId'];
    delete bdata['variants']['tmpVariantId'];

    bdata['locations'][locationId2] = bdata['locations']['tmpLocationId2'];
    delete bdata['locations']['tmpLocationId2'];

    bdata['positions'][positionId2] = bdata['positions']['tmpPositionId2'];
    delete bdata['positions']['tmpPositionId2'];

    bdata['variants'][variantId2] = bdata['variants']['tmpVariantId2'];
    delete bdata['variants']['tmpVariantId2'];

    bdata['variants'][variantId3] = bdata['variants']['tmpVariantId3'];
    delete bdata['variants']['tmpVariantId3'];


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
