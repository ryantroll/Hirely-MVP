/**
 * Created by labrina.loving on 9/15/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('OccupationService', ['$q', '$http', OccupationService]);

    function OccupationService($q, $http) {

        //this.getOccupations = function getOccupations(){
        //
        //    var occupationRef =  new Firebase(FBURL + "/onetOccupation");
        //    var deferred = $q.defer();
        //    occupationRef.once("value", function (snapshot) {
        //            var occupations = [];
        //            snapshot.forEach(function(item) {
        //                var itemVal = item.val();
        //                var key = item.key();
        //                var occupation = {
        //                    id: '',
        //                    title: '',
        //                    socCode: ''
        //                }
        //                occupation.id = key;
        //                occupation.title = itemVal.title;
        //                occupation.socCode = itemVal.onetsocCode;
        //                occupations.push(occupation);
        //
        //
        //            });
        //            deferred.resolve(occupations);
        //
        //        }, function (err) {
        //            deferred.reject(snapshot);
        //        }
        //    );
        //    return deferred.promise;
        //
        //};

        this.getOccupations = function getOccupations(query){
            var deferred = $q.defer();

            $http.get('/api/onet/titles/search/'+ query)
              .success(function(data) {
                  deferred.resolve(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });

            return deferred.promise;
        }
    };
})();

