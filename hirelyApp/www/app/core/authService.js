/**
 * Created by labrina.loving on 8/8/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('AuthService', ['$firebaseAuth', 'fbutil', '$q', AuthService]);

    function AuthService($firebaseAuth, fbutil, $q) {
        var self = this;
        var firebaseRef = $firebaseAuth(fbutil.ref());
        var authData = '';
        var service =  {
            thirdPartyLogin: thirdPartyLogin,
            AuthRef: AuthRef,
            registerNewUser: registerNewUser,
            passwordLogin: passwordLogin
        };
        return service;

        // Handle third party login providers
        // returns a promise
        function thirdPartyLogin(provider) {

            var deferred = $q.defer();
            firebaseRef.$authWithOAuthPopup(provider,{scope: "email"})
                .then(function(user) {
                   deferred.resolve(user);
                }, function(err) {
                  deferred.reject(err);
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

        function registerNewUser(email, password) {

            var deferred = $q.defer();
            firebaseRef.$createUser({
                    email: email,
                    password : password})
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




    }
})();