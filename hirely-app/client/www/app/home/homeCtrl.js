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

        $scope.company = {
            name: 'KFC',
            description: 'Resturant',
            admin: '1',
            type: '0',
            active: 'true',
            placeId: 'Gsghsddf215584sdfd',
            website: 'www.KFC.com'
        };
/*
        //$scope.job = {
        //    businessId: {1234:'true'},
        //    hiringMgr: {123123132:'true'},
        //    contact: {email:'hani.hanna@develoopers.com.au',phone:'77445855',website:'www.hanna.com'},
        //    applicants: {65555:'true'},
        //    workingHrs: {0:{open:'10',close:'00'},1:{open:'10',close:'00'},2:{open:'10',close:'00'},3:{open:'10',close:'00'},4:{open:'10',close:'00'},5:{open:'10',close:'00'},6:{open:'12',close:'00'}}
        //};

        //JobService.createNewJob($scope.job, 1010);

        $scope.userData = {
            firstName : 'Hanu',
            lastName: 'Hanna',
            email : 'hani.hanna@gmail.com',
            userType : '1',
            profileImageUrl : 'www.hani.com/pic/hehe.jpg',
            personalStatement : 'work hard in silence let success make the noise',
            provider : 'password',
            createdOn : '25-11-2015',
            lastModifiedOn : '28-11-2015'
        };

*/
        $scope.address = {
          formattedAddress : 'USA-NY',
          zipCode : '001',
          unit : ' ',
          street : 'AA',
          city : 'NY',
          state : 'NY',
          lng : '75.36',
          lat : '35.36'
        };

        $scope.contact = {
            email : 'hani@developpers.com.au',
            mobile: '05236542'
        }

        $scope.photo = {
            url: 'http://www.kfc.com/pic/logo.jpg',
            main: 'true'
        }

        //$scope.userData.address = $scope.address;

        $scope.company.address = $scope.address;
        $scope.company.photo = $scope.photo;

        /*
        $scope.user = UserService.getUserById('hani-hanna-89%40gmail-com').then(function(user){
            console.log(user.firstName);
        });*/

        //UserService.createNewUser($scope.userData,589-676);
        BusinessService.testObj();


        // $scope.job = {
        //     businessId : '0L5DpYpNjhPiqj1wbFv',
        //     hiringManager : '-444',
        //     position : 'position',
        //     numberOfPositions : '3',
        //     occupationId : 'jhkjjhhk-87',
        //     description : 'Hiring 3 waiters',
        //     createdAt : '27-11-2015',
        //     updatedAt : '28-11-2015',
        //     available : 'true'
        // }
        //
        // JobService.createNewJob($scope.job);

    }
})();
