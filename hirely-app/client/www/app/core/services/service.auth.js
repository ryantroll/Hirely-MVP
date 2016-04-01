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

        var service = {
            passwordLogin: passwordLogin,
            registerNewUser: registerNewUser,
            logout: logout,
            currentUser: currentUser,
            currentUserID: currentUserID,
            getCurrentUser: getCurrentUser,
            syncCurrentUserFromDb: syncCurrentUserFromDb,
            setCurrentUser: setCurrentUser,
            setTokenCookie: setTokenCookie,
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
                console.log("getCurrentUser: found user in cache");
                return service.currentUser;
            }

            //// Get currentUser cookie
            var user = $cookies.get("currentUser");
            var token = $cookies.get("token");
            if (token) {
                setTokenCookie(token);
            }
            if (user) {
                console.log("getCurrentUser: found user in cookie");
                user = JSON.parse(user);
                setCurrentUser(user);
                return user;
            }

            console.log("getCurrentUser: did not find any user");
            return null;
        }

        function syncCurrentUserFromDb() {
            console.log("syncCurrentUserFromDb");
            if (service.isUserLoggedIn()) {
                console.log("syncCurrentUserFromDb: Syncing user from db: " + service.currentUser.email);
                return userService.getUserById(service.currentUserID, true).then(function (userNew) {
                    console.log("syncCurrentUserFromDb: User synced from db: " + userNew.email);
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
            return userService.passwordLogin(email, password).then(function (userAndToken) {
                if (userAndToken) {
                    setCurrentUser(userAndToken.user);
                    setTokenCookie(userAndToken.token);
                    return userAndToken.user;
                }
            });
        }

        function registerNewUser(userData) {
            return userService.createNewUser(userData).then(function (userAndToken) {
                if (userAndToken) {
                    setCurrentUser(userAndToken.user);
                    setTokenCookie(userAndToken.token);
                    return userAndToken.user;
                }
            });
        }


        function logout() {
            removeCurrentUser();
        }

        function updateCurrentUserCookie() {
            //// Set currentUser cookie
            var userStripped = angular.copy(service.currentUser);
            delete userStripped.personalityExams;
            delete userStripped.scores;
            $cookies.put("currentUser", JSON.stringify(userStripped));
        }

        function setCurrentUser(user) {

            //// set the rootScope currentUser
            service.currentUser = user;
            service.currentUserID = user._id;

            //// if any of children scopes need to now whos logged in
            //// let them know
            $rootScope.$emit('UserLoggedIn', user);
            $rootScope.$broadcast('UserLoggedIn', user);

            service.updateCurrentUserCookie();
        }

        function setTokenCookie(token) {
            service.token = token;
            $cookies.put("token", token);
            $rootScope.token = token;
        }

        function removeCurrentUser() {
            service.currentUser = undefined;
            service.currentUserID = undefined;

            //// Set currentUser cookie
            $cookies.remove("currentUser");
            $cookies.remove("token");

            /// let all scopes the user is logged out
            $rootScope.$emit('UserLoggedOut');
            $rootScope.$broadcast('UserLoggedOut');
            $rootScope.token = null;
        }

        /**
         * [updateCurrentUser will update the currentUser object without triggering login events UserDataChange event is emited instead
         * Mainly this function will be user in uder profile update to make sure data in front ent is matching db]
         * @param  {object} user [User object se user Model]
         * @return {nothing}      [no return value]
         */
        function updateCurrentUser(user) {
            service.currentUser = user;
            service.updateCurrentUserCookie();
            $rootScope.$emit('UserDataChange', service.currentUser);
            $rootScope.$broadcast('UserDataChange', service.currentUser);
        }

        function isUserLoggedIn() {
            return service.getCurrentUser() != null;
        }//// fun. isUserLoggedIn

        function onAuth(callback) {
            callback(service.currentUser);
        }//// fun. onAuth

        function updateCurrentUserPropInCache(propname, prop) {
            service.currentUser[propname] = prop;
            service.updateCurrentUserCookie();
        }

        function resetPassword(email) {
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