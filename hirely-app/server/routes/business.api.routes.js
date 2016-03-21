var businessService = require('../services/business.service');
var apiUtil = require('../utils/api-response');

var businessRoutes = {

    getAll : function(req, res){
        /**
         * Get all businesss
         */
        businessService.getAll(req.query)
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

    getBySlug: function(req, res){
        /**
         * Send public info if all is not requested
         */
        businessService.getBySlug(req.params.slug, req.query)
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
        businessService.getByPositionId(req.params.pid, req.query)
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

    isUserFilteredForPosition: function(req, res){
        businessService.isUserIdFilteredForPositionId(req.params.uid, req.params.pid, req.query)
            .then(
                function(bool){
                    res.status(200).json(apiUtil.generateResponse(200, bool));
                },
                function(error){
                    //// business couldn't be found 404
                    res.status(404).json(apiUtil.generateResponse(404, "Position or user not found or error. "+error, null));
                }
            );
    },

    createNewBusiness : function(req, res){

        var business = {
            name: 'Compass Coffee',
            description: 'cool coffee shop',
            email: 'c@compass.com',
            website: 'compass.com',
            agreedToTerms: true
        };

        businessService.createNewBusiness(business)
        .then(
            function(business){
                console.log(business);
                res.status(200).json(apiUtil.generateResponse(200, "Business created successfully", business));
            },
            function(error){
                console.log(error);
                res.status(500).json(apiUtil.generateResponse(error.code, error.message, null));
            }
        )

    },

    getPositionDisplayData : function(req, res){

        businessService.getPositionDisplayData(req.query.occId)
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