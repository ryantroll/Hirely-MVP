/**
 * Created by labrina.loving on 9/4/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('CandidateService', ['$q','FBURL', '$firebaseObject', 'fbutil', CandidateService]);

    function CandidateService($q, FBURL, $firebaseObject, fbutil, CandidateService) {
        var self = this;
        var profile;


        function candidateModel(){
            this.authorizedInUS = '';
            this.status = '';
            this.experience ={};
            this.education = {};
            this.personality = {};
            this.availability = {};
        }


        this.getProfile = function getProfile(userId){
            var ref = new Firebase(FBURL);
            var deferred = $q.defer();
            var profile = new Firebase.util.NormalizedCollection(
                ref.child('users'),
                ref.child('candidates'),
                ref.child('candidate-experience'),
                ref.child('candidate-availability')
            );

            // specify the fields for each path
            profile = profile.select({key: 'candidates.$value', alias: 'candidate'},{key: 'candidate-availability.$value', alias: 'availability'} );


            // apply a client-side filter to the data (only return users where key === 'user1'
            profile = profile.filter(
                function(data, key, priority) { return key === userId; }
            );

            var profileRef = profile.ref().child(userId);
            // run it and see what we get
            profileRef.once('value', function(snap) {
                    var profile = snap.val();
                    deferred.resolve(profile);

                }, function (err) {
                    deferred.reject(snap);
                }
            );

            return deferred.promise;

        }

        this.saveCandidate = function saveCandidate(candidate, key) {
            var ref = fbutil.ref('candidates', key);
            ref.set(candidate)
        };

        this.saveAvailability = function saveAvailability(availability, key) {
            var ref = fbutil.ref('candidate-availability', key);
            ref.set(availability)
        };


    }
})();

