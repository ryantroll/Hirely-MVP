/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('MasterCtrl', ['$scope', '$window', 'AuthService', 'UserService', 'GeocodeService', MasterCtrl ]);

    function MasterCtrl($scope, $window, authService, userService, geocodeService) {

        $scope.isUserLoggedIn = authService.isUserLoggedIn();
        $scope.location = {};
        $scope.currentPlace = null;
        
        /**
         * check on loged in user
         * isUserLoggedIn method will do the needfull and set all the required variabls
         */
        
        
        $window.navigator.geolocation.getCurrentPosition(function(position){

            var lat = position.coords.latitude;
            var long = position.coords.longitude;

            $scope.$apply(function() {
                    $scope.location.latitude = lat;
                    $scope.location.longitude = long;
                    if(lat && long)
                    {
                        geocodeService.getPlacebyLatLong(lat, long)
                            .then(function(place) {
                                if(place){
                                    $scope.currentPlace = place;
                                    $scope.$broadcast('currentPlaceChanged', { message: place });
                                }
                            }, function(err) {
                                deferred.reject(err);
                            });
                    }

                }
            )
        });


        //listen for changes to current user
        $scope.$on('UserLoggedIn', function (event, args) {
            $scope.isUserLoggedIn = true;
        });
        $scope.$on('UserLoggedOut', function (event, args) {
            $scope.isUserLoggedIn = false;
        });

        $scope.logout = function(){
            authService.logout();
        };
    };
})();