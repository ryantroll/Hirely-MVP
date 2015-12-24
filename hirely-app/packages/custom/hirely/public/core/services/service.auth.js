/**
 * Created by labrina.loving on 8/8/2015.
 */
(function () {
    'use strict';

    angular.module('mean.hirely.core')
        .factory('AuthService', ['$firebaseAuth', 'fbutil', '$q', AuthService]);

    function AuthService($firebaseAuth, fbutil, $q) {
        var self = this;
        var firebaseRef = $firebaseAuth(fbutil.ref());
        var authData = '';
        var service =  {
            thirdPartyLogin: thirdPartyLogin,
            AuthRef: AuthRef,
            passwordLogin: passwordLogin,
            logout: logout
        };
        return service;

        // Handle third party login providers
        // returns a promise
        function thirdPartyLogin(provider) {

            var deferred = $q.defer();
            firebaseRef.$authWithOAuthPopup(provider)
                .then(function(user) {
                   deferred.resolve(user);
                }, function(err) {
                    if (err.code === "TRANSPORT_UNAVAILABLE") {
                        // fall-back to browser redirects, and pick up the session
                        // automatically when we come back to the origin page
                        ref.authWithOAuthRedirect.then(function(user) {
                            deferred.resolve(user);
                        }, function(err) {
                            deferred.reject(err);
                            });
                    }
                });


          return deferred.promise;
        };

        function passwordLogin(email, password) {

            var deferred = $q.defer();
            firebaseRef.$authWithPassword({
                email    : email,
                password : password
                })
                .then(function(user) {
                    deferred.resolve(user);
                }, function(err) {
                    deferred.reject(err);
                });


            return deferred.promise;
        };

        function AuthRef(){
            return firebaseRef;
        }

        function logout(){
            firebaseRef.$unauth();
        }



        function AuthRef(){
            return firebaseRef;
        }




    }
})();