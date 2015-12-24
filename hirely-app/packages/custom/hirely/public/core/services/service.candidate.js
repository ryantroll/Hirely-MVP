/**
 * Created by labrina.loving on 9/4/2015.
 */

(function () {
    'use strict';

    angular.module('mean.hirely.core')
        .service('CandidateService', ['$q','$http','FIREBASE_URL', '$firebaseObject', 'fbutil', '$firebaseArray', CandidateService]);

    function CandidateService($q, $http, FIREBASE_URL, $firebaseObject, fbutil, $firebaseArray, CandidateService) {
        var self = this;
        var profile = '';
        var candidateExperience = [];
        var candidateEducation = [];

        function candidateModel(){
            this.authorizedInUS = '';
            this.status = '';
            this.experience ={};
            this.education = {};
            this.personality = {};
            this.availability = {};
        }


        this.getProfile = function getProfile(userId){
            var ref = new Firebase(FIREBASE_URL);
            var deferred = $q.defer();
            var profile = new Firebase.util.NormalizedCollection(
                ref.child('users'),
                ref.child('candidates'),
                ref.child('candidate-availability'),
                ref.child('candidate-personality')

            );

            // specify the fields for each path
            profile = profile.select({key: 'candidates.$value', alias: 'candidate'},
                {key: 'candidate-availability.$value', alias: 'availability'},
                {key: 'candidate-personality.$value', alias: 'personality'}),

            // apply a client-side filter to the data (only return users where key === 'user1'
            profile = profile.filter(
                function(data, key, priority) { return key === userId; }
            );

            var profileRef = profile.ref().child(userId);
            // run it and see what we get
            profileRef.once('value', function(snap) {
                    var profile = snap.val();
                    var ref = fbutil.ref('candidate-experience', userId);
                    profile.experience =  $firebaseArray(ref);
                    deferred.resolve(profile);

                }, function (err) {
                    deferred.reject(snap);
                }
            );

            return deferred.promise;

        }

        this.saveCandidate = function saveCandidate(candidate, key) {
            var ref = fbutil.ref('candidates', key);
            ref.set(candidate);
        };

        this.saveAvailability = function saveAvailability(availability, key) {
            var ref = fbutil.ref('candidate-availability', key);
            ref.set(availability);
        };

        this.savePersonality = function savePersonality(personality, key){
            var ref = fbutil.ref('candidate-personality', key);
            ref.set(personality);
        }

        this.createTraitifyAssessment = function createTraitifyAssessment(){
            var deferred = $q.defer();

            $http.get('/api/assessment')
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;

        }

        this.getAssessmentResults = function getAssessmentResults(assessmentId){
            var deferred = $q.defer();

            $http.get('/api/assessmentResults'+ assessmentId)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;

        }

        this.getAssessmentSlides = function getAssessmentSlides(assessmentId){
            var deferred = $q.defer();

            $http.get('/api/assessmentSlides'+ assessmentId)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;

        }

        this.getAssessmentCareerMatches = function getAssessmentCareerMatches(assessmentId){
            var deferred = $q.defer();

            $http.get('/api/assessmentCareerMatches'+ assessmentId)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;

        }

        this.getAssessment = function getAssessment(assessmentId){
            var deferred = $q.defer();

            $http.get('/api/assessmentData'+ assessmentId)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;

        }

        this.getExperience = function getExperience(userId){
            var ref = fbutil.ref('candidate-experience', userId);
            return $firebaseArray(ref);
        }

        this.savePositiontoFavorites = function savePositiontoFavorites(userId, positionId){
            var ref = fbutil.ref('candidate-favorites', userId);
            ref.child(positionId).set(true);

        }




    }
})();

