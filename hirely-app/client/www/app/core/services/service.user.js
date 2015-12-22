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
      var profileImageUrl = userData.profileImageUrl ? userData.profileImageUrl : 0;
      var provider = 'password';
      var createdOn = timestamp;
      var lastModifiedOn = timestamp;
      var personalStatement = userData.personalStatement ? userData.personalStatement : 0;
      var address = userData.address ? userData.address : 0;

      // var user = new User(firstName, lastName, email, userType,
      //   profileImageUrl, personalStatement,
      //   provider, createdOn, lastModifiedOn, address);

      // self.createUserinFirebase(user, providerId);
      var user = {
        'firstName': userData.firstName,
        'lastName': userData.lastName,
        'email': userData.email,
        'userType': userData.userType,
        'provider': 'password',
        'createdOn': timestamp,
        'lastModifiedOn': timestamp
      };

      self.saveUserData(user, userID);
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


    this.saveUserData = function(userData, userID){
      var deferred = $q.defer();

      ref.child(userID).set(userData, function(error){
        if(error){
          deferred.reject('User object cannot be created');
        }
        else{
          userData.id = userID;
          deferred.resolve(userData);
        }
      });

      return deferred.promise;
    }//// createUserinFirebase

    this.setCurrentUser = function(user, userID){
      console.log(user);
      console.log(userID);
    }

    /**
     *
     * for userData refer to: User model
     *
     * for authId refer to USR_ID
     *
     *
     **/

    this.createNewUser = function createNewUser(userData, authId) {

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
        userData.lastModifiedOn,
        userData.address,
        userData.experience,
        userData.education
      );

      /*****
       *
       * Uncomment When needed.
       *
       * ***/

      /*
       var address = new Address (
       pAddress.formattedAddress,
       pAddress.zipCode,
       pAddress.unit,
       pAddress.street,
       pAddress.city,
       pAddress.state,
       pAddress.lng,
       pAddress.lat
       );


       var education = new Education (
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

       var experience = new Experience (
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
      ref.child(id).set(user, function (error) {
        if (error)
          console.log("error");
        else {
          ref.child(id).child('experience').set(experience);
          ref.child(id).child('education').set(education);
          ref.child(id).child('address').set(address);
          console.log("Success");
        }

      });

    };


    this.getUserById = function getUserById(id) {
      var deferred = $q.defer();
      var user = {};
      var url = new Firebase(FIREBASE_URL + "/users/" + id);
      url.on("value", function (snapshot) {
        user = snapshot.val();
        deferred.resolve(user);
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
