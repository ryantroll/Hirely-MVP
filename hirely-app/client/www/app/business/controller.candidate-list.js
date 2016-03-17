/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('CandidateListController', ['$scope', '$stateParams', '$state', 'DEFAULT_PROFILE_IMAGE', CandidateListController]);


  function CandidateListController($scope, $stateParams, $state, DEFAULT_PROFILE_IMAGE) {
    $scope.defaultImage = DEFAULT_PROFILE_IMAGE;
  }
})();
