var jwt = require('jsonwebtoken');
var userModel = require('../models/user.model');
var config = require('../config');
var apiUtil = require('../utils/api-response');
var permissionModel = require('../models/permission.model');

module.exports = function(req, res, next) {
    req.user = null;
    req.userId = null;
    req.permissions = [];
    req.isSuperUser = false;

    if(req.method == 'OPTIONS') next();

    console.log("Auth: "+req.headers.authorization);
    if (req.headers.authorization && req.headers.authorization != null && req.headers.authorization != 'null') {
        jwt.verify(req.headers.authorization, config.jwtSecret, function(err, payload) {
            // console.log("Payload: "+payload);
            if (err) {
                console.log("Auth token declined");
                res.status(401).json(apiUtil.generateResponse(401, "Auth token declined", null));
                return;
            } else {
                // do something with the string, which will look like "Bearer ____"
                userModel.findById(payload.userId).then(function (user) {
                    if (user) {
                        req.user = user;
                        req.userId = user._id;
                        // console.log("Logged in as " + user._id);
                        permissionModel.find({srcId: user._id}).then(function(permissions) {
                            req.permissions = permissions;
                            permissions.forEach(function(permission) {
                               if (permission.destId == "*" && permission.destType == "*") {
                                   console.log("Is superuser");
                                   req.isSuperUser = true;
                               }
                            });
                            next();
                        })
                    } else {
                        console.log("ERROR: User not found in auth");
                        next();
                    }
                })
            }
        });

    } else {
        next();
    }

};