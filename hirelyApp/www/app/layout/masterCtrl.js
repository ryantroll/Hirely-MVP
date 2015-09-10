/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('MasterCtrl', ['$stateParams', '$scope', '$modal', '$log', '$q', '$window', 'AuthService', 'UserService', 'GeocodeService', MasterCtrl ]);

    function MasterCtrl($stateParams, $scope, $modal, $log, $q, $window, AuthService, UserService, GeocodeService) {

        var vm = this;
        var geocodeService = GeocodeService;

        $scope.authRef = AuthService.AuthRef();
        $scope.userService = UserService;
        $scope.currentUser = null;
        $scope.location = {};
        $scope.currentPlace = null;


        //
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

        // any time auth status updates, add the user data to scope
        $scope.authRef.$onAuth(function(authData) {
            if(authData)
            {
                if(!$scope.currentUser) {
                    //try to retrieve user
                    $scope.userService.getUserByKey(authData.uid)
                        .then(function (snapshot) {
                            var exists = (snapshot.val() != null);
                            if (exists) {
                                $scope.userService.setCurrentUser(snapshot.val(), snapshot.key());
                                $scope.userService.setIsLoggedIn(true);
                            }

                        }, function (err) {

                        });
                }
            }
            else
            {
                $scope.userService.setIsLoggedIn(false);
                $scope.userService.setCurrentUser(null)
            }
        });

        //watch for user auth changes, if changed broadcast to pages
        $scope.$watch('userService.getCurrentUser()', function (newVal) {
            $scope.$broadcast('currentUserChanged', { message: newVal });
            $scope.currentUser = newVal;

        },true);

    };
})();