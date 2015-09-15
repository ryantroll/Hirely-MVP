/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.job').controller('JobSearchCtrl', ['$scope', '$http', '$state', '$stateParams',
        'PositionService', 'GeocodeService', 'OccupationService','uiGmapGoogleMapApi', 'uiGmapIsReady', JobSearchCtrl]);


  function JobSearchCtrl($scope, $http, $state, $stateParams, PositionService, GeocodeService, OccupationService, uiGmapGoogleMapApi, uiGmapIsReady) {
      var positionService = PositionService;
      var occupationService = OccupationService;
      var geocodeService = GeocodeService;

      $scope.positions = [];

      $scope.filter = {
          distance: 20,
          minWage: 0,
          maxWage: 100,
          occupation: '',
          location: ''
      };
      $scope.details = GeocodeService.getPlace();
      $scope.mapmarkers = [];
      $scope.occupations = [];




      var getOccupations = function(){
          occupationService.getOccupations().then(function(occupations) {
             $scope.occupations = occupations;
          }, function(err) {

          });
      };

      var createMarker = function(id, lat, lng) {
          var marker = {

                  coords:{
                      latitude: '',
                      longitude: '',
                  }

          };
          var idkey = "id";
          marker[idkey] = id;
          marker.coords.latitude = lat;
          marker.coords.longitude = lng;
        return marker;
      };

      var initialize = function(){
          getOccupations();

      };

      var createPosition = function(openPosition, distance){
          var position = {
              title: '',
              companyName: '',
              positionId: '',
              siteId: '',
              wage: {
                  amount: '',
                  frequency: ''
              },
              distance: '',
              employmentTypes: '',
              occupationId: '',
              postDate: '',
              photoUrl: ''
          };
          position.companyName = openPosition.companyName;
          position.distance = distance/1.60934;
          position.employmentTypes = openPosition.employmentTypes;
          position.status = openPosition.status;
          position.title = openPosition.title;
          position.wage = openPosition.wage;
          position.employmentTypes = openPosition.employmentTypes;
          position.siteId = openPosition.siteId;
          position.positionId = openPosition.positionId;
          position.occupationId = openPosition.occupationId;
          position.postDate = openPosition.postDate;
          position.photoUrl = openPosition.photo;
          return position;
      }

      //TODO:  move this to a seperate service
      var firebaseRef = new Firebase("https://shining-torch-5144.firebaseio.com/businessSiteLocation");
      var geoFire = new GeoFire(firebaseRef);
      var geoQuery = geoFire.query({
          center: [$scope.details.geometry.location.lat, $scope.details.geometry.location.lng],
          radius:  $scope.filter.distance * 1.60934
      });


      var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
          positionService.getOpenPositionsForLocation(key).then(function(positions) {
              angular.forEach(positions, function(openPosition) {
                  if(openPosition.status == 'Active') {
                      $scope.positions.push(createPosition(openPosition, distance));
                      $scope.mapmarkers.push(createMarker(key, location[0], location[1]));
                  }

              });
          }, function(err) {

          });

          //get active jobs at each location
      });


      uiGmapGoogleMapApi
          .then(function(maps){
              $scope.googlemap = {};
              $scope.map = {
                  center: {
                      latitude: $scope.details.geometry.location.lat,
                      longitude: $scope.details.geometry.location.lng
                  },
                  zoom: 10,
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



      uiGmapIsReady.promise()                                    // if no value is put in promise() it defaults to promise(1)
          .then(function(instances) {
              console.log(instances[0].map);                        // get the current map
          })
          .then(function(){
              $scope.addMarkerClickFunction($scope.markers);
          });



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
          streetViewControl : true,
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
      initialize();
}

 })();
