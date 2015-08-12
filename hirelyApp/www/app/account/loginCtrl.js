/**
 * Created by labrina.loving on 8/5/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account').controller('LoginCtrl', ['$scope','$stateParams', 'AuthService', LoginCtrl ]);

    function LoginCtrl($scope, $stateParams, AuthService) {

        var vm = this;
        $scope.error = '';

        vm.FbLogin = function(){
           AuthService.thirdPartyLogin('facebook')
               .then(function(data){


               }, function(err) {

                   $scope.error = errMessage(err);
               }
           );

        }


    }
})()
;