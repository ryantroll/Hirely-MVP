var BusinessService = require('../services/business.service');
var apiUtil = require('../utils/api-response');
var permissionService = require('../services/permissions.service');

var businessRoutes = {

    getBySlug: function(req, res){
        /**
         * Send public info if all is not requested
         */
        BusinessService.getBySlug(req.params.slug, req.query)
        .then(
            function(business){
                res.status(200).json(apiUtil.generateResponse(200, "Business retrieved successfully", business));
            },
            function(error){
                //// business couldn't be found 404
                res.status(500).json(apiUtil.generateResponse(404, "Business couldn't be located", null));
            }
        );
    },

    getByPositionId: function(req, res){
        /**
         * Send public info if all is not requested
         */
        BusinessService.getByPositionId(req.params.pid, req.query)
            .then(
                function(business){
                    res.status(200).json(apiUtil.generateResponse(200, "Business retrieved successfully", business));
                },
                function(error){
                    //// business couldn't be found 404
                    res.status(404).json(apiUtil.generateResponse(404, "Business couldn't be located", null));
                }
            );
    },

    getPositionsByIds: function(req, res){
        /**
         * Send public info if all is not requested
         */
        BusinessService.getPositionsByIds(req.params.pid.split('|'), req.query)
            .then(
                function(position){
                    res.status(200).json(apiUtil.generateResponse(200, "Position retrieved successfully", position));
                },
                function(error){
                    //// business couldn't be found 404
                    res.status(404).json(apiUtil.generateResponse(404, "Position couldn't be located", null));
                }
            );
    },

    getPositionsByManagerId: function(req, res){
        BusinessService.getPositionsByManagerId(req.params.managerId, req.query, req.isSuperUser)
            .then(
                function(position){
                    res.status(200).json(apiUtil.generateResponse(200, "Position retrieved successfully", position));
                },
                function(error){
                    //// business couldn't be found 404
                    res.status(404).json(apiUtil.generateResponse(404, "Position couldn't be located", null));
                }
            );
    },

    isUserFilteredForPosition: function(req, res){
        permissionService.checkPermission(req.permissions, "positions", req.params.pid).then(function(grant) {
            if (!grant) {
                res.status(403).json(apiUtil.generateResponse(403, "Forbidden", null));
                return;
            }

            BusinessService.isUserIdFilteredForPositionId(req.params.uid, req.params.pid, req.query)
                .then(
                    function (bool) {
                        res.status(200).json(apiUtil.generateResponse(200, bool));
                    },
                    function (error) {
                        //// business couldn't be found 404
                        res.status(404).json(apiUtil.generateResponse(404, "Position or user not found or error. " + error, null));
                    }
                );
        });
    },


    getPositionDisplayData : function(req, res){

        BusinessService.getPositionDisplayData(req.query.occId)
        .then(
            function(data){
                res.status(200).json(apiUtil.generateResponse(200, "Icon found", data));
            },
            function(error){
                res.status(500).json(apiUtil.generateResponse(error.code, error.message, null));
            }
        )
    }


}/// businesss object

module.exports = businessRoutes;