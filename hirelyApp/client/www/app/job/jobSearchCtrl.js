/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.job').controller('JobSearchCtrl', ['$scope', '$http', '$state', '$stateParams',
        'FBURL', 'PositionService', 'GeocodeService', 'OccupationService','uiGmapGoogleMapApi', 'uiGmapIsReady', JobSearchCtrl]);



  function JobSearchCtrl($scope, $http, $state, $stateParams, FBURL, PositionService, GeocodeService, OccupationService, uiGmapGoogleMapApi, uiGmapIsReady) {
      var positionService = PositionService;
      var occupationService = OccupationService;
      var geocodeService = GeocodeService;

      $scope.positions = [];

      $scope.filter = {
          distance: ($stateParams.distance) ? $stateParams.distance : 20,
          minWage: ($stateParams.wage) ? $stateParams.wage : 0,
          occupationId: ($stateParams.occupationId) ? $stateParams.occupationId : '',
          occupation: ''

      };

      $scope.occupation = '';

      $scope.options = {
          types: '(regions)'
      };
      $scope.results = '';
      $scope.details = '';
      $scope.mapmarkers = [];
      $scope.map = '';
      $scope.mapOptions = '';
      $scope.occupations = [];
      $scope.placeId = $stateParams.placeId;


      var getJobs = function() {

          geocodeService.getPlacebyPlaceId($scope.placeId)
              .then(function (place) {
                  if (place) {
                     initializeMap();
                      $scope.results = place.formatted_address;
                      $scope.details = place;
                      //TODO:  move this to a seperate service
                      var firebaseRef = new Firebase(FBURL + '/businessSiteLocation');
                      var geoFire = new GeoFire(firebaseRef);
                      var geoQuery = geoFire.query({
                          center: [$scope.details.geometry.location.lat, $scope.details.geometry.location.lng],
                          radius: $scope.filter.distance * 1.60934
                      });


                      var onKeyEnteredRegistration = geoQuery.on("key_entered", function (key, location, distance) {
                          positionService.getOpenPositionsForLocation(key, $scope.filter.minWage,  $scope.filter.occupationId)
                              .then(function (site) {
                            if(site.positions && site.positions.length > 0){
                                $scope.mapmarkers.push(createMarker(key, location[0], location[1], site));
                                angular.forEach(site.positions, function (openPosition) {
                                    $scope.positions.push(createPosition(openPosition, distance, site.siteId, site.photos));

                                });
                            }

                          }, function (err) {

                          });
                      });

                      var onKeyExitedRegistration = geoQuery.on("key_exited", function (key, location, distance) {
                          //remove items from position arrray and remove markers
                          var positions = $scope.positions;
                          var markers = $scope.mapmarkers;
                          $scope.positions = _.reject(positions,
                              function (position) {
                                  return position.siteId == key;
                              }
                          );

                          $scope.mapmarkers = _.reject(markers,
                              function (marker) {
                                  return marker["id"] == key;
                              }
                          );
                      });
                  }

              }, function (err) {
                  //TODO:  add error handling
              });
      }


      var getOccupations = function(){
          occupationService.getOccupations().then(function(occupations) {
             $scope.occupations = occupations;
              if($stateParams.occupationId){
                  $scope.filter.occupation = _.findWhere(occupations, {id: $stateParams.occupationId})
              }
          }, function(err) {

          });
      };
      var initializeMap = function(){
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





          $scope.mapOptions = {
              scrollwheel: false
          };
      }
      var createMarker = function(id, lat, lng, site) {
          var marker = {

                  coords:{
                      latitude: '',
                      longitude: '',
                  },
              businessSite: '',
              photoUrl: '',
              show: false

          };
          var idkey = "id";
          marker[idkey] = id;
          marker.coords.latitude = lat;
          marker.coords.longitude = lng;
          marker.businessSite = site;
          var defaultPhoto = _.matcher({main: "true", size: "m"});
          var photo =  _.filter(site.photos, defaultPhoto);
          if(photo){
              marker.photoUrl = photo[0].source;
          }
          marker.onClick = function() {

              marker.show = !marker.show;
          };
        return marker;
      };

      var createPosition = function(openPosition, distance, siteId, photos){
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
          position.wage = openPosition.compensation.wage.maxAmount ? getMaxWageDisplay(openPosition.compensation.wage) : getnoMaxWageDisplay(openPosition.compensation.wage);
          position.siteId = siteId;
          position.positionId = openPosition.positionId;
          position.occupationId = openPosition.occupationId;
          position.postDate = openPosition.postDate;
          var defaultPhoto = _.matcher({main: "true"});
          var photo =  _.filter(photos, defaultPhoto);
          if(photo){
             position.photoUrl = photo[0].source;
          }

          return position;
      }

      var getMaxWageDisplay = function(wage)
      {
          return  wage.minAmount + '-' + wage.maxAmount + ' /' + wage.frequency;
      }

      var getnoMaxWageDisplay = function(wage)
      {

          return  wage.minAmount + '+' + ' /' + wage.frequency;
      }

      $scope.getJobsbyLocation = function(details){
          $scope.details = details;
          $scope.searchJobs();
      }

      $scope.getJobsbyOccupation = function(item, model, label){
         $scope.filter.occupationId = item.id;
          $scope.filter.occupation = item;
          $scope.searchJobs();

      }

      $scope.searchJobs = function(){
          $state.go('app.job', {placeId: $scope.details.place_id, wage: $scope.filter.minWage, occupationId: $scope.filter.occupationId, distance: $scope.filter.distance })
      }

      var initialize = function(){
          getJobs();
          getOccupations();

      };


      //initialize controller
      initialize();
}

 })();
