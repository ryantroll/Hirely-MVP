/**
 * Created by labrina.loving on 9/10/2015.
 */


(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('PositionService', ['$q','FBURL', '$firebaseObject', 'fbutil', PositionService]);

    function PositionService($q, FBURL, $firebaseObject, fbutil) {
        var self = this;
        var profile;
        function businessSiteModel(){
            this.siteId = '';
            this.companyName = '';
            this.siteName = '';
            this.address = '';
            this.photos = [];
            this.positions = [];
        }
        function positionModel(){
            this.companyName = '';
            this.title = '';
            this.compensation  ={};
            this.benefits = {};
            this.availability = {};
            this.employmentTypes = {};
            this.workHours = {};
            this.photo = '';
            this.positionId = '';
            this.status = '';
            this.siteId = '';
            this.occupationId = '';
            this.postDate = '';
            this.site = new businessSiteModel();
        };


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
                        site.photos = siteObj.photos;

                        if(siteObj.position) {
                            angular.forEach(siteObj.position, function (positionObj, positionKey) {
                                //check if position meets criteria
                                var meetsOcc = ((!occupationId) || occupationId == positionObj.occupation);
                                var meetsWage = ((!minWage) || positionObj.compensation.wage.minAmount >= minWage);
                                var meetsActive = positionObj.status == 'Active'
                                if(meetsOcc & meetsWage & meetsActive)
                                {
                                    var position = new positionModel();
                                    position.positionId = positionKey;
                                    position.companyName = siteObj.name;
                                    position.occupationId = positionObj.occupation;
                                    position.postDate = positionObj.postDate;
                                    position.title = positionObj.title;
                                    position.compensation = positionObj.compensation;
                                    position.employmentTypes = positionObj.employmentTypes;
                                    position.workHours = positionObj.workHours;
                                    position.status = positionObj.status;
                                    position.benefits = positionObj.benefits;
                                    position.availability = positionObj.availability;
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

        this.getPositionbyId = function(siteId, positionId){
            var fb = new Firebase(FBURL);
            var businessSite ='';
            var business = '';
            var hiringMgr = '';
            var position = '';
            var deferred = $q.defer();


            fb.child('position/' + siteId+ '/' + positionId).once('value', function(positionSnap) {
                position = positionSnap.val();
                fb.child('businessSite/' + siteId).once('value', function(businessSiteSnap) {
                    businessSite = businessSiteSnap.val();
                    position = positionSnap.val();
                    fb.child('business/' + businessSite.parentBusiness).once('value', function(businessSnap) {
                        business = businessSnap.val();
                        fb.child('users/' + position.mainHiringMgr).once('value', function(usersSnap) {
                          hiringMgr = usersSnap.val();
                            position.business = business;
                            position.businessSite = businessSite;
                            position.hiringMgr = hiringMgr;
                            deferred.resolve(position);
                        });

                    });

                });
            });
            return deferred.promise;

        }
    };
})();


