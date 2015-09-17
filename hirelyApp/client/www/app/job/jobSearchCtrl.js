/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.job').controller('JobSearchCtrl', ['$scope', '$http', '$state', '$stateParams',
        'PositionService', 'GeocodeService', 'JobdetailsService', 'uiGmapGoogleMapApi', 'uiGmapIsReady', JobSearchCtrl]);


  function JobSearchCtrl($scope, $http, $state, $stateParams, PositionService, GeocodeService, JobdetailsService, uiGmapGoogleMapApi, uiGmapIsReady) {
      var jobdetailsService = JobdetailsService;
      $scope.setJobResults = function(jobUID) {
             jobdetailsService.setJob(jobUID);
            $state.go('app.jobdetails')

        }
        
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
            id: 18,
            coords: {
                latitude: $scope.details.geometry.location.lat,
                longitude: $scope.details.geometry.location.lng
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
