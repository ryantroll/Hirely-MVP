/**
 * Created by labrina.loving on 9/18/2015.
 */
module.exports = function(app) {
    var cacheManager = require('cache-manager');
    var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 0/*seconds*/});
    var traitify = require('traitify');
    var places = require('./services/places');
    var geocoder = require('./services/geocoder');
    var apiUtil = require('./utils/api-response');

    var config = require('./config');

    var onetTitlesService = require('./services/onet-titles');

    traitify.setHost(config.traitify.host);
    traitify.setVersion(config.traitify.version);
    traitify.setSecretKey(config.traitify.secretKey);

    app.get('/api/googleplace:placeId', getGooglePlacebyId);
    app.get('/api/search/cities/:addressQuery', getAddressFomQuery);
    app.get('/api/search/locations/:locationQuery', getLocationFomQuery);
    app.get('/api/geocode/:address', fullAddressAutocomplete);
    app.get('/api/places/:placeId', getPlaceDetailsByPlaceId);
    app.get('/api/assessment', createTraitifyAssessmentId);
    app.get('/api/assessmentData:assessmentId', getAssessment);
    app.get('/api/assessmentResults:assessmentId', getAssessmentResults);
    app.get('/api/assessmentSlides:assessmentId', getAssessmentSlides);
    app.get('/api/assessmentCareerMatches:assessmentId', getCareerMatches);

    app.get('/api/onet/titles/search/:titleName', searchOnetTitles);

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
    }



    function createTraitifyAssessmentId(req, res){

        traitify.createAssessment("career-deck", function(assessment){
            // Use assessment here.

           res.send(assessment);
        });
    }

    function getAssessment(req, res){
        var assessmentId = req.params.assessmentId;
        traitify.getAssessment(assessmentId, function(data){
            res.send(data);

        });

    }

    function getAssessmentResults(req, res){
        var assessmentId = req.params.assessmentId;
        traitify.getResults(assessmentId, ["traits","types"], {}, function(data){
            res.send(data);
        });

    }

    function getPersonalityTypes(req, res){
        var assessmentId = req.params.assessmentId;
        traitify.getPersonalityTypes(assessmentId, function(data){
            res.send(data);
        });

    }

    function getPersonalityTraits(req, res){
        var assessmentId = req.params.assessmentId;
        traitify.getPersonalityTraits(assessmentId, function(data){
            res.send(data);
        });

    }

    function getAssessmentSlides(req, res){
        var assessmentId = req.params.assessmentId;
        traitify.getSlides(assessmentId, function(data){
            res.send(data);
        });

    }

    function getCareerMatches(req, res){
        var assessmentId = req.params.assessmentId;
        traitify.getCareerMatches(assessmentId, {}, function(data){
            res.send(data);
        });

    }
};
