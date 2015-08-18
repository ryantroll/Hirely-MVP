/**
 * Created by labrina.loving on 8/14/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('GeocodeService', ['$q', '$http', GeocodeService]);

    function GeocodeService($q, $http) {
        var MAPS_ENDPOINT = 'http://maps.google.com/maps/api/geocode/json?latlng={POSITION}&sensor=false';
        var currentPlace = null;

        var service =  {
            getPlacebyLatLong : getPlacebyLatLong,
            getPlace: getPlace,
            setPlace: setPlace
        };
        return service;

        function getPlacebyLatLong(latitude, longitude){
            var url = MAPS_ENDPOINT.replace('{POSITION}', latitude + ',' + longitude);
            var deferred = $q.defer();


            $http.get(url).success(function(response) {
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

        function setPlace(place)
        {
            currentPlace = place;
        }

        function getPlace()
        {
            return currentPlace;
        }

    }


})();
