/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.job').controller('JobSearchCtrl', ['$scope', '$http', '$location', '$log', '$timeout', '$state', '$stateParams', JobSearchCtrl ]);


  function JobSearchCtrl($scope, $http, $location, $log, $timeout, $state, $stateParams) {

  $scope.selected = undefined;
    $scope.jobs = [];
}
    
 })();
