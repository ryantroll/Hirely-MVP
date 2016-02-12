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
                //// application couldn't be found 404
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

    getByPositionId: function(req, res){
        applicationService.getByPositionId(req.params.positionId, req.query)
            .then(
                function(app){
                    res.status(200).json(apiUtil.generateResponse(200, "Application retrieved successfully", app));
                },
                function(error){
                    //// application couldn't be found 404
                    res.status(500).json(apiUtil.generateResponse(404, "No application found for this position", null));
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
                    res.status(500).json(apiUtil.generateResponse(500, error, null));
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
                res.status(500).json(apiUtil.generateResponse(500, error, null));
            }
        )/// .then
    }


}/// users object

module.exports = applicationRoutes;