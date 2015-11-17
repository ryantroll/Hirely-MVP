/**
 * Created by labrina.loving on 9/10/2015.
 */


(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('PositionService', ['$q','FIREBASE_URL', '$firebaseObject', 'fbutil', PositionService]);

    function PositionService($q, FIREBASE_URL, $firebaseObject, fbutil) {
        var self = this;
        var profile;

        this.getOpenPositionsForLocation = function getOpenPositionsForLocation(locationId, minWage, occupationId){
            var ref = new Firebase(FIREBASE_URL);
            var deferred = $q.defer();
            var positions = new Firebase.util.NormalizedCollection(
                ref.child('position'),
                [ref.child('businessSite'), 'businessSite', 'position.siteId'],
                [ref.child('business'), 'business', 'position.businessId'],
                [ref.child('businessPhotos'), 'businessPhotos', 'position.businessId']
            );

            // specify the fields for each path
            positions = positions.select('position.siteId', 'position.businessId', {key: 'position.$value', alias: 'position'}, {key: 'businessSite.$value', alias: 'businessSite'},  {key: 'business.$value', alias: 'business'},  {key: 'businessPhotos.$value', alias: 'businessPhotos'});

            positions =  positions.filter(
                function(data, key, priority)
                {
                    var locationMatched = false;
                    var occupationMatched = false;
                    var wageMatched = false;
                    locationMatched = data.siteId == locationId;
                    occupationMatched = (occupationId) ? data.position.occupation == occupationId : true;
                    wageMatched = (minWage) ? data.position.compensation.wage.minAmount >= minWage : true;
                    return locationMatched && occupationMatched && wageMatched;
                }
            );



            var positionsRef = positions.ref();
            positionsRef.once('value', function(positionSnap) {
                   deferred.resolve(positionSnap.val());
                }, function (err) {
                    deferred.reject(err);
                }
            );

            return deferred.promise;

        };

        this.getPositionbyId = function(siteId, positionId){
            var ref = new Firebase(FIREBASE_URL);
            var deferred = $q.defer();
            var positions = new Firebase.util.NormalizedCollection(
                ref.child('position'),
                [ref.child('businessSite'), 'businessSite', 'position.siteId'],
                [ref.child('business'), 'business', 'position.businessId'],
                [ref.child('businessPhotos'), 'businessPhotos', 'position.businessId'],
                [ref.child('users'), 'users', 'position.mainHiringMgr']

            );

            // specify the fields for each path
            positions = positions.select('position.siteId', 'position.businessId', 'position.mainHiringMgr', {key: 'position.$value', alias: 'position'}, {key: 'businessSite.$value', alias: 'businessSite'},  {key: 'business.$value', alias: 'business'},
                {key: 'users.$value', alias: 'hiringMgr'},{key: 'businessPhotos.$value', alias: 'businessPhotos'});

            positions =  positions.filter(
                function(data, key, priority)
                {
                   return key == positionId;
                }
            );

            var positionsRef = positions.ref().child(positionId);

            positionsRef.once('value', function(positionSnap) {
                    deferred.resolve(positionSnap.val());
                }, function (err) {
                    deferred.reject(err);
                }
            );

            return deferred.promise;

        }

        this.applyforPosition
    };
})();


