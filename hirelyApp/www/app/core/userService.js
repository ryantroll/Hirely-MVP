    /**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('UserService', ['$rootScope', '$q','FBURL', '$firebaseArray','fbutil', UserService]);

    function UserService($rootScope, $q, FBURL, $firebaseArray, fbutil, UserService) {
        var self = this;
        var fireRef = new Firebase(FBURL + '/users');
        var users = $firebaseArray(fireRef);

        function userModel(){
            this.firstName = '';
            this.lastName = '';
            this.fullName = '';
            this.email = '';
            this.profileImageUrl = '';
            this.personalStatement = '';
            this.provider =  '';
            this.providerId = '';
            this.createdOn = '';
            this.lastModifiedOn = '';

        };

        var currentUser;
        var isLoggedIn = false;

      this.getCurrentUser = function getCurrentUser() {
          return currentUser;
      }

       this.getIsLoggedIn =  function getIsLoggedIn(){
            return isLoggedIn;
        }

        this.setCurrentUser = function setCurrentUser(user){
            currentUser = user;
          }

        this.setIsLoggedIn = function setIsLoggedIn(aisLoggedIn){
            isLoggedIn = aisLoggedIn;

        }


        this.checkUserEmailExists = function checkUserEmailExists(email){
           return _.find(users, function(item){ return item.email == email });
        }

        this.createUserfromThirdParty = function createUserfromThirdParty(provider, authData) {
            var deferred = $q.defer();
            var user;
            switch(provider) {
                case 'facebook':
                    user = createFacebookUser(authData)
                    break;
                case 'twitter':

                    break;
                case 'google':

<<<<<<< HEAD
        this.checkUserEmailExists = function checkUserEmailExists(email){
            var userExists;
            usersDB.orderByChild("email").equalTo(email).on("child_added", function(snapshot) {
                userExists = snapshot.key();
            });
            return userExists
=======
>>>>>>> origin/master
        }
            var userExists = false;
            if(this.checkUserEmailExists(user.email))
            {
                deferred.reject('User email already exists.');
                userExists = true;
            }

            if(!userExists)
            {
                users.$add(user).then(function(ref) {
                    var newUser = users.$getRecord(ref.key());
                    self.setCurrentUser(newUser);
                    deferred.resolve(newUser);
                });

            }

            return deferred.promise;

        }

        this.createRegisteredNewUser = function createRegisteredNewUser(userData, providerId) {
            var deferred = $q.defer();
            var user;

            var userExists = false;
            if(this.checkUserEmailExists(userData.email))
            {
                deferred.reject('User email already exists.');
                userExists = true;
            }

            if(!userExists)
            {
                var timestamp = new Date();
                user = new userModel();
                user.fullName = userData.firstName + ' ' + userData.lastName;
                user.firstName = userData.firstName;
                user.lastName = userData.lastName;
                user.email = userData.email;
                user.provider = 'password';
                user.providerId = providerId;
                user.createdOn = timestamp;
                user.lastModifiedOn = timestamp;
                users.$add(user).then(function(ref) {
                    var newUser = users.$getRecord(ref.key());
                    deferred.resolve(newUser);
                });

            }

            return deferred.promise;

        }



        function createFacebookUser(fbAuthData)
        {
            var timestamp = new Date();
            var fbUser = new userModel();
            fbUser.fullName = fbAuthData.facebook.displayName;
            fbUser.profileImageUrl =  fbAuthData.facebook.profileImageURL;
            fbUser.email = fbAuthData.facebook.email;
            fbUser.provider = fbAuthData.provider;
            fbUser.providerId = fbAuthData.facebook.id;
            fbUser.createdOn = timestamp;
            fbUser.lastModifiedOn = timestamp;

            return fbUser;

        }





    }
})();
