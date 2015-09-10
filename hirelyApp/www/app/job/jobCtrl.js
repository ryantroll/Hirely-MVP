/**
 * Created by mike.baker on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.jobdetails').controller('JobCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', '$http', 'GeocodeService', 'JobdetailsService', JobCtrl ]);

      function JobCtrl($scope, $state, $stateParams, $firebaseArray, $http, GeocodeService, JobdetailsService) {
           
        var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
        var fireRef = new Firebase(url);

        var geocodeService = GeocodeService;
        var jobdetailsService = JobdetailsService;
   

        $scope.jobOpenings = $firebaseArray(fireRef);
		$scope.split_jobs = [['job1', 'job2', 'job3']];

        $scope.details = geocodeService.getPlace();
        $scope.jobdetails = $scope.jobOpenings;
      

        $scope.setJobResults = function(jobUID) {
             jobdetailsService.setJob(jobUID);
            $state.go('app.jobdetails')

        }

      
 }


})();

myApp.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: '711561845732-pg1q3d3cn30f4jk07bmqno9qeio7unmg.apps.googleusercontent.com',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

myApp.controller('MainCtrl', function($scope, $firebaseArray, $http, GeocodeService, uiGmapGoogleMapApi, uiGmapIsReady) {
    var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
    var fireRef = new Firebase(url);

    $scope.mapmarkers = $firebaseArray(fireRef);
    $scope.details = GeocodeService.getPlace();
    uiGmapGoogleMapApi
        .then(function(maps){
            $scope.googlemap = {};
            $scope.map = {
                center: {
                    latitude: $scope.details.geometry.location.lat,
                    longitude: $scope.details.geometry.location.long
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
                latitude: 38.9071923,
                longitude: -77.03687070000001,
                draggable: false,
                animation: 1 // 1: BOUNCE, 2: DROP
            },
            data: 'restaurant'
        },
        {
            id: 1,
            coords: {
                latitude: 38.8799697,
                longitude: -77.1067698,
                draggable: false,
                animation: 1 // 1: BOUNCE, 2: DROP
            },
            data: 'house'
        },
        {
            id: 2,
            coords: {
                latitude: 38.704282,
                longitude: -77.2277603,
                draggable: false,
                animation: 1 // 1: BOUNCE, 2: DROP
            },
            data: 'hotel'
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
});