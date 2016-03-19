var userService = require('../services/user.service');
var apiUtil = require('../utils/api-response');

var userRoutes = {

    getAll : function(req, res){
        /**
         * Get all users
         */
        userService.getAll(req.query)
        .then(
            function(users){
                res.status(200).json(apiUtil.generateResponse(200, "Users retrieved successfully", users));
            },
            function(error){
                //// user couldn't be found 404
                res.status(500).json(apiUtil.generateResponse(404, "Users couldn't be located", null));
            }
        );
    },

    getById: function(req, res){
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

        userService.createNewUser(user)
        .then(
            function(user){
                console.log(user);
                res.status(200).json(apiUtil.generateResponse(200, "User created successfully", user));
            },
            function(error){
                res.status(500).json(apiUtil.generateResponse(error.code, error.message, null));
            }
        )

        //res.json(apiUtil.generateResponse(200, "New user created successfully", result));
    },

    getUserByExternalId: function(req, res){
        userService.getUserByExternalId(req.params.extId, req.query)
        .then(
            function(user){
                res.status(200).json(apiUtil.generateResponse(200, "User retrieved successfully", user));
            },
            function(error){
                //// user couldn't be found 404
                // console.log(error);
                res.status(500).json(apiUtil.generateResponse(500, "User couldn't be located with suplied external id", null));
            }
        );
    },//// fun. getUserByExternalId

    saveUser: function(req, res){
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