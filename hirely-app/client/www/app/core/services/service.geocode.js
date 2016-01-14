/**
 * Created by labrina.loving on 8/14/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('GeocodeService', ['$q', '$http', 'GOOGLEMAPSURL', 'FIREBASE_URL', GeocodeService]);

    function GeocodeService($q, $http, GOOGLEMAPSURL, FIREBASE_URL) {
        var mapsEndPoint = GOOGLEMAPSURL;
        var currentPlace = null;

        var service =  {
            getPlacebyLatLong : getPlacebyLatLong,
            getPlacebyPlaceId : getPlacebyPlaceId,
            getPlace: getPlace,
            setPlace: setPlace,
            calculateDistancetoSite: calculateDistancetoSite,
            getCityBySearchQuery: getCityBySearchQuery,
            getLocationBySearchQuery: getLocationBySearchQuery,
            geoCodeAddress: geoCodeAddress,
            placeSearch: placeSearch,
            getPlaceDetails: getPlaceDetails
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
                    currentPlace = data;
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

        function calculateDistancetoSite(siteId, placeId){
            var deferred = $q.defer();
            var firebaseRef = new Firebase(FIREBASE_URL + '/businessSiteLocation');
            var geoFire = new GeoFire(firebaseRef);
            geoFire.get(siteId).then(function(siteLocation) {
                var place = getPlacebyPlaceId((placeId)).then(function(place) {
                    var currentPlaceLocation = [place.geometry.location.lat, place.geometry.location.lng];
                    var distance = GeoFire.distance(currentPlaceLocation, siteLocation) * 0.621371;
                    deferred.resolve(distance);

                }, function(error) {
                    console.log("Error: " + error);
                });

            }, function(error) {
                console.log("Error: " + error);
            });
            return deferred.promise;
        }


        function getCityBySearchQuery(query){
            var deferred = $q.defer();

            $http.get('/api/search/cities/'+ query)
              .success(function(data) {
                  console.log(data);
                  currentPlace = data;
                  deferred.resolve(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });

            return deferred.promise;
        }


        function getLocationBySearchQuery(query){
            var deferred = $q.defer();

            $http.get('/api/search/locations/'+ query)
              .success(function(data) {
                  console.log(data);
                  currentPlace = data;
                  deferred.resolve(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });

            return deferred.promise;
        }

        function geoCodeAddress(query){
            var deferred = $q.defer();

            $http.get('/api/geocode/'+ query)
              .success(function(data) {
                  currentPlace = data;
                  deferred.resolve(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });

            return deferred.promise;
        }

        function placeSearch(query){
            var deferred = $q.defer();

            $http.get('/api/placeSearch/'+ query)
                .success(function(data) {
                    currentPlace = data;
                    deferred.resolve(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });

            return deferred.promise;
        }

        function getPlaceDetails(query){
            var deferred = $q.defer();

            $http.get('/api/places/'+ query)
              .success(function(data) {
                  currentPlace = data;
                  deferred.resolve(data);
              })
              .error(function(data) {
                  console.log('Error: ' + data);
              });

            return deferred.promise;
        }


    }


})();
