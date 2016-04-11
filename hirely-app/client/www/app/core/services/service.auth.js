/**
 * Created by labrina.loving on 8/8/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('AuthService', ['$q', '$rootScope', '$cookies', 'UserService', 'HirelyApiService', AuthService]);

    function AuthService($q, $rootScope, $cookies, UserService, HirelyApiService) {
        var service = {
            token: {jwt:null, exp:0, remainingTime:0},
            currentUser: null,
            currentUserId: null,
            setToken: setToken,
            refreshSession: refreshSession,
            passwordLogin: passwordLogin,
            registerNewUser: registerNewUser,
            logout: logout,
            updateTokenRemainingTime: updateTokenRemainingTime
        };

        return service;

        function setToken(tokenAndExp) {
            $cookies.put("token", JSON.stringify(tokenAndExp));
            service.token = {jwt:tokenAndExp.jwt, exp:tokenAndExp.exp, remainingTime:9999};
            service.updateTokenRemainingTime();
        }

        function refreshSession() {
            if (!service.token.jwt) {
                var tokenCookie = $cookies.get("token");
                if (tokenCookie && tokenCookie != '') {
                    service.setToken(JSON.parse(tokenCookie));
                }
            }
            if (service.token.jwt) {
                return HirelyApiService.auth().get().then(function (userAndToken) {
                    if (userAndToken) {
                        service.setToken(userAndToken.token);
                        service.currentUser = userAndToken.user;
                        service.currentUserId = userAndToken.user._id;
                        console.log("AS:SessionRefresh:info: Token Refreshed");
                        $rootScope.$emit('SessionRefreshed');
                        $rootScope.$broadcast('SessionRefreshed');
                        return true;
                    }
                    console.error("AS:SessionRefresh:error: Token refresh failed");
                    $rootScope.$emit('SessionRefreshed');
                    $rootScope.$broadcast('SessionRefreshed');
                    return null;
                });
            } else {
                console.log("AS:SessionRefresh:info: No token to refresh");
                $rootScope.$emit('SessionRefreshed');
                $rootScope.$broadcast('SessionRefreshed');
                return $q.resolve(null);
            }
        }

        function passwordLogin(email, password) {
            return HirelyApiService.auth().post({email: email, password: password}).then(function(userAndToken) {
                if (userAndToken) {
                    service.setToken(userAndToken.token);
                    service.currentUser = userAndToken.user;
                    service.currentUserId = userAndToken.user._id;
                    $rootScope.$emit('UserLoggedIn', userAndToken.user);
                    $rootScope.$broadcast('UserLoggedIn', userAndToken.user);
                    return userAndToken.user;
                }
                return null;
            });
        }

        function registerNewUser(userData) {
            return UserService.createNewUser(userData).then(function (userAndToken) {
                if (userAndToken) {
                    service.setToken(userAndToken.token);
                    service.currentUser = userAndToken.user;
                    service.currentUserId = userAndToken.user._id;
                    $rootScope.$emit('UserLoggedIn', userAndToken.user);
                    $rootScope.$broadcast('UserLoggedIn', userAndToken.user);
                    $rootScope.$emit('UserRegistered', userAndToken.user);
                    $rootScope.$broadcast('UserRegistered', userAndToken.user);
                    return userAndToken.user;
                }
            });
        }


        function logout() {
            console.log("Logging out");
            service.currentUser = null;
            service.currentUserId = null;
            service.setToken({jwt:null, exp:0});
            $cookies.remove("token");
            $rootScope.$emit('UserLoggedOut');
            $rootScope.$broadcast('UserLoggedOut');
        }

        function updateTokenRemainingTime() {
            service.token.remainingTime = Number(service.token.exp) - Math.ceil(Date.now()/1000) - 5;
            if (service.token.remainingTime < 0) {
                service.token.remainingTime = 0;
            }
            $rootScope.$emit('RemainingTimeUpdate', {tokenRemainingTime: service.token.remainingTime});
            $rootScope.$broadcast('RemainingTimeUpdate', {tokenRemainingTime: service.token.remainingTime});
            if(service.token.remainingTime<=0 && service.token.jwt) {
                service.logout();
            }
        }
    }

})();