/**
 *
 * User main dashboard page controller
 *
 * Iyad Bitar - Hirely 2015
 */
(function () {
    'use strict';

    angular.module('hirelyApp').controller('UserDashboardController', ['$rootScope', '$scope', '$state', '$timeout', 'loginRedirectPath', 'FavoritesService', 'JobApplicationService', 'BusinessService', 'UserService', 'AuthService', UserDashboardController]);


    function UserDashboardController($rootScope, $scope, $state, $timeout, loginRedirectPath, FavoritesService, JobApplicationService, BusinessService, UserService, AuthService) {

        var positionIds = [];

        $scope.AuthService = AuthService;

        $scope.myLocations = [];
        $scope.myPositions = [];

        $scope.logout = function() {
            AuthService.logout();
            if ($state.current.authRequired) {
                console.log("Caught private page with token expired");
                $rootScope.nextState.push({state:$state.current.name, params:$state.params});
                $state.go(loginRedirectPath, {message: "You must login to view this page."});
            }
        };

        $scope.initDash = function () {
            FavoritesService.getFavorite({userId: AuthService.currentUserId, type: 'position'})
                .then(
                    function (favs) {
                        $scope.myFavorites = favs;
                        for (var x = 0; x < favs.length; x++) {
                            positionIds.push(favs[x].positionId)
                        }
                        return JobApplicationService.getByUserId(AuthService.currentUserId)
                    },
                    function (err) {
                        console.error("UD1:"+err);
                        $scope.dataError = true;
                    }
                )
                .then(
                    function (apps) {
                        $scope.myApplications = apps;
                        if (apps.length) {
                            for (var x = 0; x < apps.length; x++) {
                                if (positionIds.indexOf(apps[x].positionId) < 0) {
                                    positionIds.push(apps[x].positionId)
                                }
                            }
                        }
                        return BusinessService.getPositionsByIds(positionIds);
                    },
                    function (err) {
                        console.error("UD2:"+err);
                        $scope.dataError = true;
                    }
                )
                .then(
                    function (positions) {
                        $scope.positions = positions;
                        return BusinessService.getPositionsByManagerId(AuthService.currentUserId);
                    },
                    function (err) {
                        console.error("UD3:"+err);
                        $scope.dataError = true;
                    }
                )
                .then(
                    function (positions) {
                        $scope.myPositions = positions;
                        $scope.showMyPositions = Object.keys(positions).length > 0;
                    },
                    function (err) {
                        console.error("UD4:"+err);
                        $scope.dataError = true;
                    }
                )
                .finally(
                    function () {
                        $scope.dataLoaded = true;
                    }
                )
        };
        $timeout($scope.initDash);

        $scope.favoriteUpdate = function (index, posId, locationId, businessId) {
            if (AuthService.currentUserId) {
                var favObj = {
                    userId: AuthService.currentUserId,
                    positionId: posId,
                    locationId: locationId,
                    businessId: businessId,
                    type: 'position'
                };


                FavoritesService.updateFavorite(favObj)
                    .then(
                        function (obj) {
                            if (angular.isDefined(obj._id)) {
                                //// favorite is added

                            }
                            else if (angular.isDefined(obj.deleted)) {
                                //// favorite is deleted
                                $scope.myFavorites.splice(index, 1);
                            }
                        }
                    );/// .then
            }//// if
        }//// fun. favoriteUpdate

        $scope.getApplicationStatus = function (status) {
            return JobApplicationService.statusLabels[status];
        }//// .getApplicationsStatus

        $scope.getFormatedPhone = function (phone) {
            return UserService.formatPhone(phone)
        }//// .getFormatedPhone

        $scope.dayDiff = function (d1, d2) {
            if (isNaN(d2) || !d2) {
                d2 = new Date();
            }
            if (angular.isString(d1)) {
                d1 = new Date(d1);
            }
            if (angular.isString(d2)) {
                d2 = new Date(d2);
            }
            var one_day=1000*60*60*24; // one day in milliseconds
            return Math.round((d2.getTime() - d1.getTime()) / one_day);
        };

        $scope.getDaysUntilReapply = function (application) {
            if (application.status<=0 || !application.appliedAt) {
                return 0;
            }
            var dayDiff = $scope.dayDiff(application.appliedAt);
            var daysUntilReapply = 30 - dayDiff;
            if (daysUntilReapply < 0) {
                daysUntilReapply = 0;
            }
            return daysUntilReapply;
        };
    }
})();
