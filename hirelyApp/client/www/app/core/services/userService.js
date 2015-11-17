/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('UserService', ['$rootScope', '$q','FIREBASE_URL', '$firebaseObject', 'fbutil', UserService]);

    function UserService($rootScope, $q, FIREBASE_URL, $firebaseObject, fbutil, UserService) {
        var self = this;
        var ref = new Firebase("/users");
        var currentUser;
        var currentUserId;
        var isLoggedIn = false;

        function userModel(firstName, lastName, email, userType,
                           profileImageUrl, personalStatement,
                           provider, createdOn, lastModifiedOn){

            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.userType = userType;
            this.profileImageUrl = profileImageUrl;
            this.personalStatement = personalStatement;
            this.provider =  provider;
            this.createdOn = createdOn;
            this.lastModifiedOn = lastModifiedOn;
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
            var userRef =  new Firebase(FIREBASE_URL + "/users" + '/' + key);
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


            var timestamp = Firebase.ServerValue.TIMESTAMP;

            var firstName = userData.firstName;
            var lastName = userData.lastName;
            var email = userData.email;
            var userType = userData.userType;
            var profileImageUrl = userData.profileImageUrl;
            var provider = 'password';
            var createdOn = timestamp;
            var lastModifiedOn = timestamp;
            var personalStatement = userData.personalStatement;

            var user = new userModel(firstName, lastName, email, userType,
              profileImageUrl, personalStatement,
              provider, createdOn, lastModifiedOn);

            self.createUserinFirebase(user, providerId);


            deferred.resolve(user);
            return deferred.promise;

        };



        function createFacebookUser(fbAuthData)
        {
            var timestamp = Firebase.ServerValue.TIMESTAMP;
            var firstName = fbAuthData.facebook.cachedUserProfile.first_name;
            var lastName = fbAuthData.facebook.cachedUserProfile.last_name;
            var email = fbAuthData.facebook.email;
            var userType = '';
            var profileImageUrl = "http://graph.facebook.com/" + fbAuthData.facebook.id  + "/picture?width=300&height=300";
            var provider = fbAuthData.provider;
            var createdOn = timestamp;
            var lastModifiedOn = timestamp;
            var personalStatement = '';

            var user = new userModel(firstName, lastName, email, userType,
              profileImageUrl, personalStatement,
              provider, createdOn, lastModifiedOn);


            return user;

        };

        function createGoogleUser(googleAuthData)
        {
            var timestamp = Firebase.ServerValue.TIMESTAMP;
            var firstName = googleAuthData.google.cachedUserProfile.given_name;
            var lastName = googleAuthData.google.cachedUserProfile.family_name;
            var email = googleAuthData.google.email;
            var userType = '';
            var profileImageUrl =  googleAuthData.google.profileImageURL;
            var provider = fbAuthData.provider;
            var createdOn = timestamp;
            var lastModifiedOn = timestamp;
            var personalStatement = '';

            var user = new userModel(firstName, lastName, email, userType,
              profileImageUrl, personalStatement,
              provider, createdOn, lastModifiedOn);


            return user;

        };


        this.registerNewUser = function(email, password) {

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
    }
})();
