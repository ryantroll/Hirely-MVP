(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .service('UserService', ['$rootScope', '$q', 'FIREBASE_URL', '$firebaseObject', 'fbutil', '$firebaseAuth', UserService]);

  function UserService($rootScope, $q, FIREBASE_URL, $firebaseObject, fbutil, $firebaseAuth, UserService) {
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


      var timestamp = Firebase.ServerValue.TIMESTAMP;

      var firstName = userData.firstName;
      var lastName = userData.lastName;
      var email = userData.email;
      var userType = userData.userType;
      var profileImageUrl = userData.profileImageUrl ? userData.profileImageUrl : '';
      var provider = 'password';
      var createdOn = timestamp;
      var lastModifiedOn = timestamp;
      var personalStatement = userData.personalStatement ? userData.personalStatement : '';
      var address = userData.address ? userData.address : 0;

      var user = new User(firstName, lastName, email, userType,
        profileImageUrl, personalStatement,
        provider, createdOn, lastModifiedOn, address);

        self.createNewUser(user, userID);

      // self.createUserinFirebase(user, providerId);
      // var user = {
      //   'firstName': userData.firstName,
      //   'lastName': userData.lastName,
      //   'email': userData.email,
      //   'userType': userData.userType,
      //   'provider': 'password',
      //   'createdOn': timestamp,
      //   'lastModifiedOn': timestamp
      // };

      // self.saveUserData(user, userID);
      // console.log(user);


      deferred.resolve(user);
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
    this.createNewUser = function(userData, authId, isUpdate) {

      var id = authId;

      var pAddress = userData.address || {};
      var pEducation = userData.education || {};
      var pExperience = userData.experience || {};

      var user = new User(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.userType,
        userData.profileImageUrl,
        userData.personalStatement,
        userData.provider,
        userData.createdOn,
        isUpdate ? Firebase.ServerValue.TIMESTAMP : userData.lastModifiedOn,
        userData.address,
        userData.experience,
        userData.education,
        userData.mobile
      );

      ////define the variable to avoid any udefined error
      var experience, address, education;

      /*****
       *
       * Uncomment When needed.
       *
       * ***/

       if(!angular.isUndefined(userData.address)){
          address = new Address (
            pAddress.formattedAddress,
            pAddress.zipCode,
            pAddress.unit,
            pAddress.number,
            pAddress.street,
            pAddress.city,
            pAddress.state,
            pAddress.country,
            pAddress.lng,
            pAddress.lat
          );
       }

      /*

       education = new Education (
       pEducation.programType,
       pEducation.institutionName,
       pEducation.degree,
       pEducation.city,
       pEducation.state,
       pEducation.startMonth,
       pEducation.startYear,
       pEducation.endMonth,
       pEducation.endYear,
       pEducation.current
       );

       experience = new Experience (
       pExperience.position,
       pExperience.employer,
       pExperience.empolyerPlaceId,
       pExperience.city,
       pExperience.state,
       pExperience.startMonth,
       pExperience.startYear,
       pExperience.endMonth,
       pExperience.endYear,
       pExperience.current,
       pExperience.accomplishments
       );

       */


      ref.child(id).update(user, function (error) {
        if (error)
          //// not successful return error string
          return error;
        else {

          if(!angular.isUndefined(experience)){
            ref.child(id).child('experience').set(experience);
          }
          if(!angular.isUndefined(education)){
            ref.child(id).child('education').set(education);
          }
          if(!angular.isUndefined(address)){
            ref.child(id).child('address').set(address);
          }

          //// operation is successful
          return true;
        }

      });

    };


    this.getUserById = function getUserById(id) {
      var deferred = $q.defer();
      var user = {};

      var url = new Firebase(FIREBASE_URL + "/users/" + id);
      url.on("value", function (snapshot) {
        user = snapshot.val();
        if(null !== user){
          deferred.resolve(user);
        }
        else{
          deferred.reject('User data cannot be retreived');
        }
      }, function (err) {

        deferred.reject(err);
      });

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
