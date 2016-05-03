var config = require('../config')
var mongoose = require('mongoose');
var BusinessModel = require('../models/business.model.js');
//var ObjectID = require('mongoose').ObjectID;

mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {

    BusinessModel.remove({name: "TestBusiness"})
        .then(function (res) {

            var business = new BusinessModel({
                name: 'TestBusiness',
                slug: 'test-business',
                disabled: false,
                email: 't@testbusiness.com',
                website: 'http://testbusiness.com',
                description: 'A local coffee shop in a cool neighborhood.  We look for friendly, enthusiastic, hardworking, teachable coffee lovers.',
                agreedToTerms: true,
                hasOpenings: true,
                heroImageURL: 'http://compasscoffee.com/assets/img/compassbackground.jpg',
                logoImageURL: 'http://compasscoffee.com/assets/img/compasslogo.png'
            });

            return business.save().then(
                function () {
                    console.log("Save success 0");
                    return business;
                },
                function (err) {
                    console.dir("Save error 0: "+err);
                }
            );
        })
        .then(function (business) {

            var location1 = {
                "disabled": false,
                "heroImageURL": "https://s3.amazonaws.com/hirely.io/business-photos/hirely-demo/hirely_demo_hero.jpg",
                "name": "Downtown",
                "country": "USA",
                "state": "DC",
                "city": "Washington",
                "street1": "1133 15th St NW",
                "street2": "",
                "street3": "",
                "postalCode": "20005",
                "phone": "202.517.1777",
                "formattedAddress": "1133 15th St NW, Washington, DC 20005",
                "googlePlaceId": "ChIJmTS957-3t4kRzTa8NGzTxc4 ",
                "lng": -77.0339960000000019,
                "lat": 38.9048640000000034,
                "neighborhood": "Downtown",
                "slug": "dc-washington-downtown",
                "hoursOfOperation": {
                    "mon": [
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23
                    ],
                    "tue": [
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23
                    ],
                    "wed": [
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23
                    ],
                    "thu": [
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23
                    ],
                    "fri": [
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23
                    ],
                    "sat": [
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23,
                        24
                    ],
                    "sun": [
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23,
                        24
                    ]
                }
            };

            location1._id = new mongoose.Types.ObjectId().toHexString();
            var locations =  {};
            locations[location1._id] = location1;
            business.locations = locations;

            var locationSlugs = {};
            locationSlugs[location1.slug] = location1._id;
            business.locationSlugs = locationSlugs;

            return business.save().then(
                function () {
                    console.log("Save success 1");
                    return business;
                },
                function (err) {
                    console.dir("Save error 1: "+err);
                }
            );
        })
        .then(function (business) {

            var locations = business.locations.toObject();
            var location = locations[Object.keys(locations)[0]];

            var position1 = {
                "locationId": location._id,
                "disabled": false,
                "title": "Position Demo",
                "occId": "35-3022.01",
                "slug": "position-demo",
                "workType": "full-time",
                "description": "Promotes coffee consumption by educating customers; selling coffee and coffee grinding and brewing equipment, accessories, and supplies; preparing and serving a variety of coffee drinks, along with pastries and cookies.",
                "hoursPerWeekMin": 20,
                "hoursPerWeekMax": 40,
                "minOpeningShifts": 2,
                "minClosingShifts": 3,
                "minWeekdayShifts": 3,
                "minWeekendShifts": 3,
                "openingsCount": 3,
                "expLvl": 3,
                "compensation": {
                    "wageType": "hourly",
                    "wageAmount": 12,
                    "commission": false,
                    "tips": false
                },
                "benefits": {
                    "paidVacation": true,
                    "paidSickTime": true,
                    "flexibleSchedul": true,
                    "healthInsurance": true,
                    "dentalInsurance": true,
                    "retirementPlan": true,
                    "discounts": true,
                    "commission": false,
                    "tips": false,
                    "bonus": false
                },
                "shifts": {
                    "mon": [],
                    "tue": [],
                    "wed": [],
                    "thu": [],
                    "fri": [],
                    "sat": [],
                    "sun": [],
                    "required": false
                },
                "prescreenQuestions": [
                    {
                        "question": "Why do you want to work at Hirely?",
                        "required": true
                    }
                ],
                "jobDuties": [
                    "Welcomes customers by determining their coffee interests and needs.",
                    "Educates customers by presenting and explaining the coffee drink menu; answering questions.",
                    "Sells coffees and coffee grinding and brewing equipment by explaining differences in coffee beans and coffee preparation machines; demonstrating how brewing equipment operates.",
                    "Prepares and sells coffee drinks by following prescribed recipes and preparation techniques for coffee drinks, such as, expresso, expresso lungo, caffe latte, and cappuccino.",
                    "Generates revenues by attracting new customers; defining new and expanded services and products.",
                    "Maintains inventories by replenishing coffee bean supply; stocking coffee brewing equipment; maintaining supplies, pastries, and cookies for coffee bar.",
                    "Keeps equipment operating by following operating instructions; troubleshooting breakdowns; maintaining supplies; performing preventive maintenance; calling for repairs.",
                    "Maintains safe and healthy work environment by following organization standards and sanitation regulations.",
                    "Improves quality results by studying, evaluating, and re-designing processes; implementing changes; maintaining and improving the appearance of the store and coffee bar.",
                    "Updates job knowledge by participating in educational opportunities; reading coffee, retail trade, and food service publications; maintaining personal networks.",
                    "Enhances coffee shop reputation by accepting ownership for accomplishing new and different requests; exploring opportunities to add value to job accomplishments."
                ],
                "idealCandidate": [
                    "Eager to learn and grow in a fast-paced, high volume, and team-oriented atmosphere",
                    "Warm, friendly, and highly motivated candidates to be future leaders in a hospitality-driven, fun, and team-oriented environment",
                    "Previous hospitality and/or food service experience, a plus – we’ll teach you the rest!",
                    "Ability to learn quickly in fast-paced, high volume environment",
                    "Self-motivated achiever interested in taking on additional roles and responsibilities",
                    "Open availability and flexibility is a must – ability to work a variety of shifts",
                    "Must be dedicated to excellence and hospitality"
                ]
            };

            position1._id = new mongoose.Types.ObjectId().toHexString();
            var positions = {};
            positions[position1._id] = position1;
            business.positions = positions;

            var positionSlugs = {};
            positionSlugs[position1.slug] = position1._id;
            locations[location._id].positionSlugs = positionSlugs;
            business.locations = locations;

            return business.save().then(
                function () {
                    console.log("Save success 2");
                    return business;
                },
                function (err) {
                    console.dir("Save error 2: "+err);
                }
            );

        });

});
