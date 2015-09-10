/**
 * Created by labrina.loving on 9/6/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfileAvailabilityCtrl', ['$scope','$state','$stateParams', 'CandidateService', CandidateProfileAvailabilityCtrl ]);


    function CandidateProfileAvailabilityCtrl($scope, $state,$stateParams, CandidateService) {
        var candidateService = CandidateService;
        var schedule ={
            "sunday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "monday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "tuesday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "wednesday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "thursday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "friday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            },
            "saturday": {
                "morning": "false",
                "afternoon": "false",
                "evening": "false"
            }
        }

        $scope.schedule = schedule;

        if($scope.profile && $scope.profile.availability){
            $scope.schedule = $scope.profile.availability;
        }
        $scope.saveSchedule = function() {
            candidateService.saveAvailability($scope.schedule, $scope.user.providerId);
            $state.go('app.candidate.dashboard');
        }


    }
})()
;



