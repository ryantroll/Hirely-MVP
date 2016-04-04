/**
 * Created by labrina.loving on 9/18/2015.
 */
module.exports = function(app) {
    var cacheManager = require('cache-manager');
    var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 0/*seconds*/});

    var places = require('./services/places');
    var geocoder = require('./services/geocoder');
    var apiUtil = require('./utils/api-response');
    var config = require('./config');
    var onetTitlesService = require('./services/onet-titles');
    // var traitify = require('./services/traitify');

    /**
     * API for local users in mongoDB
     */
    var userApiRoutes = require('./routes/user.api.routes');
    var businessApiRoutes = require('./routes/business.api.routes');
    var applicationApiRoutes = require('./routes/application.api.routes');
    var traitifyApiRoutes = require('./routes/traitify.api.routes');
    var favoriteApiRoutes = require('./routes/favorite.api.routes');
    var onetWebApiRoutes = require('./routes/onetWeb.api.routes');

    // Make sure get requests to db are never cached in IE
    app.get('/*',function(req,res,next){
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires",0);
        next(); // http://expressjs.com/guide.html#passing-route control
    });


    app.get('/api/googleplace:placeId', getGooglePlacebyId);
    app.get('/api/search/cities/:addressQuery', getAddressFomQuery);
    app.get('/api/search/locations/:locationQuery', getLocationFomQuery);
    app.get('/api/geocode/:address', fullAddressAutocomplete);
    app.get('/api/placeSearch/:query', placeAutocomplete);
    app.get('/api/places/:placeId', getPlaceDetailsByPlaceId);
    app.get('/api/onet/titles/search/:titleName', searchOnetTitles);
    app.get('/api/v1/occupations/searchByKeyword/:keywords', onetWebApiRoutes.keywordSearch);

    // app.get('/api/onet/titles/search/:titleName', searchOnetTitles);

    /**
     * Traitify routs
     */
    app.get('/api/v1/traitify/', traitifyApiRoutes.getAll);
    app.get('/api/v1/traitify/assessment-id', traitifyApiRoutes.getAssessmentId);
    app.post('/api/v1/traitify/', traitifyApiRoutes.createNewAssessment);
    app.get('/api/v1/traitify/test', traitifyApiRoutes.getTest);
    app.get('/api/v1/traitify/getAssessmentCareerMatchScoresById/:id', traitifyApiRoutes.getAssessmentCareerMatchScoresById);
    app.post('/api/v1/traitify/updateAssessmentCareerMatchScoresByUserId/:id', traitifyApiRoutes.updateAssessmentCareerMatchScoresByUserId);

    /**
     * Adding routes for local mongoDB users
     */
    app.get('/api/v1/users', userApiRoutes.getAll);
    app.get('/api/v1/users/:id', userApiRoutes.getById);
    app.post('/api/v1/users/', userApiRoutes.createNewUser);
    app.patch('/api/v1/users/:id', userApiRoutes.saveUser);
    app.get('/api/v1/users/:extId/external', userApiRoutes.getUserByExternalId);
    app.post('/api/v1/users/:id/updateUserMetricsById', userApiRoutes.updateUserMetricsById);
    app.post('/api/v1/users/passwordLogin', userApiRoutes.passwordLogin);

    /**
     * Adding routes for local mongoDB businesses
     */
    app.get('/api/v1/businesses', businessApiRoutes.getAll);
    app.get('/api/v1/businesses/positionIcon', businessApiRoutes.getPositionDisplayData);
    app.get('/api/v1/businesses/:slug', businessApiRoutes.getBySlug);
    app.get('/api/v1/businesses/getPositionById/:pid', businessApiRoutes.getPositionById);
    app.get('/api/v1/businesses/getPositionsByManagerId/:managerId', businessApiRoutes.getPositionsByManagerId);
    app.get('/api/v1/businessByPositionId/:pid', businessApiRoutes.getByPositionId);
    app.post('/api/v1/businesses/', businessApiRoutes.createNewBusiness);
    app.get('/api/v1/positions/:pid/isUserFiltered/:uid', businessApiRoutes.isUserFilteredForPosition);

    /**
     * Adding routs for local monogoDB applicaion
     */
    app.get('/api/v1/applications', applicationApiRoutes.getAll);
    app.get('/api/v1/applications/:id', applicationApiRoutes.getById);
    app.get('/api/v1/applications/byPositionId/:id', applicationApiRoutes.getByPositionId);
    app.get('/api/v1/applications/byUserId/:userId', applicationApiRoutes.getByUserId);
    app.post('/api/v1/applications/', applicationApiRoutes.createNewApplication);
    app.patch('/api/v1/applications/:appId', applicationApiRoutes.saveApplication);

    /**
     * Adding routs for favorite
     */
    app.get('/api/v1/favorites', favoriteApiRoutes.getFavorites);
    app.post('/api/v1/favorites', favoriteApiRoutes.updateFavorite);

    function getGooglePlacebyId(req, res) {
        var placeId = req.params.placeId;
        memoryCache.wrap(placeId, function(cacheCallback) {
            getPlace(placeId, cacheCallback)
        }, {ttl: 0}, function(err, result) {

            res.send(result);

        });
    }

    function getAddressFomQuery(req, res){
        var searchQuery = req.params.addressQuery;
        places.citiesAutoComplete(searchQuery, function(err, result){
            if(err){
                res.json(apiUtil.generateResponse(500, err, null));
            } else {
                res.json(apiUtil.generateResponse(200, "cities retrieved", result));
            }
        });
    }


    function getLocationFomQuery(req, res){
        var searchQuery = req.params.locationQuery;
        places.locationAutoComplete(searchQuery, function(err, result){
            if(err){
                res.json(apiUtil.generateResponse(500, err, null));
            } else {
                res.json(apiUtil.generateResponse(200, "locations retrieved", result));
            }
        });
    }

    function fullAddressAutocomplete(req, res){
        var placeRef = req.params.address;
        places.fullAddressAutocomplete(placeRef, function(err, result){
            if(err){
                res.json(apiUtil.generateResponse(500, err, null));
            } else {
                res.json(apiUtil.generateResponse(200, "location geocoded", result));
            }
        });
    }

    function placeAutocomplete(req, res){
        var placeRef = req.params.query;
        places.placeAutocomplete(placeRef, function(err, result){
            if(err){
                res.json(apiUtil.generateResponse(500, err, null));
            } else {
                res.json(apiUtil.generateResponse(200, "location geocoded", result));
            }
        });
    }

    function getPlaceDetailsByPlaceId(req, res){
        var placeRef = req.params.placeId;
        places.getPlaceDetailsByPlaceId(placeRef, function(err, result){
            if(err){
                res.json(apiUtil.generateResponse(500, err, null));
            } else {
                res.json(apiUtil.generateResponse(200, "place details loaded", result));
            }
        });
    }

    function getPlace(placeId, cb){

        var publicConfig = {
            key: config.googleMapsAPIKey,
            stagger_time:       1000, // for elevationPath
            encode_polylines:   false,
            secure:             true, // use https

        };

        var GoogleMapsAPI = require('googlemaps')
        var gmAPI = new GoogleMapsAPI(publicConfig);

        var placeParams = {"placeid": placeId};

        gmAPI.placeDetails(placeParams, function(err, result){
           cb(err, result.result);

        });
    }


    function searchOnetTitles(req, res){
        var titleName = req.params.titleName;
        onetTitlesService.searchTitles(titleName, function (err, results) {
            if(err){
                res.json(apiUtil.generateResponse(500, err, null));
            } else {
                res.json(apiUtil.generateResponse(200, "Title Names Retrieved", results));
            }
        });
    };



};
