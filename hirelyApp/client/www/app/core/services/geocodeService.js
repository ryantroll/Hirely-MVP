/**
 * Created by labrina.loving on 8/14/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('GeocodeService', ['$q', '$http', 'GOOGLEMAPSURL', 'GOOGLEPLACESURL', 'GOOGLEMAPSSERVERKEY', GeocodeService]);

    function GeocodeService($q, $http, GOOGLEMAPSURL, GOOGLEPLACESURL, GOOGLEMAPSSERVERKEY) {
        var mapsEndPoint = GOOGLEMAPSURL;
        var placesEndPoint = GOOGLEPLACESURL;
        var googleMapsKey = GOOGLEMAPSSERVERKEY;
        var currentPlace = null;

        var service =  {
            getPlacebyLatLong : getPlacebyLatLong,
            getPlacebyPlaceId : getPlacebyPlaceId,
            getPlace: getPlace,
            setPlace: setPlace
        };
        return service;

        function getPlacebyLatLong(latitude, longitude){
            var url = mapsEndPoint.replace('{POSITION}', latitude + ',' + longitude);
            var deferred = $q.defer();


            $http.get(url, {cache: true}).success(function(response) {
                // hacky
                var place;
                angular.forEach(response.results, function(result) {
                    if(result.types[0] === 'postal_code') {
                        place = result;
                    }
                });
                deferred.resolve(place);
            }).error(deferred.reject);

            return deferred.promise;
        }

        function getPlacebyPlaceId(placeId){

            var deferred = $q.defer();

            $http.get('/api/googleplace'+ placeId)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            return deferred.promise;
        }

        function getPlace(){
            return currentPlace;
        }

        function setPlace(place){
            currentPlace = place;
        }




    }


})();
