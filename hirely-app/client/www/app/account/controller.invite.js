(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('InviteController', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', 'BusinessService', 'AvailabilityService', 'FavoritesService', 'UserService', 'AuthService', InviteController]);

    function InviteController($scope, $rootScope, $state, $stateParams, $timeout, BusinessService, AvailabilityService, FavoritesService, UserServer, AuthService) {

        $scope.business = null;
        $scope.location = null;
        $scope.position = null;

        $scope.create = true;
        $scope.read = true;
        $scope.update = true;
        $scope.delete = true;
        $scope.expiresIn = '7d';

        if ($stateParams.businessSlug) {
            BusinessService.getBySlug($stateParams.businessSlug)
                .then(
                    function (business) {
                        $scope.business = business;
                        $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);
                        $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business);


                        $scope.dataError = false;

                        if ($stateParams.locationSlug && !$scope.business) {
                            $scope.dataError = true;
                        }
                        if ($stateParams.locationSlug && !$scope.location) {
                            $scope.dataError = true;
                        }
                        if ($stateParams.positionSlug && !$scope.position) {
                            $scope.dataError = true;
                        }

                        $scope.dataLoaded = true;

                    }
                );
        } else {
            $scope.dataError = false;
            $scope.dataLoaded = true;
        }
        
        $scope.generate = function() {

            var permObjs = [];

            if ($scope.position) {
                permObjs.push({
                    destType: 'positions',
                    destId: $scope.position._id,
                    c: $scope.create, r: true, u: $scope.update, d: $scope.delete
                });
            } else if ($scope.location) {
                permObjs.push({
                    destType: 'locations',
                    destId: $scope.location._id,
                    c: $scope.create, r: true, u: $scope.update, d: $scope.delete
                });
            } else if ($scope.business) {
                permObjs.push({
                    destType: 'businesses',
                    destId: $scope.business._id,
                    c: $scope.create, r: true, u: $scope.update, d: $scope.delete
                });
            }

            UserServer.createInvitationToken({permObjs: permObjs, expiresIn: $scope.expiresIn}).then(function(token) {
                $scope.token = token;
            })
        }

    }//// fun. InterviewController

})();
