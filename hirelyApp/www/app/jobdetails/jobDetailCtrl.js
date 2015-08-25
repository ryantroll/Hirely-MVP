/**
 * Created by mike.baker on 8/17/2015.
 */

 (function () {
    'use strict';

    angular.module('hirelyApp.jobdetails').controller('JobDetailCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', 'JobdetailsService', JobDetailCtrl ]);

    function JobDetailCtrl ($scope, $state, $stateParams, $firebaseArray, JobdetailsService) {

    	var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
        var fireRef = new Firebase(url);
        var jobdetailsService = JobdetailsService;

        $scope.jobDetails = $firebaseArray(fireRef);
        $scope.jobUID = jobdetailsService.getJob();

        $scope.setJobResults = function(jobUID) {
             jobdetailsService.setJob(jobUID);
            $state.go('app.jobdetails')

        }

        }


})();

 