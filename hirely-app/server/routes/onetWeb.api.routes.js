var onetWebService = require('../services/onetWeb.service');
var apiUtil = require('../utils/api-response');

var onetWebRoutes = {
    keywordSearch: function(req, res){
        onetWebService.keywordSearch(req.query)
        .then(
            function(matches){
                res.status(200).json(apiUtil.generateResponse(200, "Matches retrieved", matches));
            },
            function(err){
                res.status(500).json(apiUtil.generateResponse(500, err, null));
            }
        );///. getAll().then()
    },

}/// onetWebRoutes

module.exports = onetWebRoutes;