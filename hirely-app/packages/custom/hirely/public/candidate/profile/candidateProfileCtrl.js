/**
 * Created by labrina.loving on 9/6/2015.
 */
(function () {
    'use strict';

    angular.module('mean.hirely.candidate').controller('CandidateProfileCtrl', ['$scope','$state','$stateParams', 'CandidateService', 'profile', CandidateProfileCtrl ]);


    function CandidateProfileCtrl($scope, $state,$stateParams,CandidateService, profile) {

        var candidateService = CandidateService;

        $scope.profile = profile;


    }
})()
;



