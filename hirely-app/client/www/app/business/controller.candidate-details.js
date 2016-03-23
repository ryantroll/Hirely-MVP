/**
 *
 * Applicant List Main Controller
 *
 * Iyad Bitar
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('CandidateDetailsController', ['$scope', '$rootScope', '$stateParams', '$state', '$timeout', '$interpolate', '$uibModal', 'DEFAULT_PROFILE_IMAGE', CandidateDetailsController]);


  function CandidateDetailsController($scope, $rootScope, $stateParams, $state, $timeout, $interpolate, $uibModal, DEFAULT_PROFILE_IMAGE) {
    $scope.defaultImage = DEFAULT_PROFILE_IMAGE;

    console.log($scope.applicants)
  }//// controller
})();
