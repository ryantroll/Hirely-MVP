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
            syncCurrentUserFromDb: syncCurrentUserFromDb,
            setCurrentUser: setCurrentUser,
            updateCurrentUserCookie: updateCurrentUserCookie,
            updateCurrentUser: updateCurrentUser,
            isUserLoggedIn: isUserLoggedIn,
            onAuth: onAuth,
            updateCurrentUserPropInCache: updateCurrentUserPropInCache,
            resetPassword: resetPassword
        };
        return service;


        function getCurrentUser() {
            if (service.currentUser) {
                return service.currentUser;
            }

            //// Get currentUser cookie
            var user = $cookies.get("currentUser");
            if (user) {
                user = JSON.parse(user);
                service.currentUser = user;
                service.currentUserID = user._id;
                return user;
            }

            return null;
        }

        function syncCurrentUserFromDb() {
            if (service.isUserLoggedIn()) {
                console.log("User synced from db");
                return userService.getUserById(service.currentUserID, true).then(function (userNew) {
                    setCurrentUser(userNew);
                    return userNew;
                });
            } else {
                var deferred = $q.defer();
                var err = "warning:  syncCurrentUserFromDb failed because no user is logged in";
                deferred.reject(err);
                console.log(err);
                return deferred.promise;
            }
        }

        function passwordLogin(email, password) {
            return userService.passwordLogin(email, password).then(function(user) {
                if (user) {
                    setCurrentUser(user);
                    return user;
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

        function updateCurrentUserCookie() {
            //// Set currentUser cookie
            var userStripped = angular.copy(service.currentUser);
            delete userStripped.personalityExams;
            delete userStripped.scores;
            $cookies.put("currentUser", JSON.stringify(userStripped));
        }

        function setCurrentUser(user){

          //// set the rootScope currentUser
          service.currentUser = user;
          service.currentUserID = user._id;

          //// if any of children scopes need to now whos logged in
          //// let them know
          $rootScope.$emit('UserLoggedIn', user);
          $rootScope.$broadcast('UserLoggedIn', user);

          service.updateCurrentUserCookie();
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
            service.updateCurrentUserCookie();
            $rootScope.$emit('UserDataChange', service.currentUser);
            $rootScope.$broadcast('UserDataChange', service.currentUser);
        }
        
        function isUserLoggedIn() {
            return service.getCurrentUser() != null;
        }//// fun. isUserLoggedIn

        function onAuth(callback){
            callback(service.currentUser);
        }//// fun. onAuth

        function updateCurrentUserPropInCache(propname, prop) {
            service.currentUser[propname] = prop;
            service.updateCurrentUserCookie();
        }

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