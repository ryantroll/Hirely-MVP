/**
 * Created by labrina.loving on 8/8/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('AuthService', ['$q', '$rootScope', '$cookies', 'UserService', 'HirelyApiService', AuthService]);

    function AuthService($q, $rootScope, $cookies, userService, hirelyApiService) {

        var service = {
            refreshSession: refreshSession,
            passwordLogin: passwordLogin,
            registerNewUser: registerNewUser,
            logout: logout
        };
        return service;

        function refreshSession() {
            var token = $cookies.get("token");
            if (token && token != '') {
                token = JSON.parse(token);
                $rootScope.token = token;

                return hirelyApiService.auth().get().then(function (userAndToken) {
                    if (userAndToken) {
                        $cookies.put("token", JSON.stringify(userAndToken.token));
                        $rootScope.token = userAndToken.token;
                        $rootScope.currentUser = userAndToken.user;
                        $rootScope.currentUserId = userAndToken.user._id;

                        $rootScope.$emit('UserLoggedIn', userAndToken.user);
                        $rootScope.$broadcast('UserLoggedIn', userAndToken.user);
                        console.log("Session has been refreshed");
                        return true;
                    }
                    return null;
                });
            };
            return $q.resolve(null);
        }

        function passwordLogin(email, password) {
            return hirelyApiService.auth().post({email: email, password: password}).then(function(userAndToken) {
                if (userAndToken) {
                    $cookies.put("token", JSON.stringify(userAndToken.token));
                    $rootScope.token = userAndToken.token;
                    $rootScope.currentUser = userAndToken.user;
                    $rootScope.currentUserId = userAndToken.user._id;

                    $rootScope.$emit('UserLoggedIn', userAndToken.user);
                    $rootScope.$broadcast('UserLoggedIn', userAndToken.user);
                    return userAndToken.user;
                }
                return null;
            });
        }

        function registerNewUser(userData) {
            return userService.createNewUser(userData).then(function (userAndToken) {
                if (userAndToken) {
                    $cookies.put("token", JSON.stringify(userAndToken.token));
                    $rootScope.token = userAndToken.token;
                    $rootScope.currentUser = userAndToken.user;
                    $rootScope.currentUserId = userAndToken.user._id;

                    $rootScope.$emit('UserLoggedIn', userAndToken.user);
                    $rootScope.$broadcast('UserLoggedIn', userAndToken.user);
                    return userAndToken.user;
                }
            });
        }


        function logout() {
            console.log("Logging out");
            $rootScope.currentUser = null;
            $rootScope.currentUserId = null;
            $cookies.remove("token");
            $rootScope.token = null;
            $rootScope.$emit('UserLoggedOut');
            $rootScope.$broadcast('UserLoggedOut');
            $rootScope.$apply();
        }
    }
})();