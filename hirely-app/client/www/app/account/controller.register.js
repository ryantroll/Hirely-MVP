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
    .controller('RegisterController', ['$scope', '$rootScope', '$state', '$stateParams', 'AuthService', 'UserService', RegisterController ]);

    function RegisterController($scope, $rootScope, $state, $stateParams, AuthService, UserService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        $scope.error = '';
        $scope.user = {email: '', password: '', firstName: '', lastName: ''}


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
            registerPasswordUser($scope.user);
        }

        $scope.cancelRegistration = function() {
            console.log("IN cancel");
            if(angular.isDefined($rootScope.nextState)){
                console.log("1");
                $state.go($rootScope.nextState.state, $rootScope.nextState.params);
                delete $rootScope.nextState;
            }
            else{
                console.log("2");
                $state.go('user.profile')
            }
        }

        function registerPasswordUser(registeredUser){
            /**
             * Let the parent scope know it is a new regitered user
             */

            // $scope.jobApplication.isNewUser = true;


            //register new user
            authService.registerNewUser(registeredUser)
                .then(
                    function(user) {
                      if (user) {
                          $scope.registerForm.email.$setValidity('emailExists', true);
                          /**
                           * Check if nextState is set in rootScope and redirect user to it
                           */
                          if(angular.isDefined($rootScope.nextState)){
                              $state.go($rootScope.nextState.state, $rootScope.nextState.params);
                              delete $rootScope.nextState;
                          }
                          else{
                              $state.go('user.profile')
                          }
                      } else {
                          $scope.registerForm.email.$setValidity('emailExists', false);
                      }



                        $scope.ajaxBusy = false;
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
                            $state.go('app.home');
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

                      alert("A user is already registered with that email address.");
                  }
                )


        }//// fun. registerPasswrodUser


    } // end ctrl



})();
