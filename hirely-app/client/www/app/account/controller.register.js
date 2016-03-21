/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.account')
    .directive('validatePassword', function(){
    return {
      restrict:'A',
      require:'ngModel',
      link:function(scope, ele, attrs, ctrl){
        ctrl.$parsers.unshift(function(value){
          var pat = /^.{6,12}$/;

          ctrl.$setValidity('invalidPassword', pat.test(value));
          return value;
        });/// unshift
      }//// fun. link
    }/// return object
  })/// validate date;
    .controller('RegisterController', ['$scope', '$rootScope', '$stateParams', 'AuthService', 'UserService', RegisterController ]);

    function RegisterController($scope, $rootScope, $stateParams, AuthService, UserService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        $scope.error = '';
        $scope.user = {email: '', password: '', firstName: '', lastName: '', userType: 'JS'}


        $scope.showLogin = function(){
          $rootScope.$emit('ShowLogin');
        }

        $scope.resetEmailValidity = function(){
          $scope.registerForm.email.$setValidity('emailExists', true);
        }

        $scope.handleRgisterForm = function(){
            if(!$scope.registerForm.$valid){
                return null;
            }

            $scope.ajaxBusy = true;
            $scope.user.provider = 'password';
            registerPasswordUser($scope.user);
        }

        function registerPasswordUser(registeredUser){
            /**
             * Let the parent scope know it is a new regitered user
             */
            if ($scope.jobApplication != undefined) {
                $scope.jobApplication.isNewUser = true;
            }

            //register new user
            userService.registerNewUser(registeredUser.email, registeredUser.password)
                .then(
                    function(user) {
                      /**
                       * User authentication is created successfully
                       * Create user object in database
                       */
                      return user;
                  },
                  function(err) {
                      /**
                       * User authentication couldn't be created
                       */
                      $scope.registerForm.email.$setValidity('emailExists', false);
                      $scope.ajaxBusy = false;
                  }
                )
                .then(
                  function(user){
                    if(!user) return null;
                    /**
                     * Save users data
                     */
                    userService.createRegisteredNewUser(registeredUser, user.uid)
                    .then(
                      function(newUserData){
                        /**
                         * user data saved log new user in
                         */
                        authService.passwordLogin(registeredUser.email, registeredUser.password)
                        .then(
                          function(auth){

                            console.log(auth);

                          },
                          function(err) {
                            /**
                             * Error in login for new registered user
                             */
                            console.log(err)
                          }
                        )//// then authService
                      },
                      function(err){
                        console.log(err)
                      }
                    )
                  },
                  function(err){
                    console.log(err)
                  }
                )

        }//// fun. registerPasswrodUser
    }

})();
