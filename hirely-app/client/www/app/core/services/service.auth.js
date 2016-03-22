/**
 * Created by labrina.loving on 8/8/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('AuthService', ['$q', '$rootScope', '$cookies', 'UserService', AuthService]);

    function AuthService($q, $rootScope, $cookies, userService) {
        var self = this;
        var authData = '';
        var currentUser;
        var currentUserID;

        var service =  {
            passwordLogin: passwordLogin,
            registerNewUser: registerNewUser,
            logout: logout,
            currentUser: currentUser,
            currentUserID: currentUserID,
            getCurrentUser: getCurrentUser,
            setCurrentUser: setCurrentUser,
            updateCurrentUser: updateCurrentUser,
            isUserLoggedIn: isUserLoggedIn,
            onAuth: onAuth,
            resetPassword: resetPassword
        };
        return service;

        function getCurrentUser() {
            if (service.currentUser) {
                return service.currentUser;
            }

            //// Set currentUser cookie
            var user = $cookies.get("currentUser");
            if (user) {
                user = JSON.parse(user);
                service.currentUser = user;
                service.currentUserID = user._id;
                return user;
            }

            return null;
        }

        function passwordLogin(email, password) {
            return userService.passwordLogin(email, password).then(function(user) {
                if (user) {
                    setCurrentUser(user);
                    return user;
                } else {

                }
            });
        }

        function registerNewUser(userData) {
            return userService.createNewUser(userData).then(function(user) {
                if (user) {
                    setCurrentUser(user);
                    return user;
                }
            });
        }


        function logout(){
            removeCurrentUser();
        }

        function setCurrentUser(user){

          //// set the rootScope currentUser
          service.currentUser = user;
          service.currentUserID = user._id;

          //// Set currentUser cookie
          $cookies.put("currentUser", JSON.stringify(user));

          //// if any of children scopes need to now whos logged in
          //// let them know
          $rootScope.$emit('UserLoggedIn', user);
          $rootScope.$broadcast('UserLoggedIn', user);
        }

        function removeCurrentUser(){
          service.currentUser = undefined;
          service.currentUserID = undefined;

          //// Set currentUser cookie
          $cookies.remove("currentUser");

          /// let all scopes the user is logged out
          $rootScope.$emit('UserLoggedOut');
          $rootScope.$broadcast('UserLoggedOut');
        }

        /**
         * [updateCurrentUser will update the currentUser object without triggering login events UserDataChange event is emited instead
         * Mainly this function will be user in uder profile update to make sure data in front ent is matching db]
         * @param  {object} user [User object se user Model]
         * @return {nothing}      [no return value]
         */
        function updateCurrentUser(user){
            service.currentUser = user;

            $cookies.put("currentUser", JSON.stringify(user));

            $rootScope.$emit('UserDataChange', service.currentUser);
            $rootScope.$broadcast('UserDataChange', service.currentUser);
        }
        
        function isUserLoggedIn() {
            return service.getCurrentUser() != null;
        }//// fun. isUserLoggedIn

        function onAuth(callback){
            callback(service.currentUser);
        }//// fun. onAuth

        function resetPassword(email){
            var deferred = $q.defer();

            // firebaseRef.$resetPassword({'email':email})
            //     .then(function(){
            //         deferred.resolve();
            //     })
            //     .catch(function(error){
            //         deferred.reject(error);
            //     });


            return deferred.promise;
        }//// fun. resetPasswrod

    }
})();