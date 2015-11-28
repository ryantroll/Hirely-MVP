(function () {
    'use strict';

    angular.module('hirelyApp.home').controller('HomeCtrl', ['$scope', '$state', '$stateParams', 'GeocodeService', '$window','$timeout', 'BusinessService' ,'JobService','UserService',HomeCtrl ]);

    function HomeCtrl ($scope, $state, $stateParams, GeocodeService, $window, $timeout, BusinessService , JobService, UserService) {


        var geocodeService = GeocodeService;

        $scope.flexSliderOptions = {
            animation: "fade",
            directionNav: false,
            controlNav: false,
            slideshowSpeed: 10000
        };

        angular.element('.search-container').addClass('animated fadeInUp');

        angular.element('.search-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            angular.element('.search-container').removeClass('animated fadeInUp');
        });


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

            //var place = geocodeService.getPlace();
        //if(place){
        //
        //    $scope.results = place.formatted_address;
        //    $scope.details = place;
        //}
        //
        $scope.getResults = function() {
            if(!!$scope.selectedLocation){
                geocodeService.setPlace($scope.selectedLocation);
                $state.go('app.job', {placeId: $scope.selectedLocation.placeId});
            }
            else {
                console.log('no!');
                angular.element('.search-container').addClass('animated shake');
                angular.element('.search-container').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    angular.element('.search-container').removeClass('animated shake');
                });
            }

        };

        /**********************************************************************************
         *
         *  TESTING AREA - STAY AWAY!!
         *
        **********************************************************************************/
/*
        $scope.company = {
            name: 'Hani Hanna',
            description: 'Resturant',
            type: '0',
            active: 'true',
            placeId: 'Gsghsddf215584sdfd',
            website: 'www.hanna.com',
            photos: {url:'http://www.hanna.com/images/hani.jpg',main:'true',order:'0'},
            children: {},
            parent: {},
            jobs: {},
            address: {google_place_id:'ggadfsf255sdf', latitude:'34.8167',longitude:'36.1167',formatted_address:'safita-alakba',postal_code:'043'}
        };
        BusinessService.createNewBusiness($scope.company, 123123123);*/

        //$scope.job = {
        //    businessId: {1234:'true'},
        //    hiringMgr: {123123132:'true'},
        //    contact: {email:'hani.hanna@develoopers.com.au',phone:'77445855',website:'www.hanna.com'},
        //    applicants: {65555:'true'},
        //    workingHrs: {0:{open:'10',close:'00'},1:{open:'10',close:'00'},2:{open:'10',close:'00'},3:{open:'10',close:'00'},4:{open:'10',close:'00'},5:{open:'10',close:'00'},6:{open:'12',close:'00'}}
        //};

        //JobService.createNewJob($scope.job, 1010);

        $scope.userData = {
            firstName : 'Hani',
            lastName: 'Hanna',
            email : 'hani-hanna-89@gmail-com',
            userType : '1',
            profileImageUrl : 'www.hani.com/pic/hani.jpg',
            personalStatement : 'Same shit different days',
            provider : 'password',
            createdOn : '27-11-2015',
            lastModifiedOn : '27-11-2015'
        };


        $scope.address = {
          formattedAddress : 'Syria',
          zipCode : '00963',
          unit : ' ',
          street : 'Al akabe',
          city : 'Safita',
          state : 'Tartous',
          lng : '36.125',
          lat : '37.452'
        };

        $scope.user = UserService.getUserById('hani-hanna-89%40gmail-com').success(function(user){
            console.log(user.firstName);
        });
    }
})();
