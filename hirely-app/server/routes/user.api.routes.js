var PermissionService = require('../services/permissions.service');
var UserService = require('../services/user.service');
var apiUtil = require('../utils/api-response');
var config = require('../config');

var userRoutes = {

    getById: function(req, res){

        if (!(req.isSuperUser || req.userId == req.params.id)) {
            res.status(403).json(apiUtil.generateResponse(403, "Forbidden", null));
            return;
        }

        /**
         * Send public info if all is not requested
         */
        UserService.getById(req.params.id, req.query)
            .then(
                function(user){
                    res.status(200).json(apiUtil.generateResponse(200, "User retrieved successfully", user));
                },
                function(error){
                    //// user couldn't be found 404
                    res.status(500).json(apiUtil.generateResponse(404, "User couldn't be located", null));
                }
            );
    },

    getToken: function(req, res){
        if (!req.userId) {
            res.status(403).json(apiUtil.generateResponse(403, "Forbidden", null));
            return;
        }
        var isBusinessUser = PermissionService.isBusinessUser(req.permissions);
        var expiresIn = config.tokenLifeDefault;
        if (isBusinessUser) expiresIn = config.tokenLifeBusiness;
        
        req.user.permissions = req.permissions;

        UserService.getUserAndTokenObj(req.user, expiresIn, req.permissions).then(function(userAndToken) {
            res.status(200).json(apiUtil.generateResponse(200, "Token retrieved successfully", userAndToken));
        });

    },

    createNewUser : function(req, res){

        var user = req.body;

        if (!(user.email && user.password)) {
            res.status(404).json(apiUtil.generateResponse(404, "email and password are required", null));
            return;
        }


        UserService.createNewUser(user)
            .then(
                function(userAndToken){
                    // console.log(userAndToken);
                    res.status(200).json(apiUtil.generateResponse(200, "User created successfully", userAndToken));
                },
                function(error){
                    console.log("Create User Error: "+error);
                    res.status(200).json(apiUtil.generateResponse(200, "Create User Error", null));
                }
            )

    },

    createInvitationToken : function(req, res) {
        
        var permObjs = req.body.permObjs;
        var expiresIn = req.body.expiresIn;

        var demoPermObj = {
            destType: 'positions',
            destId: "56e9f06e23eddcf5e600115a",
            c: false, r: true, u: false, d: false
        };
        permObjs.push(demoPermObj);
        
        PermissionService.checkPermissions(req.permissions, permObjs).then(function(grant) {
            if (!grant) {
                res.status(403).json(apiUtil.generateResponse(403, "Forbidden", null));
                return;
            }

            var token = UserService.createInvitationToken(permObjs, expiresIn);
            res.status(200).json(apiUtil.generateResponse(200, "Invitation Results", token));
        });
    },

    passwordLogin : function(req, res) {

        var skipPasswordCheck = req.isSuperUser;
        console.log("req.isSuperUser:"+req.isSuperUser);
        var isBusinessUser = PermissionService.isBusinessUser(req.permissions);

        UserService.passwordLogin(req.body.email, req.body.password, skipPasswordCheck, isBusinessUser)
            .then(
                function(userAndToken) {
                    res.status(200).json(apiUtil.generateResponse(200, "Password login results", userAndToken));
                },
                function(error) {
                    res.status(error.code).json(apiUtil.generateResponse(error.code, error.message, null));
                }
            )

        //res.json(apiUtil.generateResponse(200, "New user created successfully", result));
    },

    saveUser: function(req, res){

        if (!(req.isSuperUser || req.userId == req.params.id)) {
            res.status(403).json(apiUtil.generateResponse(403, "Forbidden", null));
            return;
        }

        UserService.saveUser(req.params.id, req.body)
        .then(
            function(user){
                res.status(200).json(apiUtil.generateResponse(200, "User updated successfully", user));
            },
            function(error){
                //// user couldn't be saved 404
                res.status(500).json(apiUtil.generateResponse(500, error, null));
            }
        );
    }, //// fun. saveUser


    updateUserMetricsById: function(req, res){
        UserService.updateUserMetricsById(req.params.id).then(
            function(user) {
                res.status(200).json(apiUtil.generateResponse(200, "User updated successfully", user));
            },
            function(error){
                //// user couldn't be saved 404
                console.log("ERROR:  updateUserMetricsById "+error);
                res.status(404).json(apiUtil.generateResponse(404, error, null));
            }
        );
    }

}/// users object

module.exports = userRoutes;