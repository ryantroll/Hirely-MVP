var onetWebService = require('../services/onetWeb.service');
var apiUtil = require('../utils/api-response');

var onetWebRoutes = {
    keywordSearch: function(req, res){
        onetWebService.keywordSearch(req.params.keywords)
        .then(
            function(matches){
                res.status(200).json(apiUtil.generateResponse(200, "Matches retrieved", matches));
            },
            function(err){
                res.status(404).json(apiUtil.generateResponse(404, err, null));
            }
        );///. getAll().then()
    },

}/// onetWebRoutes

module.exports = onetWebRoutes;