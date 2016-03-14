var traitifyService = require('../services/traitify.service');
var apiUtil = require('../utils/api-response');
var testResponse = require('./test.traitify.response');

var traitifyRoutes = {

    getAssessmentId: function (req, res){
        traitifyService.getAssessmentId(function (err, results) {
            if(err){
                res.json(apiUtil.generateResponse(500, err, null));
            } else{
                res.json(apiUtil.generateResponse(200, "Assesment Id retrieved", results));
            }
        });
    },//// fun. getAssmentId

    getAll: function(req, res){
        traitifyService.getAll(req.query)
        .then(
            function(assessment){
                res.status(200).json(apiUtil.generateResponse(200, "Assesment Id retrieved", assessment));
            },
            function(err){
                res.status(500).json(apiUtil.generateResponse(500, err, null));
            }
        );///. getAll().then()
    },//// fun. getAll

    createNewAssessment: function(req, res){
        traitifyService.createNewAssessment(req.query.userId, req.query.assessmentId, req.body)
    },//// fun. createNewAssessment

    getTest: function(req, res){
        res.status(200).json(apiUtil.generateResponse(200, "Assesment Id retrieved", testResponse));
    },

    getAssessmentCareerMatchScoresById: function (req, res){
        traitifyService.getAssessmentCareerMatchScoresById(req.params.id, req.query)
            .then(
                function(matches){
                    res.status(200).json(apiUtil.generateResponse(200, "Matches retrieved successfully", matches));
                },
                function(error){
                    //// user couldn't be found 404
                    res.status(500).json(apiUtil.generateResponse(404, "Matches couldn't be located", null));
                }
            );
    },

    // This function for testing
    updateAssessmentCareerMatchScoresByUserId: function (req, res){
        traitifyService.updateAssessmentCareerMatchScoresByUserId(req.params.id, req.query)
            .then(
                function(matches){
                    res.status(200).json(apiUtil.generateResponse(200, "Matches retrieved successfully", matches));
                },
                function(error){
                    //// user couldn't be found 404
                    res.status(500).json(apiUtil.generateResponse(500, "Matches couldn't be located: "+error, null));
                }
            );
    }

}/// users object

module.exports = traitifyRoutes;