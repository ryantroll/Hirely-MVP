/**
 * Created by labrina.loving on 9/18/2015.
 */
module.exports = function(app) {
    var cacheManager = require('cache-manager');
    var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 0/*seconds*/});
    var traitify = require('traitify');
    config = require('./config')();
    traitify.setHost(config.traitify.host);
    traitify.setVersion(config.traitify.version);
    traitify.setSecretKey(config.traitify.secretKey);

    app.get('/api/googleplace:placeId', getGooglePlacebyId);
    app.get('/api/assessment', createTraitifyAssessmentId);
    app.get('/api/assessmentData:assessmentId', getAssessment);
    app.get('/api/assessmentResults:assessmentId', getAssessmentResults);
    app.get('/api/assessmentSlides:assessmentId', getAssessmentSlides);
    app.get('/api/assessmentCareerMatches:assessmentId', getCareerMatches);

    function getGooglePlacebyId(req, res) {
        var placeId = req.params.placeId;
        memoryCache.wrap(placeId, function(cacheCallback) {
            getPlace(placeId, cacheCallback)
        }, {ttl: 0}, function(err, result) {

            res.send(result);

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
