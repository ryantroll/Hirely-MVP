/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.job').controller('JobSearchCtrl', ['$scope', '$http', '$state', '$stateParams',
        'PositionService', 'GeocodeService', 'uiGmapGoogleMapApi', 'uiGmapIsReady', JobSearchCtrl]);


  function JobSearchCtrl($scope, $http, $state, $stateParams, PositionService, GeocodeService, uiGmapGoogleMapApi, uiGmapIsReady) {
      var positionService = PositionService
      $scope.positions = "";
      $scope.mapmarkers = "";
      $scope.details = GeocodeService.getPlace();

      positionService.getOpenPositions().then(function(positions) {
          $scope.positions = positions;

      }, function(err) {

      });

      uiGmapGoogleMapApi
          .then(function(maps){
              $scope.googlemap = {};
              $scope.map = {
                  center: {
                      latitude: $scope.details.geometry.location.lat,
                      longitude: $scope.details.geometry.location.lng
                  },
                  zoom: 14,
                  pan: 1,
                  options: $scope.mapOptions,
                  control: {},
                  events: {
                      tilesloaded: function (maps, eventName, args) {
                      },
                      dragend: function (maps, eventName, args) {
                      },
                      zoom_changed: function (maps, eventName, args) {
                      }
                  }
              };
          });

      $scope.windowOptions = {
          show: false
      };

      $scope.onClick = function(data) {
          $scope.windowOptions.show = !$scope.windowOptions.show;
          console.log('$scope.windowOptions.show: ', $scope.windowOptions.show);
          console.log('This is a ' + data);
          alert('This is a ' + data);
      };

      $scope.closeClick = function() {
          $scope.windowOptions.show = false;
      };

      $scope.title = "Window Title!";

      uiGmapIsReady.promise()                                    // if no value is put in promise() it defaults to promise(1)
          .then(function(instances) {
              console.log(instances[0].map);                        // get the current map
          })
          .then(function(){
              $scope.addMarkerClickFunction($scope.markers);
          });

        $scope.markers = [
         {
            id: 0,
            coords: {
                latitude: 38.910586,
                longitude: -77.021683,
                },
            data: 'Compass Coffee'
        },
        {
            id: 1,
            coords: {
                latitude: 38.912109,
                longitude: -77.032374,
                },
            data: 'Barcelona Wine Bar'
        },
        {
            id: 2,
            coords: {
                latitude: 38.704282,
                longitude: -77.2277603,
                },
            data: 'hotel'
        },
       {
            id: 3,
            coords: {
                latitude: 38.910908,
                longitude: -77.032568,
                },
            data: 'The Bike Rack'
        },
        {
            id: 4,
            coords: {
                latitude: 38.897013,
                longitude: -77.02234,
                },
            data: 'Poste Modern Brasserie'
        },
        {
            id: 5,
            coords: {
                latitude: 38.905423,
                longitude: -77.059664,
                },
            data: 'Sprinkles Cupcakes'
        },
        {
            id: 6,
            coords: {
                latitude: 38.909291,
                longitude: -77.033443,
                },
            data: 'Wholefoods'
        },
        {
            id: 7,
            coords: {
                latitude: 38.897844,
                longitude: -77.033285,
                },
            data: 'Garrison & Sisson, Inc'
        },
        {
            id: 8,
            coords: {
                latitude: 38.902917,
                longitude: -77.037824,
                },
            data: 'BCG Attorney Search'
        }, 
        {
            id: 9,
            coords: {
                latitude: 38.891613,
                longitude: -77.001231,
                },
            data: 'Karson Butler Events'
        }, 
        {
            id: 10,
            coords: {
                latitude: 38.895273,
                longitude: -77.015736,
                },
            data: 'DCHR'
        },
        {
            id: 11,
            coords: {
                latitude: 38.895273,
                longitude: -77.015736,
                },
            data: 'DCHR'
        },
        {
            id: 12,
            coords: {
                latitude: 38.896921,
                longitude: -77.010342,
                },
            data: 'Roll Call, Inc.'
        },
        {
            id: 13,
            coords: {
                latitude: 38.912109,
                longitude: -77.032374,
                },
            data: 'Barcelona Wine Bar'
        },
        {
            id: 14,
            coords: {
                latitude: 38.912109,
                longitude: -77.032374,
                },
            data: 'Barcelona Wine Bar'
        },
        {
            id: 15,
            coords: {
                latitude: 38.910586,
                longitude: -77.021683,
                },
            data: 'Compass Coffee'
        },
        {
            id: 16,
            coords: {
                latitude: 38.905423,
                longitude: -77.059664,
                },
            data: 'Sprinkles Cupcakes'
        },
        {
            id: 17,
            coords: {
                latitude: 38.895273,
                longitude: -77.015736
                },
            data: 'DCHR'
        },
       {
            id: 18,
            coords: {
                latitude: $scope.details.geometry.location.G,
                longitude: $scope.details.geometry.location.K,
                },
            data: 'Job Location Search Area!'
        }
          
    ];

      $scope.addMarkerClickFunction = function(markersArray){
          angular.forEach(markersArray, function(value, key) {
              value.onClick = function(){
                  $scope.onClick(value.data);
              };
          });
      };


      $scope.MapOptions = {
          minZoom : 3,
          zoomControl : false,
          draggable : true,
          navigationControl : false,
          mapTypeControl : false,
          scaleControl : false,
          streetViewControl : false,
          disableDoubleClickZoom : false,
          keyboardShortcuts : true,
          styles : [{
              featureType : "poi",
              elementType : "labels",
              stylers : [{
                  visibility : "off"
              }]
          }, {
              featureType : "transit",
              elementType : "all",
              stylers : [{
                  visibility : "off"
              }]
          }],
      };
}

 })();
