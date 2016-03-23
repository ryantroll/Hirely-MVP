/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('MasterCtrl', ['$stateParams', '$scope', '$modal', '$log', '$q', '$window', 'AuthService', 'UserService', 'GeocodeService', MasterCtrl ]);

    function MasterCtrl($stateParams, $scope, $modal, $log, $q, $window, AuthService, UserService, GeocodeService) {

        var vm = this;
        var geocodeService = GeocodeService;
        
        $scope.userService = UserService;
        $scope.currentUser = null;
        $scope.location = {};
        $scope.currentPlace = null;

        /**
         * check on loged in user
         * isUserLoggedIn method will do the needfull and set all the required variabls
         */

        var auth = AuthService.isUserLoggedIn();
        AuthService.syncCurrentUserFromDb();


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
        //$scope.authRef.$onAuth(function(authData) {
        //    if(authData)
        //    {
        //        if(!$scope.currentUser) {
        //            //try to retrieve user
        //            $scope.userService.getUserByKey(authData.uid)
        //                .then(function (snapshot) {
        //                    var exists = (snapshot.val() != null);
        //                    if (exists) {
        //                        $scope.userService.setCurrentUser(snapshot.val(), snapshot.key());
        //                        $scope.userService.setIsLoggedIn(true);
        //                    }
        //
        //                }, function (err) {
        //
        //                });
        //        }
        //    }
        //    else
        //    {
        //        $scope.userService.setIsLoggedIn(false);
        //
        //    }
        //});

        //watch for user auth changes, if changed broadcast to pages
        $scope.$watch('userService.getCurrentUser()', function (newVal) {
            $scope.$broadcast('currentUserChanged', { message: newVal });
            $scope.currentUser = newVal;

        },true);

        $scope.slideout = new Slideout({
            'panel': document.getElementById('hirely-content'),
            'menu': document.getElementById('mobile-nav'),
            'padding': 256,
            'tolerance': 70
        });

        var open = false;
        $scope.toggleMobileNav = function () {
            if(!open){
                $('.lines-button').addClass('open');
                open = true;
            } else {
                $('.lines-button').removeClass('open');
                open = false;
            }
            $scope.slideout.toggle();
        }

        $(window).resize(function(){
            $('.lines-button').removeClass('open');
            open = false;
            $scope.slideout.close();
        });


        var authService = AuthService;

        //listen for changes to current user
        $scope.$on('currentUserChanged', function (event, args) {
            $scope.currentUser = args.message;
        });


        //region Controller Functions
        vm.login = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/login.html',
                controller: 'LoginCtrl as vm',
                resolve: {
                    items: function () {

                    }
                }
            });
        };

        vm.register = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/account/register.html',
                controller: 'RegisterCtrl as vm'
            });
        };

        vm.hmregister = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/manager/hmRegister.html',
                controller: 'HMRegisterCtrl as vm',

            });
        };

        vm.logout = function(){
            authService.logout();
        };
    };
})();