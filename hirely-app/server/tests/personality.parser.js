var config = require('../config')
var mongoose = require('mongoose');
var UserModel = require('../models/user.model.js');

mongoose.connect(config.mongoUri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:') );


db.once('open', function(){
    personality = UserModel.findById('56980ba5370697b85da89778', 'personalityExams').exec()
    .then(
        function(per){
            console.log("found");
            // console.log(per.personalityExams);
            var summary = {};
            var obj = per.personalityExams[0];
            console.log(obj);
            summary.personalityBlend = {};
            summary.personalityBlend.name = obj.personalityBlend.name
            summary.personalityBlend.personalityTypes = []
            summary.personalityBlend.personalityTypes.push(obj.personalityBlend.personality_type_1);
            console.log("done");
            // for(var key in obj.personalityBlend) console.log(key);
            console.log(obj.personalityBlend.personality_type_2);
            process.exit();
        }
    )//// then
});
