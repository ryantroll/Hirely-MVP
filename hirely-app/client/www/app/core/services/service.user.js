(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .service('UserService', ['$q', 'HirelyApiService', UserService]);

  function UserService($q, HirelyApiService) {

    /**
     * [createRegisteredNewUser will create user model data based on data sent from registration form
     * and send the user model object to createUser function to save in DB
     * This function usually called after registerNewUser is successfully add a user to Auth DB and returned it's ID]
     * @param  {object} userData [data of user to be created in DB]
     * @param  {string} userID   [the auth id of user returned by registerNewUser function]
     * @return {promise}          [the resolve will return the new suser object created in DB]
     */
    this.createNewUser = function createRegisteredNewUser(userData, userID) {

      // var user = new User(userData.firstName, userData.lastName, userData.email, userData.mobile,
      //   userData.country, userData.state, userData.city, userData.street1, userData.street2, userData.street3, userData.postalCode, userData.formattedAddress, userData.lng, userData.lat,
      //   userData.createdOn, userData.lastModifiedOn);

      return HirelyApiService.users().post( userData );

    };


    /**
     * [saveUser will update a user information by callin api]
     * @param  {object} userData [hold the fields of user object to be updated]
     * @param  {string} userId   [id of user to be updated]
     * @return {promiss}          [description]
     */
    this.saveUser = function(userData, uid){
      var deferred = $q.defer();
      if (!uid) {
        if (!userData._id){
          var err = "Error:  trying to save a user without an id";
          console.log(err);
          deferred.reject(err);
          return deferred.promise;
        }
        uid = userData._id;
      }
      HirelyApiService.users(uid).patch( userData )
          .then(
              function(newData){
                deferred.resolve(newData);
              },
              function(err){
                deferred.reject(err);
              }
          );
      return deferred.promise;
    };//// fun. saveUser


    /**
     * [getUserById will get a user object from DB by suppling user id for local DB or user id for exteranl DB like firebase id]
     * @param  {string} id [id of user this id can b]
     * @return {promise}    [description]
     */
    this.getUserById = function getUserById(id, complete) {
      if(complete){
        return HirelyApiService.users(id, ['complete']).get();
      }
      else{
        return HirelyApiService.users(id).get();
      }
    };

    /**
     * [getUserById will get a user object from DB by suppling user id for local DB or user id for exteranl DB like firebase id]
     * @param  {string} id [id of user this id can b]
     * @return {promise}    [description]
     */
    this.getToken = function getToken() {
      return HirelyApiService.users('getToken').get();
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
      if (val) {
        return val.split(/[\(|\)| |\-|\+|\.|\+1\.]/).join('');
      } else return '';
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

  }


})();
