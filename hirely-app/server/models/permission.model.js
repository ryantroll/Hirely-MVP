var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var permissionSchema = new Schema({
    srcId: {type: String, index: true},
    srcType:  {type: String, index: true},
    destId:  {type: String, index: true},
    destType: {type: String, index: true},
    c: {type: Boolean, default: false},
    r: {type: Boolean, default: false},
    u: {type: Boolean, default: false},
    d: {type: Boolean, default: false}
});


var permissionModel = mongoose.model('Permission', permissionSchema, "permission");

module.exports = permissionModel;
//
// var u = require('./user.model');
//
// u.find({}).then(function(users) {
//     users.forEach(function(user) {
//         var p = permissionModel({
//             srcId: user._id,
//             srcType: "users",
//             destId: "*",
//             destType: "*",
//             c: true, r: true, u: true, d: true
//         });
//         p.save();
//     });
// });
