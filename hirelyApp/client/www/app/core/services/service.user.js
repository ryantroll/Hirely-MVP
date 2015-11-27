(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .service('UserService', ['$rootScope', '$q', 'FIREBASE_URL', '$firebaseObject', 'fbutil', UserService]);

  function UserService($rootScope, $q, FIREBASE_URL, $firebaseObject, fbutil, UserService) {
    var self = this;
    var ref = new Firebase(FIREBASE_URL + "/users");


    this.createUserfromThirdParty = function createUserfromThirdParty(provider, authData) {
      var deferred = $q.defer();
      var user;

      //get proper user for provider
      switch (provider) {
        case 'facebook':
          user = createFacebookUser(authData);
          break;
        case 'google':
          user = createGoogleUser(authData);
          break;
      }

      //check if user previously exists
      this.getUserByKey(authData.uid)
        .then(function (snapshot) {
          var exists = (snapshot.val() != null);
          if (!exists) {
            self.createUserinFirebase(user, authData.uid)

          }
          deferred.resolve(user);
        }, function (err) {
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
      var address = userData.address;

      var user = new User(firstName, lastName, email, userType,
        profileImageUrl, personalStatement,
        provider, createdOn, lastModifiedOn, address);

      self.createUserinFirebase(user, providerId);


      deferred.resolve(user);
      return deferred.promise;

    };


    function createFacebookUser(fbAuthData) {
      var timestamp = Firebase.ServerValue.TIMESTAMP;
      var firstName = fbAuthData.facebook.cachedUserProfile.first_name;
      var lastName = fbAuthData.facebook.cachedUserProfile.last_name;
      var email = fbAuthData.facebook.email;
      var userType = '';
      var profileImageUrl = "http://graph.facebook.com/" + fbAuthData.facebook.id + "/picture?width=300&height=300";
      var provider = fbAuthData.provider;
      var createdOn = timestamp;
      var lastModifiedOn = timestamp;
      var personalStatement = '';
      var address = fbAuthData.facebook.address;

      var user = new User(firstName, lastName, email, userType,
        profileImageUrl, personalStatement,
        provider, createdOn, lastModifiedOn, address);


      return user;

    };

    function createGoogleUser(googleAuthData) {
      var timestamp = Firebase.ServerValue.TIMESTAMP;
      var firstName = googleAuthData.google.cachedUserProfile.given_name;
      var lastName = googleAuthData.google.cachedUserProfile.family_name;
      var email = googleAuthData.google.email;
      var userType = '';
      var profileImageUrl = googleAuthData.google.profileImageURL;
      var provider = fbAuthData.provider;
      var createdOn = timestamp;
      var lastModifiedOn = timestamp;
      var personalStatement = '';
      var address = googleAuthData.google.address;

      var user = new User(firstName, lastName, email, userType,
        profileImageUrl, personalStatement,
        provider, createdOn, lastModifiedOn, address);


      return user;

    };


    this.registerNewUser = function registerNewUser(email, password) {

      var deferred = $q.defer();
      firebaseRef.$createUser({
        email: email,
        password: password
      })
        .then(function (user) {
          deferred.resolve(user);
        }, function (err) {
          deferred.reject(err);
        });


      return deferred.promise;
    };
  }
})();
