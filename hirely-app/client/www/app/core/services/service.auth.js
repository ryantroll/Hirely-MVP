/**
 * Created by labrina.loving on 8/8/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('AuthService', ['$firebaseAuth', 'fbutil', '$q', '$rootScope', 'UserService', AuthService]);

    function AuthService($firebaseAuth, fbutil, $q, $rootScope, UserService) {
        var self = this;
        var firebaseRef = $firebaseAuth(fbutil.ref());
        var authData = '';
        var currentUser;
        var currentUserID;

        var service =  {
            thirdPartyLogin: thirdPartyLogin,
            AuthRef: AuthRef,
            passwordLogin: passwordLogin,
            logout: logout,
            currentUser: currentUser,
            currentUserID: currentUserID,
            setCurrentUser: setCurrentUser,
            updateCurrentUser: updateCurrentUser,
            getAuth: getAuth,
            isUserLoggedIn: isUserLoggedIn,
            onAuth: onAuth,
            resetPassword: resetPassword
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
                .then(function(auth) {
                    fillUserData(auth.uid)
                    .then(
                        function(user){
                            setCurrentUser(user, user._id);
                            deferred.resolve(auth);
                        },
                        function(error){
                            deferred.reject(error);
                        }
                    )/// then

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
            removeCurrentUser();
        }

        function setCurrentUser(user, userID){
          /// add the id to user object
          var newUser = angular.extend({}, user);

          //// set the rootScope currentUser
          service.currentUser = newUser;
          service.currentUserID = userID;

          //// if any of children scopes need to now whos logged in
          //// let them know
          $rootScope.$emit('UserLoggedIn', newUser);
          $rootScope.$broadcast('UserLoggedIn', newUser);
        }

        function removeCurrentUser(){
          service.currentUser = undefined;
          service.currentUserID = undefined;

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

            $rootScope.$emit('UserDataChange', service.currentUser);
            $rootScope.$broadcast('UserDataChange', service.currentUser);
        }
        /**
         * [getAuth this function will determin if there is authenticated user by sending true to promise resolve function
         * If the user is authenticated and there is no user data object in service the function will try to fill current user object
         * if the authenticated user is there but data cannot be retrived then user will be forced to log-off]
         * @return {promise} [description]
         */
        function getAuth(){

            var deferred = $q.defer();

            var auth = firebaseRef.$getAuth();

            if(auth){
                //// user is authenticated

                //// fill current user if not exists
                if(angular.isUndefined(service.currentUser)){
                    fillUserData(auth.uid)
                        .then(
                            function(user){
                                if(null !== user){
                                    setCurrentUser(user, user._id);
                                    deferred.resolve(true);
                                }
                                else{
                                    logout();
                                    deferred.resolve('User data cannot be retrived');
                                }
                            },
                            function(error){

                                deferred.reject(error);
                            }
                        )/// then
                }
                else{
                    //// current user exists
                    deferred.resolve(true);
                }
            }
            else{
                //// no authenticated user make sure there is not user id
                removeCurrentUser();
                deferred.reject('User is not authenticated');
            }
            return deferred.promise;
        }/// fun. getAuth

        function fillUserData(userID){
            var deferred = $q.defer();

            UserService.getUserById(userID)
                .then(
                    function(user){
                        deferred.resolve(user);
                    },
                    function(error){
                        deferred.reject(error);
                    }
                )/// .then
            return deferred.promise;
        }//// fun.. fillUserData

        function isUserLoggedIn(){
            return !angular.isUndefined(service.currentUser)
                && !angular.isUndefined(service.currentUserID);
        }//// fun. isUserLoggedIn

        function onAuth(callBack){
            firebaseRef.$onAuth(callBack);
        }//// fun. onAuth

        function resetPassword(email){
            var deferred = $q.defer();

            firebaseRef.$resetPassword({'email':email})
                .then(function(){
                    deferred.resolve();
                })
                .catch(function(error){
                    deferred.reject(error);
                });


            return deferred.promise;
        }//// fun. resetPasswrod

    }
})();