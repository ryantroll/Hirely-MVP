var applicationService = require('../services/application.service');
var apiUtil = require('../utils/api-response');

var applicationRoutes = {

    getAll : function(req, res){
        /**
         * Get all applicaitons
         */
        applicationService.getAll(req.query)
        .then(
            function(users){
                res.status(200).json(apiUtil.generateResponse(200, "Applications retrieved successfully", users));
            },
            function(error){
                //// user couldn't be found 404
                res.status(500).json(apiUtil.generateResponse(404, "Applications couldn't be located", null));
            }
        );
    },

    getById: function(req, res){
        applicationService.getById(req.params.id, req.query)
            .then(
                function(app){
                    res.status(200).json(apiUtil.generateResponse(200, "Application retrieved successfully", app));
                },
                function(error){
                    //// application couldn't be found 404
                    res.status(500).json(apiUtil.generateResponse(404, "Application couldn't be located", null));
                }
            );
    },

    getByUserId: function(req, res){
        applicationService.getByUserId(req.params.userId, req.query)
            .then(
                function(app){
                    res.status(200).json(apiUtil.generateResponse(200, "Application retrieved successfully", app));
                },
                function(error){
                    //// application couldn't be found 404
                    res.status(500).json(apiUtil.generateResponse(404, "No application found for this user", null));
                }
            );
    },

    getByVariantId: function(req, res){
        applicationService.getByVariantId(req.params.variantId, req.query)
            .then(
                function(app){
                    res.status(200).json(apiUtil.generateResponse(200, "Application retrieved successfully", app));
                },
                function(error){
                    //// application couldn't be found 404
                    res.status(500).json(apiUtil.generateResponse(404, "No application found for this variant", null));
                }
            );
    },

    createNewApplication: function(req, res){
        var application = req.body;

        applicationService.createNewApplication(application)
            .then(
                function(app){
                    res.status(200).json(apiUtil.generateResponse(200, "Application created successfully", app));
                },
                function(error){
                    res.status(500).json(apiUtil.generateResponse(404, error, null));
                }
            )/// .then
    },

    saveApplication: function(req, res){
        var application = req.body;

        applicationService.saveApplication(req.params.appId, application)
        .then(
            function(app){
                res.status(200).json(apiUtil.generateResponse(200, "Application created successfully", app));
            },
            function(error){
                res.status(500).json(apiUtil.generateResponse(404, error, null));
            }
        )/// .then
    }

    // createNewUser : function(req, res){

    //     var user = req.body;

    //     userService.createNewUser(user)
    //     .then(
    //         function(user){
    //             res.status(200).json(apiUtil.generateResponse(200, "User created successfully", user));
    //         },
    //         function(error){
    //             res.status(500).json(apiUtil.generateResponse(error.code, error.message, null));
    //         }
    //     )

    //     //res.json(apiUtil.generateResponse(200, "New user created successfully", result));
    // },

    // getUserByExternalId: function(req, res){
    //     userService.getUserByExternalId(req.params.extId, req.query)
    //     .then(
    //         function(user){
    //             res.status(200).json(apiUtil.generateResponse(200, "User retrieved successfully", user));
    //         },
    //         function(error){
    //             //// user couldn't be found 404
    //             // console.log(error);
    //             res.status(500).json(apiUtil.generateResponse(500, "User couldn't be located with suplied external id", null));
    //         }
    //     );
    // },//// fun. getUserByExternalId

    // saveUser: function(req, res){

    //     userService.saveUser(req.params.id, req.body)
    //     .then(
    //         function(user){
    //             res.status(200).json(apiUtil.generateResponse(200, "User updated successfully", user));
    //         },
    //         function(error){
    //             //// user couldn't be saved 404
    //             res.status(500).json(apiUtil.generateResponse(404, error, null));
    //         }
    //     );
    // }, //// fun. saveUser


}/// users object

module.exports = applicationRoutes;