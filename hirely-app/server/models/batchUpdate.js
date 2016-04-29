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
//
//         var fileUrl = user.profileImageURL;
//         if (fileUrl == "https://lh3.googleusercontent.com/-1p0-ELNl0mk/AAAAAAAAAAI/AAAAAAAAAAA/xeGC2Eu7i0o/photo.jpg") {
//             user.profileImageURL = null;
//             user.profileImageThumbURL = null;
//         }
//         else if (fileUrl) {
//             var splitPoint = fileUrl.search('/profile-photos');
//             var thumbUrl = fileUrl.slice(0, splitPoint) + '/thumbnails' + fileUrl.slice(splitPoint);
//             user.profileImageThumbURL = thumbUrl;
//         }
//
//         // user.queuedForMetricUpdate = true;
//         // user.education.forEach(function(edu) {
//         //     edu.focus = "Biology";
//         //     delete edu.degree;
//         // })
//
//         user.save()
//     });
//     console.log("Done.");
// });



// This snippet useful to update apps with a constants
// var ApplicationModel = require('./application.model');
// console.log("Running...");
// // Demo positionId = 56e9f06e23eddcf5e600115a
// ApplicationModel.find({positionId: "56e9f06e23eddcf5e600115a"}).then(function(apps) {
//     console.log("Found apps");
//     apps.forEach(function(app) {
//
//         app.status = 2;
//         app.history = app.history.slice(0,2);
//         app.save();
//     });
//     console.log("Done.");
// });



// This snippet useful to update users with a constant
// var BusinessModel = require('./business.model');
// console.log("Running...");
// BusinessModel.find({}).then(function(businesses) {
//     console.log("Found businesses");
//     businesses.forEach(function(business) {
//         console.log("business: "+business.slug);
//
//         business.save()
//     });
//     console.log("Done.");
// });