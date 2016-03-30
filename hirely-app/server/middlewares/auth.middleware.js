var jwt = require('jsonwebtoken');
var userModel = require('../models/user.model');
var config = require('../config');
var apiUtil = require('../utils/api-response');

module.exports = function(req, res, next) {
    if(req.method == 'OPTIONS') next();

    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization, config.jwtSecret, function(err, payload) {
            console.log("Payload: "+payload);
            if (err) {
                console.log("Auth token declined");
                res.status(401).json(apiUtil.generateResponse(401, "Auth token declined", null));
                return;
            } else {
                // do something with the string, which will look like "Bearer ____"
                userModel.findById(payload.userId).then(function (user) {
                    if (user) {
                        req.user = user;
                        console.log("Logged in as " + user.email)
                    } else {
                        console.log("ERROR: User not found in auth");
                    }
                    next();
                })
            }
        });

    } else {
        next();
    }

};