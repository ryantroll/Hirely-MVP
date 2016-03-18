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


    /**
     * [createRegisteredNewUser will create user model data based on data sent from registration form
     * and send the user model object to createUser function to save in DB
     * This function usually called after registerNewUser is successfully add a user to Auth DB and returned it's ID]
     * @param  {object} userData [data of user to be created in DB]
     * @param  {string} userID   [the auth id of user returned by registerNewUser function]
     * @return {promise}          [the resolve will return the new suser object created in DB]
     */
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

    /**
     * [registerNewUser will add a new user in auth DB ]
     * @param  {string} email    [email of user to be added]
     * @param  {string} password [password of user to be added]
     * @return {promise}          [a promsie, reslove function will return an object of new created user in auth DB ]
     */
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

      return HirelyApiService.users().post( angular.extend({externalId:authId}, userData) );

    };


    /**
     * [getUserById will get a user object from DB by suppling user id for local DB or user id for exteranl DB like firebase id]
     * @param  {string} id [id of user this id can b]
     * @return {promise}    [description]
     */
    this.getUserById = function getUserById(id) {
      var deferred = $q.defer();
      var user = {};

      /**
       * find out if exteral id
       * firebase user ids contains -
       * e.g. firebase 93306b91-d5ba-4e06-838c-0ab85fd58783
       * e.g. mongoDB 568fde202127fa312543f50f
       */
      if(id.indexOf('-') > -1 && id.length > 30){
        //// firebase id is used set get user from external api
        return HirelyApiService.users(id, 'external').get();
      }
      else{
        return HirelyApiService.users(id).get();
      }
    };

    /**
     * [getUserCompleteFields will return user complete fields ]
     * @param  {string} id     [id of user ]
     * @param  {array of string} fields [list of fields to be retreived]
     * @return {promise}        [description]
     */
    this.getUserCompleteFields = function getUserById(id, fields) {
      var deferred = $q.defer();
      var user = {};

      return HirelyApiService.users(id, fields).get();
    };

    /**
     * [removeAuthUser will remove user from auth database]
     * @param  {string} email    [email of user to be removed]
     * @param  {string} password [password of user to be removed]
     * @return {promise}          [description]
     */
    this.removeAuthUser = function(email, password){
      var deferred = $q.defer();
      auth.$removeUser({
        password: password,
        email: email

      })
      .then(
        function (user) {
          deferred.resolve(true);
        },
        function (err) {
          console.log('error removing');
          console.log(err);
          deferred.reject(err);
        }
      );

      return deferred.promise;
    }//// fun. removeUser

    /**
     * [saveUser will update a user information by callin api]
     * @param  {object} userData [hold the fields of user object to be updated]
     * @param  {string} userId   [id of user to be updated]
     * @return {promiss}          [description]
     */
    this.saveUser = function(userData, userId){
      var deferred = $q.defer();
      HirelyApiService.users(userId).patch( userData )
      .then(
        function(newData){
          deferred.resolve(newData);
        },
        function(err){
          deferred.reject(err);
        }
      );
      return deferred.promise;
    }//// fun. saveUser

    /**
     * [updateUserMetricsById will update a users ksaw scores based on experience]
     * @param  {string} userId   [id of user to be updated]
     * @return {promiss}          [description]
     */
    this.updateUserMetricsById = function(userId){
      var deferred = $q.defer();
      HirelyApiService.users(userId, "updateUserMetricsById").post()
          .then(
              function(newData){
                deferred.resolve(newData);
              },
              function(err){
                deferred.reject(err);
              }
          );
      return deferred.promise;
    }//// fun. updateUserMetricsById

    this.clearPhoneFormat = function(val){
      return val.split(/[\(|\)| |\-|\+|\.]/).join('');
    }

    this.formatPhone = function(val){
      var rawValue = this.clearPhoneFormat(val);
      var formated = '';
      if(rawValue.length > 3){
        formated += '(' + rawValue.slice(0,3) + ') ';
        rawValue = rawValue.slice(3);
      }
      if(rawValue.length > 3){
        formated += rawValue.slice(0,3) + '-';
        rawValue = rawValue.slice(3);
      }
      formated += rawValue;

      return formated;
    }//// fun. formatPhone

    this.formatDate = function(val){
      var ret = '';
      val = new Date(val);

      var m = val.getMonth()+1;
      var d = val.getDate();
      var y = val.getFullYear();

      ret += (m<10 ? '0' : '') + m + '/';
      ret += (d<10 ? '0' : '') + d + '/';
      ret += y;

      return ret;
    }




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
