'use strict';

// This part is useful if restoring parts of a backup
// var UserModel = require('./user.model');
// var usersBak = require('./usersBak');
// var Q = require('Q');
// console.log("Running...");
// var promises = [];
// for (let userBak of usersBak) {
//     promises.push(UserModel.findById(userBak._id).then(function(user) {
//         try {
//             var edusBak = userBak.education;
//
//             var edusNextIds = [];
//
//             var countBak = userBak.education.length;
//             var countNow = user.education.length;
//
//             for (let eduNext of user.education) {
//                 edusNextIds.push(''+eduNext._id);
//             }
//
//             for (let eduBak of edusBak) {
//                 if (edusNextIds.indexOf(''+eduBak._id)==-1) {
//                     edusNextIds.push(''+eduBak._id);
//                     user.education.push(eduBak);
//                 }
//             }
//
//             var countNext = user.education.length;
//
//             user.save().then(function(user){ console.log(user._id+": " + (user.education.length-countNow));}, function(err) {console.log("Save Error: "+err);});
//
//             // console.log(countBak+"->"+countNow+"->"+countNext);
//             // console.log("Recovered " + (countNext-countNow));
//             return (countNext-countNow);
//         } catch (err) {
//             console.error("Error: "+err);
//             return 0;
//         }
//     }));
// }
//
// Q.all(promises).then(function(results) {
//     var sum = 0;
//     results.forEach(function(res) { sum+=res;})
//     console.log("Recovered Total: " + sum);
// });


// This snippet useful to update users with a constant
// var UserModel = require('./user.model');
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



// This snippet useful to update apps with a constants
var ApplicationModel = require('./application.model');
var UserModel = require('./user.model');
console.log("Running...");
ApplicationModel.find({}).then(function(apps) {
    console.log("Found apps");
    apps.forEach(function(app) {

        // app.status = 1;
        // app.save();

        // The following is useful if you need to update initial history with the applicant user name
        // UserModel.findById(app.userId).then(
        //     function(user) {
        //
        //         try {
        //             app.appliedAt = app.createdAt;
        //
        //             var historyEntry = {
        //                 time: app.createdAt,
        //                 type: 'StatusChange',
        //                 subject: "Status changed from Started to Pre-screening",
        //                 body: "Status changed from Started to Pre-screening",
        //                 meta: {
        //                     fromStatus: app.status,
        //                     toStatus: app.status
        //                 },
        //                 userId: app.userId,
        //                 userFirstName: user.firstName,
        //                 userLastName: user.lastName
        //             };
        //
        //             app.history = [historyEntry];
        //             app.status = 1;
        //             app.save().then(
        //                 function (app) {
        //                     console.log("app save: " + app._id);
        //                 },
        //                 function (err) {
        //                     console.log("app error: " + app._id + " : " + err);
        //                 }
        //             );
        //         } catch (err) {
        //             console.log("app syntax error: " + app._id + " : " + err);
        //         }
        //     },
        //     function(err) {
        //         console.log("User "+app.userId+" DNE.");
        //     }
        // )
    });
    console.log("Done.");
});