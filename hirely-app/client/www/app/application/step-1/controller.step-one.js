/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('StepTwoController', ['$scope', '$stateParams', StepOneController]);


  function StepOneController($scope, $stateParams) {

    $scope.validStep = false;

  }
})();