/**
 * Created by labrina.loving on 8/5/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.user').controller('LoginCtrl', ['$stateParams', 'AuthService', LoginCtrl ]);

    function LoginCtrl($stateParams, AuthService) {

        var vm = this;

        vm.FbLogin = function(){
           AuthService.thirdPartyLogin('facebook')
               .then(function(data){

               }
           )
        }




    };
})();