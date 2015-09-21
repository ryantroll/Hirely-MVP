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
            this.status = '';
            this.siteId = '';
            this.occupationId = '';
            this.postDate = '';
        };
        function businessSiteModel(){
            this.siteId = '';
            this.companyName = '';
            this.siteName = '';
            this.address = '';
            this.photoUrl = '';
            this.positions = [];
        }

        this.getOpenPositionsForLocation = function getOpenPositionsForLocation(locationId, minWage, occupationId){
            var ref = new Firebase(FBURL);
            var deferred = $q.defer();
            var positions = new Firebase.util.NormalizedCollection(
                ref.child('businessSite'),
                ref.child('position'),
                [ref.child('business'), 'business', 'businessSite.parentBusiness']


            );

            // specify the fields for each path
            positions = positions.select({key: 'position.$value', alias: 'position'}, {key: 'businessSite.$value', alias: 'businessSite'}, 'businessSite.parentBusiness', 'business.name', 'business.photos');

            positions =  positions.filter(
                function(data, key, priority)
                {
                    var isActive  =  key == locationId && data.businessSite.currentlyHiring == true;
                    return isActive;

                }
            );



            var positionsRef = positions.ref();
            // run it and see what we get
            positionsRef.once('value', function(snap) {
                    var sites = snap.val();
                    var site = new businessSiteModel();
                    angular.forEach(sites, function(siteObj, siteKey) {

                        site.siteId = siteKey;
                        site.companyName = siteObj.name;
                        site.siteName = siteObj.businessSite.name;
                        site.address = siteObj.businessSite.address;
                        var defaultPhoto = _.matcher({main: "true"});
                        var photo =  _.filter(siteObj.photos, defaultPhoto);
                        if(photo){
                            site.photoUrl = photo[0].source;
                        }
                        if(siteObj.position) {
                            angular.forEach(siteObj.position, function (positionObj, positionKey) {
                                //check if position meets criteria
                                var meetsOcc = ((!occupationId) || occupationId == positionObj.occupation);
                                var meetsWage = ((!minWage) || positionObj.wage.amount >= minWage);
                                var meetsActive = positionObj.status == 'Active'
                                if(meetsOcc & meetsWage & meetsActive)
                                {
                                    var position = new positionModel();
                                    position.positionId = positionKey;

                                    position.occupationId = positionObj.occupation;
                                    position.postDate = positionObj.postDate;
                                    position.title = positionObj.title;
                                    position.wage = positionObj.wage;
                                    position.employmentTypes = positionObj.employmentTypes;
                                    position.status = positionObj.status;
                                    site.positions.push(position);
                                }

                            });
                        }

                    });
                    deferred.resolve(site);

                }, function (err) {
                    deferred.reject(snap);
                }
            );

            return deferred.promise;

        };
    };
})();


