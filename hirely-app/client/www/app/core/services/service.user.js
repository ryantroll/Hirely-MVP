(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .service('UserService', ['$rootScope', '$q', 'FIREBASE_URL', '$firebaseObject', 'fbutil', '$firebaseAuth', 'HirelyApiService', UserService]);

  function UserService($rootScope, $q, FIREBASE_URL, $firebaseObject, fbutil, $firebaseAuth, HirelyApiService) {
    var self = this;
    var baseRef = new Firebase(FIREBASE_URL);
    var ref = new Firebase(FIREBASE_URL + "/users");
    var auth = $firebaseAuth(baseRef);


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


    this.createRegisteredNewUser = function createRegisteredNewUser(userData, userID) {

      var deferred = $q.defer();

      var user = new User(userData.firstName, userData.lastName, userData.email, userData.mobile,
        userData.userType, userData.provider,
        userData.country, userData.state, userData.city, userData.street1, userData.street2, userData.street3, userData.postalCode, userData.formattedAddress, userData.lng, userData.lat,
        userData.createdOn, userData.lastModifiedOn);

      self.createNewUser(user, userID)
      .then(
        function(user){
          deferred.resolve(user)
        },
        function(error){
          deferred.reject(error)
        }
      );

      return deferred.promise;
    };

    this.registerNewUser = function registerNewUser(email, password) {

      var deferred = $q.defer();
      auth.$createUser({
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

    /**
     * [createNewUser will create a new user data object in DB]
     * @param  {[object]} userData [Refer to user model in www/app/core/services/models/user.js]
     * @param  {[string]} authId   [user id retreved from DB]
     * @return {[true]}          [true if user is successfully created / String as error desctiption in case of error]
     */
    this.createNewUser = function(userData, authId) {

      var id = authId;


      /**
       * Set add firebase to user object as external ID to do the mapping
       * @type {[type]}
       */
      return HirelyApiService.users().createNew( angular.extend({externalId:authId}, userData) );

    };


    this.getUserById = function getUserById(id) {
      var deferred = $q.defer();
      var user = {};
      /**
       * find out if exteral id
       * firebase user ids contains -
       */

      if(id.indexOf('-') > -1){
        //// firebase id is used set get user from external api
        return HirelyApiService.users(id, 'external').get();
      }
      else{
        return HirelyApiService.users(id).get();
      }

      // var url = new Firebase(FIREBASE_URL + "/users/" + id);
      // url.on("value", function (snapshot) {
      //   user = snapshot.val();
      //   if(null !== user){
      //     deferred.resolve(user);
      //   }
      //   else{
      //     deferred.reject('User data cannot be retreived');
      //   }
      // }, function (err) {

      //   deferred.reject(err);
      // });

      // return deferred.promise;
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
      var address = new Address(fbAuthData.facebook.address);
      var experience = {};
      var education = {};

      var user = new User(firstName, lastName, email, userType,
        profileImageUrl, personalStatement,
        provider, createdOn, lastModifiedOn, address, experience, education);


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
      var address = new Address(googleAuthData.google.address);
      var experience = {};
      var education = {};

      var user = new User(firstName, lastName, email, userType,
        profileImageUrl, personalStatement,
        provider, createdOn, lastModifiedOn, address, experience, education);

      return user;

    };

  }


})();
