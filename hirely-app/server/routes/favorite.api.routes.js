var favoritesServices = require('../services/favorites.service');
var apiUtil = require('../utils/api-response');

var favoriteRoutes = {

    updateFavorite: function (req, res){
        favoritesServices.updateFavorite(req.body)
        .then(
            function(saved){
                res.json(apiUtil.generateResponse(200, "Favorite retrieved", saved));
            },
            function(err){
                res.json(apiUtil.generateResponse(500, err, null));
            }
        );
    },//// fun. getAssmentId

    getFavorites: function(req, res){
        favoritesServices.getFavorites(req.query)
        .then(
            function(favs){
                res.status(200).json(apiUtil.generateResponse(200, "Favorite retrieved", favs));
            },
            function(err){
                res.status(500).json(apiUtil.generateResponse(500, err, null));
            }
        );///. getAll().then()
    },

    // getAll: function(req, res){
    //     traitifyService.getAll(req.query)
    //     .then(
    //         function(assessment){
    //             res.status(200).json(apiUtil.generateResponse(200, "Assesment Id retrieved", assessment));
    //         },
    //         function(err){
    //             res.status(500).json(apiUtil.generateResponse(500, err, null));
    //         }
    //     );///. getAll().then()
    // },//// fun. getAll


}/// users object

module.exports = favoriteRoutes;