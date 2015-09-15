/**
 * Created by labrina.loving on 9/15/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('OccupationService', ['$q','FBURL', '$firebaseObject', 'fbutil', OccupationService]);

    function OccupationService($q, FBURL, $firebaseObject, fbutil, OccupationService) {

        this.getOccupations = function getOccupations(){

            var occupationRef =  new Firebase(FBURL + "/onetOccupation");
            var deferred = $q.defer();
            occupationRef.once("value", function (snapshot) {
                    var occupations = [];
                    snapshot.forEach(function(item, key) {
                        var itemVal = item.val();
                        var occupation = {
                            id: '',
                            title: '',
                            socCode: ''
                        }
                        occupation.id = key;
                        occupation.title = itemVal.title;
                        occupation.socCode = itemVal.onetsocCode;
                        occupations.push(occupation);


                    });
                    deferred.resolve(occupations);

                }, function (err) {
                    deferred.reject(snapshot);
                }
            );
            return deferred.promise;

        };


    };
})();

