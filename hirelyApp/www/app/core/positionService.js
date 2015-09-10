/**
 * Created by labrina.loving on 9/10/2015.
 */


(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('PositionService', ['$q','FBURL', '$firebaseObject', 'fbutil', PositionService]);

    function PositionService($q, FBURL, $firebaseObject, fbutil, CandidateService) {
        var self = this;
        var profile;
        function positionModel(){
            this.companyName = '';
            this.title = '';
            this.wage  ={};
            this.employmentTypes = {};
            this.photo = '';
            this.positionId = '';
        }

        this.getOpenPositions = function getOpenPositions(){
            var ref = new Firebase(FBURL);
            var deferred = $q.defer();
            var positions = new Firebase.util.NormalizedCollection(
                ref.child('businessSite'),
                ref.child('position'),
                [ref.child('business'), 'business', 'businessSite.parentBusiness']


            );

            // specify the fields for each path
            positions = positions.select({key: 'position.$value', alias: 'position'}, 'businessSite.parentBusiness', 'business.name', 'business.photos');





            var positionsRef = positions.ref();
            // run it and see what we get
            positionsRef.once('value', function(snap) {
                    var positions = snap.val();
                    var availPositions = [];
                    angular.forEach(positions, function(site) {
                        if(site.position) {
                            angular.forEach(site.position, function (positionObj) {
                                var position = new positionModel();

                                position.companyName = site.name;
                                position.title = positionObj.title;
                                position.wage = positionObj.wage;
                                position.employmentTypes = positionObj.employmentTypes;
                                var defaultPhoto = _.matcher({main: "true"});
                                var photo =  _.filter(site.photos, defaultPhoto);
                                if(photo){
                                    position.photo = photo[0].source;
                                }


                                availPositions.push(position);
                            });
                        }

                    });
                    deferred.resolve(availPositions);

                }, function (err) {
                    deferred.reject(snap);
                }
            );

            return deferred.promise;

        }
    }
})();


