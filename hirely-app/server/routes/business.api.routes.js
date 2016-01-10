var businessService = require('../services/business.service');
var apiUtil = require('../utils/api-response');

var businessRoutes = {

    getAll : function(req, res){
        /**
         * Get all businesss
         */
        businessService.getAll()
        .then(
            function(businesss){
                res.status(200).json(apiUtil.generateResponse(200, "Businesss retrieved successfully", businesss));
            },
            function(error){
                //// business couldn't be found 404
                res.status(500).json(apiUtil.generateResponse(404, "Businesss couldn't be located", null));
            }
        );
    },

    getByIdOrSlug: function(req, res){
        /**
         * Send public info if all is not requested
         */
        businessService.getByIdOrSlug(req.params.idOrSlug, req.query)
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


}/// businesss object

module.exports = businessRoutes;