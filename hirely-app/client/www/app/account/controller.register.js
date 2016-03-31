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
          // Contains at least 8 chars, 1 lowercase, 1 uppercase, and 1 number.
          // All other chars are banned
          var minSatRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[0-9a-zA-Z]{8,}$/;

          // ctrl.$setValidity('invalidPassword', minSatRegex.test(value) && freeFromBannedRegex.test(value));
          ctrl.$setValidity('invalidPassword', minSatRegex.test(value));
          return value;
        });/// unshift
      }//// fun. link
    }/// return object
  })/// validate date;
    .controller('RegisterController', ['$location', '$scope', '$rootScope', '$state', '$stateParams', 'AuthService', 'UserService', RegisterController ]);

    function RegisterController($location, $scope, $rootScope, $state, $stateParams, authService, UserService) {




        $scope.error = '';
        $scope.user = {email: '', password: '', firstName: '', lastName: ''};

        if ($location.search().inv) {
            $scope.user.invitation = $location.search().inv;
            $scope.businessName = $location.search().b;
        }



        $scope.resetEmailValidity = function(){
          $scope.registerForm.email.$setValidity('emailExists', true);
        };

        $scope.handleRgisterForm = function(){
            if(!$scope.registerForm.$valid){
                return null;
            }
            $scope.ajaxBusy = true;
            registerPasswordUser($scope.user);
        };

        $scope.cancelRegistration = function() {
            if(angular.isDefined($rootScope.nextState)){
                $state.go($rootScope.nextState.state, $rootScope.nextState.params);
                delete $rootScope.nextState;
            }
            else{
                $state.go('app.user.profile')
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
                              $state.go('app.home')
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


        }//// fun. registerPasswrodUser


    } // end ctrl



})();
