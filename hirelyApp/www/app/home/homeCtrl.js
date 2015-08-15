/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.home').controller('HomeCtrl', ['$scope', '$http', '$firebaseArray', '$location', '$log', '$timeout', '$state', '$stateParams', HomeCtrl ]);

  function HomeCtrl ($scope, $http, $firebaseArray, $location, $log, $timeout, $state, $stateParams) {

        var firebaseUrl= 'https://shining-torch-5144.firebaseio.com/jobs';
        var fireRef = new Firebase(firebaseUrl);
        $scope.selected = undefined;
      
    
      var jobs = fireRef.child("jobs");

      $scope.jobs = $firebaseArray(jobs);

 }
})();