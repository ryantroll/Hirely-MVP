/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('UserService', ['$rootScope', '$q','FBURL', '$firebaseObject', 'fbutil', UserService]);

    function UserService($rootScope, $q, FBURL, $firebaseObject, fbutil, UserService) {
        var self = this;
        var ref = new Firebase(FBURL + "/users");
        var currentUser;
        var currentUserId;
        var isLoggedIn = false;

        function userModel(){
            this.firstName = '';
            this.lastName = '';
            this.fullName = '';
            this.email = '';
            this.userType = '';
            this.profileImageUrl = '';
            this.personalStatement = '';
            this.location = '';
            this.provider =  '';
            this.providerId = '';
            this.createdOn = '';
            this.lastModifiedOn = '';
            this.userId = '';
           }


        this.getCurrentUser = function getCurrentUser() {
           return currentUser;
        };

        this.getIsLoggedIn =  function getIsLoggedIn(){
            return isLoggedIn;
        };

        this.setCurrentUser = function setCurrentUser(user, userId){
            currentUser = user;
            currentUser.userId = userId;
            currentUserId = userId;
        };

        this.setIsLoggedIn = function setIsLoggedIn(aisLoggedIn){
            isLoggedIn = aisLoggedIn;
            if(!isLoggedIn){
                currentUser = '';
                currentUserId = '';
            }

        };

        this.getUserByKey = function getUserByKey(key){
            var userRef =  new Firebase(FBURL + "/users" + '/' + key);
            var deferred = $q.defer();
            userRef.once("value", function (snapshot) {
                    deferred.resolve(snapshot);

                }, function (err) {
                    deferred.reject(snapshot);
                }
            );
            return deferred.promise;
        };


        this.getUserByEmail = function getUserByEmail(email) {

            var deferred = $q.defer();
            ref.orderByChild("email").equalTo(email).once("value", function (snapshot) {
                    deferred.resolve(snapshot);

                }, function (err) {
                    deferred.reject(snapshot);
                }
            );
            return deferred.promise;
        };

        this.createUserinFirebase = function createUserInFireBase(user, key) {

            var ref = fbutil.ref('users', key);
            ref.set(user)
        }

        this.saveUser = function saveUser(user){
            var ref = new Firebase(FBURL + "/users/" + currentUserId);
            ref.update(user);
            currentUser = user;
        }

        this.createUserfromThirdParty = function createUserfromThirdParty(provider, authData) {
            var deferred = $q.defer();
            var user;

            //get proper user for provider
            switch(provider) {
                case 'facebook':
                    user = createFacebookUser(authData);
                    break;
                case 'twitter':

                    break;
                case 'google':
                    user = createGoogleUser(authData);
            }

            //check if user previously exists
            var userExists = false;
            this.getUserByKey(authData.uid)
                .then(function(snapshot) {
                    var exists = (snapshot.val() != null);
                    if(!exists)
                    {
                        self.createUserinFirebase(user, authData.uid)

                    }
                    deferred.resolve(user);
                }, function(err) {
                    deferred.reject(err);
                });

            return deferred.promise;

        };



        this.createRegisteredNewUser = function createRegisteredNewUser(userData, providerId) {

            var deferred = $q.defer();
            var user;

            var timestamp = Firebase.ServerValue.TIMESTAMP;
            user = new userModel();
            user.fullName = userData.firstName + ' ' + userData.lastName;
            user.firstName = userData.firstName;
            user.lastName = userData.lastName;
            user.email = userData.email;
            user.userType = userData.userType;
            user.provider = 'password';
            user.providerId = providerId;
            user.createdOn = timestamp;
            user.lastModifiedOn = timestamp;
            user.userId = providerId;
            self.createUserinFirebase(user, providerId)


            deferred.resolve(user);
            return deferred.promise;

        };



        function createFacebookUser(fbAuthData)
        {
            var timestamp = Firebase.ServerValue.TIMESTAMP;
            var fbUser = new userModel();
            fbUser.fullName = fbAuthData.facebook.displayName;
            fbUser.profileImageUrl =  "http://graph.facebook.com/" + fbAuthData.facebook.id  + "/picture?width=300&height=300";
            fbUser.email = fbAuthData.facebook.email;
            fbUser.provider = fbAuthData.provider;
            fbUser.providerId = fbAuthData.uid;
            fbUser.createdOn = timestamp;
            fbUser.lastModifiedOn = timestamp;

            return fbUser;

        };

        function createGoogleUser(googleAuthData)
        {
            var timestamp = Firebase.ServerValue.TIMESTAMP;
            var fbUser = new userModel();

            fbUser.fullName = googleAuthData.google.displayName;
            fbUser.firstName = googleAuthData.google.cachedUserProfile.given_name;
            fbUser.lastName = googleAuthData.google.cachedUserProfile.family_name;
            fbUser.profileImageUrl =  googleAuthData.google.profileImageURL;
            fbUser.email = googleAuthData.google.email ? googleAuthData.google.email: '';
            fbUser.provider = googleAuthData.provider;
            fbUser.providerId = googleAuthData.auth.uid;
            fbUser.createdOn = timestamp;
            fbUser.lastModifiedOn = timestamp;

            return fbUser;

        };
    }
})();
