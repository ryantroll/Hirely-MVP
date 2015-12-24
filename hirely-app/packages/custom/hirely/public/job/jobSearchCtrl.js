/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('mean.hirely.job').controller('JobSearchCtrl', ['$scope', '$http', '$state', '$stateParams',
        'FIREBASE_URL', 'PositionService', 'GeocodeService', 'OccupationService','UserService', 'CandidateService','Notification', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$timeout' ,JobSearchCtrl]);



  function JobSearchCtrl($scope, $http, $state, $stateParams, FIREBASE_URL, PositionService, GeocodeService, OccupationService,UserService, CandidateService, Notification, uiGmapGoogleMapApi, uiGmapIsReady, $timeout) {
      var positionService = PositionService;
      var occupationService = OccupationService;
      var geocodeService = GeocodeService;
      var userService = UserService;
      var candidateService = CandidateService;

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
                      var firebaseRef = new Firebase(FIREBASE_URL + '/businessSiteLocation');
                      var geoFire = new GeoFire(firebaseRef);
                      var geoQuery = geoFire.query({
                          center: [$scope.details.geometry.location.lat, $scope.details.geometry.location.lng],
                          radius: $scope.filter.distance * 1.60934
                      });


                      var onKeyEnteredRegistration = geoQuery.on("key_entered", function (key, location, distance) {
                          positionService.getOpenPositionsForLocation(key, $scope.filter.minWage,  $scope.filter.occupationId)
                              .then(function (positions) {
                                  if(positions)
                                  {
                                      angular.forEach(positions, function (openPosition, id) {
                                          $scope.positions.push(createPosition(openPosition, distance, id));
                                          $scope.mapmarkers.push(createMarker(id, location[0], location[1], openPosition.businessSite));
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


      //var getOccupations = function(){
      //    occupationService.getOccupations().then(function(occupations) {
      //       $scope.occupations = occupations;
      //        if($stateParams.occupationId){
      //            $scope.filter.occupation = _.findWhere(occupations, {id: $stateParams.occupationId})
      //        }
      //    }, function(err) {
      //
      //    });
      //};



      var initializeMap = function(){
          uiGmapGoogleMapApi
              .then(function(maps){
                  $scope.googlemap = {};
                  $scope.map = {
                      center: {
                          latitude: $scope.details.geometry.location.lat,
                          longitude: $scope.details.geometry.location.lng
                      },
                      zoom: 100,
                      pan: 1,
                      options: $scope.mapOptions,
                      control: {},
                      clusterOptions:  {
                          title: 'Hi I am a Cluster!',
                          gridSize: 20,
                          ignoreHidden: true,
                          minimumClusterSize: 1,
                          zoomOnClick: false
                      },
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

        return marker;
      };

      var createPosition = function(openPosition, distance, positionId){
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
          position.companyName = openPosition.business.name;
          position.distance = distance/1.60934;
          position.employmentTypes = openPosition.position.employmentTypes;
          position.status = openPosition.position.status;
          position.title = openPosition.position.title;
          position.wage = openPosition.position.compensation.wage.maxAmount ? getMaxWageDisplay(openPosition.position.compensation.wage) : getnoMaxWageDisplay(openPosition.position.compensation.wage);
          position.siteId = openPosition.siteId;
          position.positionId = positionId;
          position.occupationId = openPosition.position.occupation;
          position.postDate = openPosition.postDate;
          var defaultPhoto = _.matcher({main: "true"});
          var photo =  _.filter(openPosition.businessPhotos, defaultPhoto);
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
      };

      $scope.getJobsbyLocation = function(details){
          $scope.details = details;
          $scope.searchJobs();
      };

      $scope.getJobsbyOccupation = function(item, model, label){
         $scope.filter.occupationId = item.id;
          $scope.filter.occupation = item;
          $scope.searchJobs();

      };

      $scope.searchJobs = function(){
          $state.go('app.job', {placeId: $scope.details.place_id, wage: $scope.filter.minWage, occupationId: $scope.filter.occupationId, distance: $scope.filter.distance })
      };

      $scope.addToFavorites = function(positionId){
         var user = userService.getCurrentUser();
         candidateService.savePositiontoFavorites(user.userId, positionId);
          Notification.success('Job Added to Favorites');
      };

      var initialize = function(){
          getJobs();
          //getOccupations();

      };




      var locations = [];
      $scope.selectedLocation = undefined;


      $scope.searchLocations = function(query){
          if(!!query && query.trim() != ''){
              return geocodeService.getCityBySearchQuery(query).then(function(data){
                  locations = [];
                  if(data.statusCode == 200){
                      data.results.predictions.forEach(function(prediction){
                          locations.push({address: prediction.description, placeId: prediction.id});
                      });
                      return locations;
                  } else {
                      return {};
                  }
              });
          }
      };
      var occupations = [];
      $scope.selectedOccupation = null;
      $scope.searchOnetOccupations = function(query){
          if(!!query && query.trim() != ''){
              return occupationService.getOccupations(query).then(function(data){
                  occupations = [];
                  if(data.statusCode == 200){
                      data.results.forEach(function(occ){
                          occupations.push({code: occ.code, title: occ.title});
                      });
                      return occupations;
                  } else {
                      return {};
                  }
              });
          } else {
              return {}
          }
      };


      //initialize controller
      initialize();
}

 })();
