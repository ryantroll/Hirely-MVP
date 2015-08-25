/**
 * Created by mike.baker on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.jobdetails').controller('JobCtrl', ['$scope', '$state', '$stateParams', '$firebaseArray', '$http', 'GeocodeService', 'JobdetailsService', JobCtrl ]);

      function JobCtrl($scope, $state, $stateParams, $firebaseArray, $http, GeocodeService, JobdetailsService) {
           
        var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
        var fireRef = new Firebase(url);

        var geocodeService = GeocodeService;
        var jobdetailsService = JobdetailsService;
   

        $scope.jobOpenings = $firebaseArray(fireRef);
		$scope.split_jobs = [['job1', 'job2', 'job3'], ['job5', 'job6', 'job7']];

        $scope.details = geocodeService.getPlace();
        $scope.jobdetails = $scope.jobOpenings;
      

        $scope.setJobResults = function(jobUID) {
             jobdetailsService.setJob(jobUID);
            $state.go('app.jobdetails')

        }

      
 }


})();
