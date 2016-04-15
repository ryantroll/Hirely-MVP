'use strict';
var UserModel = require('./user.model');

var usersBak = require('./usersBak');

var Q = require('Q');

console.log("Running...");
var promises = [];
for (let userBak of usersBak) {
    promises.push(UserModel.findById(userBak._id).then(function(user) {
        try {
            var edusBak = userBak.education;

            var edusNextIds = [];

            var countBak = userBak.education.length;
            var countNow = user.education.length;

            for (let eduNext of user.education) {
                edusNextIds.push(''+eduNext._id);
            }

            for (let eduBak of edusBak) {
                if (edusNextIds.indexOf(''+eduBak._id)==-1) {
                    edusNextIds.push(''+eduBak._id);
                    user.education.push(eduBak);
                }
            }

            var countNext = user.education.length;

            user.save().then(function(user){ console.log(user._id+": " + (user.education.length-countNow));}, function(err) {console.log("Save Error: "+err);});

            // console.log(countBak+"->"+countNow+"->"+countNext);
            // console.log("Recovered " + (countNext-countNow));
            return (countNext-countNow);
        } catch (err) {
            console.error("Error: "+err);
            return 0;
        }
    }));
}

Q.all(promises).then(function(results) {
    var sum = 0;
    results.forEach(function(res) { sum+=res;})
    console.log("Recovered Total: " + sum);
});


//
// console.log("Running...");
// UserModel.find({}).then(function(users) {
//     console.log("Found users");
//     users.forEach(function(user) {
//         console.log("user: "+user.email);
//         // user.queuedForMetricUpdate = true;
//         // user.education.forEach(function(edu) {
//         //     edu.focus = "Biology";
//         //     delete edu.degree;
//         // })
//
//         user.save();
//     });
//     console.log("Done.");
// });