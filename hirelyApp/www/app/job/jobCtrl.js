/**
 * Created by mike.baker on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.job').controller('JobCtrl', ['$scope', '$firebaseArray', JobCtrl ]);

      function JobCtrl($scope, $firebaseArray) {

        var url = 'https://shining-torch-5144.firebaseio.com/jobOpenings';
        var fireRef = new Firebase(url);
        

        $scope.jobOpenings = $firebaseArray(fireRef);

		$scope.split_jobs = [['job1', 'job2']];
		
     
 }
})();
