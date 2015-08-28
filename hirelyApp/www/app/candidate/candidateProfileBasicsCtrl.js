/**
 * Created by labrina.loving on 8/28/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfileBasicsCtrl', ['$scope','$state','$stateParams', 'UserService', CandidateProfileBasicsCtrl ]);


    function CandidateProfileBasicsCtrl($scope, $state,$stateParams, UserService) {
        var userService = UserService;
        var vm = this;


        $scope.submitProfile = function() {
            userService.saveUser($scope.user);
            $state.go('app.candidate.profile.experience');
        }
    }
})()
;


