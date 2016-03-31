/**
 *
 * User main dashboard page controller
 *
 * Iyad Bitar - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('UserDashboardController', ['$scope', '$stateParams', '$state', 'AuthService', UserDashboardController]);


  function UserDashboardController($scope, $stateParams, $state, AuthService) {
    /**
     * Nothing so far
     */
     $scope.isAuth = AuthService.isUserLoggedIn();
     console.log(AuthService.currentUser)
  }
})();
