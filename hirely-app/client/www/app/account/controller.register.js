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

        function registerPasswordUser(registeredUser){

            //register new user
            userService.registerNewUser(registeredUser.email, registeredUser.password)
                .then(
                    function(user) {
                      /**
                       * User authentication is created successfully
                       * Create user object in database
                       */
                      console.log(user)
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
                    userService.createRegisteredNewUser(registeredUser, user.uid)
                    .then(
                      function(newUserData){
                        console.log(newUserData)
                        return newUserData;
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


// userService.createRegisteredNewUser(registeredUser, user.uid)
//                         .then(function(newUserData){
//                             /**
//                              * user object created successfully in DB
//                              * Login registered user
//                              */
//                             authService.passwordLogin(registeredUser.email, registeredUser.password)
//                                 .then(function(auth){
//                                     // authService.setCurrentUser(newUserData, user.uid);
//                                     console.log(auth);
//                                 }, function(err) {
//                                     /**
//                                      * Error in login for new registered user
//                                      */
//                                     console.log(err)
//                                 });
//                         }, function(err) {
//                             /**
//                              * user object couldn't be save in DB
//                              * Remove the user from authentication DB
//                              */
//                             userService.removeUser(registeredUser.email, registeredUser.password)
//                             .then(
//                                 function(result){
//                                     if(true === result){

//                                     }

//                                 },
//                                 function(error){
//                                     // console.log('remove error');
//                                     // console.log(error);
//                                 }
//                             );
//                             alert('System Error!\n\n' + err);

//                         });

})();
