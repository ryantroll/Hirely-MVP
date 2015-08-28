/**
 * Created by labrina.loving on 8/26/2015.
 */
/**
 * Created by labrina.loving on 8/16/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateCtrl', ['$scope','$stateParams', 'UserService', CandidateCtrl ]);


    function CandidateCtrl($scope, $stateParams, UserService) {
        var userService = UserService;
        var vm = this;
        $scope.user = userService.getCurrentUser();


        //listen for changes to current user
        $scope.$on('currentUserChanged', function (event, args) {
            $scope.user = args.message;


        });

        $scope.saveUser = function() {
           userService.saveUser($scope.user)
        }
    }
})()
;

