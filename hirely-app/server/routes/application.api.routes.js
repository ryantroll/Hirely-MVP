var applicationService = require('../services/application.service');
var apiUtil = require('../utils/api-response');
var permissionService = require('../services/permissions.service');
var applicationModel = require('../models/application.model');

var applicationRoutes = {
    getById: function(req, res){
        applicationService.getById(req.params.id, req.query)
            .then(
                function(app){
                    // Only allow if user owns the application
                    if (req.isSuperUser || req.userId == app.userId) {
                        res.status(200).json(apiUtil.generateResponse(200, "Application retrieved successfully", app));
                    } else {
                        res.status(403).json(apiUtil.generateResponse(403, "Forbidden", null));
                    }
                },
                function(error){
                    //// application couldn't be found 404
                    res.status(404).json(apiUtil.generateResponse(404, "Application couldn't be located", null));
                }
            );
    },

    getByUserId: function(req, res){
        // only allow if user is requesting his own applications
        if (!(req.isSuperUser || req.userId == req.params.userId)) {
            res.status(403).json(apiUtil.generateResponse(403, "Forbidden", null));
            return;
        }
        applicationService.getByUserId(req.params.userId, req.query)
            .then(
                function(app){
                    res.status(200).json(apiUtil.generateResponse(200, "Application retrieved successfully", app));
                },
                function(error){
                    //// application couldn't be found 404
                    res.status(404).json(apiUtil.generateResponse(404, "No application found for this user", null));
                }
            );
    },

    getByPositionId: function(req, res){
        permissionService.checkPermission(req.permissions, {destType:"positions", destId:req.params.id}).then(function(grant) {
            // only allow if user has read permission on business
            if (!grant) {
                res.status(403).json(apiUtil.generateResponse(403, "Forbidden", null));
                return;
            }

            applicationService.getByPositionId(req.params.id, req.query)
                .then(
                    function (app) {
                        res.status(200).json(apiUtil.generateResponse(200, "Application retrieved successfully", app));
                    },
                    function (error) {
                        //// application couldn't be found 404
                        res.status(404).json(apiUtil.generateResponse(404, "No application found for this position or error. " + error, null));
                    }
                );
        });
    },

    createNewApplication: function(req, res){
        if (!req.userId) {
            res.status(403).json(apiUtil.generateResponse(403, "Forbidden", null));
        }
        var application = req.body;

        applicationService.createNewApplication(application)
            .then(
                function(app){
                    res.status(200).json(apiUtil.generateResponse(200, "Application created successfully", app));
                },
                function(error){
                    res.status(404).json(apiUtil.generateResponse(404, error, null));
                }
            )/// .then
    },

    saveApplication: function(req, res){
        if (req.user.sandboxMode) {
            res.status(200).json(apiUtil.generateResponse(200, "Skipping because sandbox mode", null));
            return;
        }

        applicationModel.findById(req.params.appId).then(function(app) {

            // console.log("AR:info:1");
            permissionService.checkPermission(req.permissions, {destType:"positions", destId:app.positionId}).then(function(grant) {
                // console.log("AR:info:1.1");
                if (!(req.userId==app.userId || grant)) {
                    // console.log("AR:info:2");
                    res.status(403).json(apiUtil.generateResponse(403, "Forbidden", null));
                    return;
                }
                // console.log("AR:info:3");

                applicationService.saveApplication(req.params.appId, req.body)
                    .then(
                        function (app) {
                            res.status(200).json(apiUtil.generateResponse(200, "Application created successfully", app));
                        },
                        function (error) {
                            res.status(404).json(apiUtil.generateResponse(404, error, null));
                        }
                    ); /// .then
            })
        });

    }


}/// users object

module.exports = applicationRoutes;