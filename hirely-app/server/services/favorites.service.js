var favoritesModel = require('../models/favorites.model');
var BusinessModels = require('../models/business.model.js'),
    PositionModel = BusinessModels.PositionModel,
    LocationModel = BusinessModels.LocationModel,
    BusinessModel = BusinessModels.BusinessModel;
var q = require('q');

var favoritesService = {
    /**
     * [getAll function will get all businesss.  Not to be used in production]
     * @return {[type]}        [promise]
     */
    getAll : function(reqQuery){

        return BusinessModel.find({}, returnFields).exec();
    },



    /**
     * [createNewBusiness will create new business object in database]
     * @param  {[type]} businessObj [JS object with required field in business Model]
     * @return {[type]}         [promise with business basic info]
     */
    updateFavorite : function(favObj){
        var deferred = q.defer();
        delete favObj._id;
        var isDelete = false;

        favoritesModel.findOne(favObj).exec()
        .then(
            function(found){
                if(null === found){
                    var newFav = new favoritesModel(favObj);
                    return newFav.save();
                }
                else{
                    isDelete = true;
                    return found.remove();
                }
            },
            function(err){
                deferred.reject(err);
            }
        )
        .then(
            function(saved){
                if(false === isDelete){
                    deferred.resolve(saved);
                }
                else{
                    deferred.resolve({deleted:true});
                }
            },
            function(err){
                console.log(err)
                deferred.reject(err);
            }
        )
        return deferred.promise;
    },

    getFavorites: function(query){
        var deferred = q.defer();

        var where = {};
        where.type = query.type ? query.type : 'position';

        if(query.userId){
            where.userId = query.userId;
        }
        if(query.positionId){
            where.positionId = query.positionId;
        }
        if(query.businessId){
            where.businessId = query.businessId;
        }
        if(query.locationId){
            where.locationId = query.locationId;
        }

        favoritesModel.find(where)
        .then(
            function(found){
                deferred.resolve(found);
            },
            function(err){
                deferred.reject(err);
            }
        )

        return deferred.promise;
    }




}/// businesss object


module.exports = favoritesService;