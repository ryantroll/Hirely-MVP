var permissionService = require('../services/permissions.service');
var userService = require('../services/user.service');
var apiUtil = require('../utils/api-response');

var userRoutes = {

    getById: function(req, res){

        if (!(req.isSuperUser || req.userId == req.params.id)) {
            res.status(403).json(apiUtil.generateResponse(403, "Forbidden", null));
            return;
        }

        /**
         * Send public info if all is not requested
         */
        userService.getById(req.params.id, req.query)
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

    createNewUser : function(req, res){

        var user = req.body;

        if (!(user.email && user.password)) {
            res.status(404).json(apiUtil.generateResponse(404, "email and password are required", null));
            return;
        }


        userService.createNewUser(user)
            .then(
                function(userAndToken){
                    // console.log(userAndToken);
                    res.status(200).json(apiUtil.generateResponse(200, "User created successfully", userAndToken));
                },
                function(error){
                    console.log("Create User Error: "+error);
                    res.status(200).json(apiUtil.generateResponse(200, "Email already registered", null));
                }
            )

    },

    passwordLogin : function(req, res) {
        var skipPasswordCheck = req.isSuperUser;
        var isBusinessUser = req.isSuperUser || permissionService.isBusinessUser(req.permissions);
        userService.passwordLogin(req.body.email, req.body.password, skipPasswordCheck, isBusinessUser)
            .then(
                function(user) {
                    res.status(200).json(apiUtil.generateResponse(200, "Password login results", user));
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

        userService.saveUser(req.params.id, req.body)
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
        userService.updateUserMetricsById(req.params.id).then(
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