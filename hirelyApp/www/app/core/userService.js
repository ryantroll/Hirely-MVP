    /**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('UserService', ['$rootScope', '$q','$firebaseAuth', 'fbutil', UserService]);

    function UserService($rootScope, $q, $firebaseAuth, fbutil, UserService) {
        var self = this;
        var fbAuthRef = $firebaseAuth(fbutil.ref());
        var usersDB =  fbutil.ref("users");


        function userModel(){
            this.firstName = '';
            this.lastName = '';
            this.fullName = '';
            this.email = '';
            this. profileImageUrl = '';
            this.personalStatement = '';
            this.provider =  '';
            this. providerId = '';
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

        this.createUser =  function createUser(userId, user){

            usersDB
                .child(userId).set(user);

        }

        this.checkUserIdExists = function checkUserIdExists(userId){
            var userExists;
            usersDB.once('value', function(snapshot) {
                userExists = snapshot.hasChild(userId)
            });
        }

        this.checkUserEmailExists = function checkUserEmailExists(email){
            var userExists;
            usersDB.orderByChild("email").equalTo(email).on("child_added", function(snapshot) {
                userExists = snapshot.key();
            });
            return userExists
        }


        this.createUserfromFb  = function createUserfromFb(fbAuthData){
            var deferred = $q.defer();

            var currentdate = new Date();
            var datetime =  (currentdate.getMonth()+1)  + "/"
                + (currentdate.getDate()) + "/"
                + (currentdate.getYear()) + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

            var fbUser = new userModel();
            fbUser.fullName = fbAuthData.facebook.displayName;
            fbUser.profileImageUrl =  fbAuthData.facebook.profileImageURL;
            //fbUser.email = fbAuthData.facebook.email;
            fbUser.provider = fbAuthData.provider;
            fbUser.providerId = fbAuthData.facebook.id;
            fbUser.createdOn = datetime;
            fbUser.lastModifiedOn = datetime;

            //check if user exists
            if(this.checkUserEmailExists(fbUser.email))
            {
                deferred.reject('User email does not exists.');
            }
            this.createUser(fbAuthData.facebook.id, fbUser);

            this.setCurrentUser(fbUser);
        }





    }
})();
