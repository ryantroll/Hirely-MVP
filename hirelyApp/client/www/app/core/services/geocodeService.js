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
            var url = placesEndPoint.replace('{PLACEID}', placeId)
                .replace('{KEY}', googleMapsKey);
            var deferred = $q.defer();
            var place = '';

            $http.get(url, {cache: true}).success(function(response) {
                if(response.status == 'OK'){
                    place = response.result;
                    deferred.resolve(place);
                }
                else{
                    deferred.reject;
                }
            }).error(deferred.reject);

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
