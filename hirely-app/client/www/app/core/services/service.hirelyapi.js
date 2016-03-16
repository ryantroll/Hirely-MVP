(function () {
'use strict';

angular.module('hirelyApp.core')
  .service('HirelyApiService', ['$http', '$q', HirelyApiService]);

function HirelyApiService($http, $q) {
  /**
   * [version api version involved in URL for api call]
   * @type {String}
   */
  var version = 'v1';

  /**
   * [baseURL hold the base url used in calling the api]
   * @type {String}
   */
  var baseURL = '/api';

  /**
   * [endPoint private string variable to that hold the endpoint URL for next api request
   * to use the api one of the endpoint setters functions must be called first e.g. .users(), .busienss(), .auth(),...
   * the endpoitn setter fuction will reset this variable and build it again based on the requested service ]
   * @type {String}
   */
  var endpointUrl = '';

  /**
   * [service this object will returned by servie factory in last code line of this file]
   * @type {Object}
   */
  var service = {
    version:version,
    users:setUsersEndpoint,
    businesses:setBusinessesEndpoint,
    applications:setApplicationsEndpoint,
    traitify:setTraitifyEndpoint,
    favorites:setFavoritesEndpoint
  }

  /**
   * [users child object to hold user endpoint functions and allow function call chain
   * this object will be returned by .users() endpoint setter function to expose the http verbs function e.g. .users().get(), .users().post()]
   * @type {Object}
   */
  var users = {
    post:createNewUser,
    get:getUsers,
    patch:saveUser
  }

  /**
   * [businesses child object to hold business endpoint functions and allow function call chain
   * this object will be returned by .businesses() endpoint setter function to expose the http verbs function e.g. .businesses().get(), .businesses().post()]
   * @type {Object}
   */
  var businesses = {
    post:createNewBusiness,
    get:getBusinesses,
    patch:saveBusiness
  }

  /**
   * [applications child object to hold application endpoint functions and allow function call chain
   * this object will be returned by .applications() endpoint setter function to expose the http verbs function e.g. .applications().get(), .applications().post()]
   * @type {Object}
   */
  var applications = {
    post:createNewApplication,
    get:getApplications,
    patch:saveApplication
  }

  /**
   * [traitify child object to hold traitify endpoint functions and allow function call chain
   * this object will be returned by .traitify() endpoint setter function to expose the http verbs function e.g. .traitify().get(), .traitify().post()]
   * @type {Object}
   */
  var traitify = {
    post:createTraitifyAssessment,
    get:getTraifityAssessment
  }

  /**
   * [favorite child object to hold favorite endpoint functions and allow function call chain
   * this object will be returned by .favorite() endpoint setter function to expose the http verbs function e.g. .favorite().get(), .favorite().post()]
   * @type {Object}
   */
  var favorites = {
    post:updateFavorites,
    get:getFavorites
  }

  /**
   * [setUsersEndpoint this will set the endpint for users api and return child users object for function call chain]
   * this function accept 2 argumets but they are NOT explicitly defined in function signature becase this function might be called with 0, 1, or 2 arguments
   * First Argument:
   *   if string considered id
   *   if array it considered as query sting arguments only if the item is of string type
   *   if object is considered as query string argumets in format of KEY:VALUE only if VALUE is string
   * Second Argument:
   *   if string will be added to end of API url like /id/external only if first variable is string which mean first variable is id
   *   if array it considered as query sting arguments only if the item is of string type
   *   if object is considered as query string argumets in format of KEY:VALUE only if VALUE is string
   */
  function setUsersEndpoint(){
    setEndpoint('users', arguments);

    return users;
  }/// fun. setUserEndpoint

  function setBusinessesEndpoint(){
    setEndpoint('businesses', arguments);

    return users;
  }/// fun. setBusinessesEndpoint

  function setApplicationsEndpoint(){
    setEndpoint('applications', arguments);

    return users;
  }/// fun. setApplicationsEndpoint

  function setTraitifyEndpoint(){
    setEndpoint('traitify', arguments);

    return traitify;
  }

function setFavoritesEndpoint(){
    setEndpoint('favorites', arguments);

    return favorites;
  }

  /**
   * [setEndpoint will build the required url of desired API endpoint
   * this functione will be called from endpoint setter functions]
   * @param {string} point [string that identify the endpint in API e.g. users, business, ... ]
   * @param {array} args  [arguments array the sent from endpoint setter functions]
   */
  function setEndpoint(point, args){
    endpointUrl = '/' + version + '/' + point;

    var numArgs = args.length;
    /**
     * [processArray take an array of strings and return it as query string format
     * the item is included only if a string type ]
     * @param  {array} arr [array of string]
     * @return {string}     [s]
     */
    function processArray(arr){
      var query = '';
      for(var x=0; x<= arr.length; ++x){
        if('string' === typeof arr[x] && arr[x].length > 0){
          query += encodeURIComponent(arr[x]) + '&';
        }/// if
      }/// for
      if(query != ''){
        query = query.slice(0, -1);
      }
      return query;
    }//// fun. processArray

    function processObject(obj){
      var query = '';
      for(var key in obj){
        if('string'  === typeof obj[key])
          query += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]) + '&';
      }/// for
      if('' !== query){
        query = query.slice(0, -1);
      }
      return query;
    }//// fun. processObject

    if(1  <= numArgs){
      if('string' === typeof args[0] && '' !== args[0]){
        //// user id in first argument
        endpointUrl += '/' + encodeURIComponent(args[0]);
      }
      else if(angular.isArray(args[0])){
        endpointUrl += (endpointUrl.indexOf('?') < 0 ? "?" : "&") + processArray(args[0]);
      }
      else if(angular.isObject(args[0])){
        endpointUrl += (endpointUrl.indexOf('?') < 0 ? "?" : "&") + processObject(args[0]);
      }
    }//// if one argument

    if(2 <= numArgs){
      /**
       * if second argument is string add to end of URL only if first string is not array or object
       * e.g. /api/v1/some-id/external
       */
      if("string" === typeof args[1] && '' !== args[1] && 'string' === typeof args[0] && '' !== args[0]){
        endpointUrl += '/' + encodeURIComponent(args[1]);
      }
      else if(angular.isArray(args[1])){
        endpointUrl += (endpointUrl.indexOf('?') < 0 ? "?" : "&") + processArray(args[1]);
      }
      else if(angular.isObject(args[1])){
        endpointUrl += (endpointUrl.indexOf('?') < 0 ? "?" : "&") + processObject(args[1]);
      }
    }//// if 2 == argsNum
  }//// fun. setEndpoint



  /**
   * [createNewUser will create new user object in api and return the created object with its object id]
   * @param  {object} user [user object with user Model data]
   * @return {[promis]}      [description]
   */
  function createNewUser(userData){
    var deferred = $q.defer();

    $http.post(baseURL + endpointUrl, userData).then(
      function(payload){
        var res = payload.data;
        if(res.statusCode = 200){
          deferred.resolve(res.results);
        }
        else{
          deferred.reject(error.message);
        }
      }, //// fun. resolve
      function(error){
        var res = error.data;
        /**
         * Check if dublicated email is the issue and set a readable message
         */
        if(res.statusCode === 11000){
          deferred.reject('Email is already registered');
        }
        else{
          deferred.reject(res.message);
        }
      }//// fun. reject
    )

    return deferred.promise;
  }/// fun. createNewUser



  /**
   * [createNewBusiness will create new user object in api and return the created object with its object id]
   * @param  {object} business [business object with business Model data]
   * @return {[promis]}      [description]
   */
  function createNewBusiness(bData){
    var deferred = $q.defer();

    $http.post(baseURL + endpointUrl, bData).then(
        function(payload){
          var res = payload.data;
          if(res.statusCode = 200){
            deferred.resolve(res.results);
          }
          else{
            deferred.reject(error.message);
          }
        }, //// fun. resolve
        function(error){
          var res = error.data;
          deferred.reject(res.message);
        }//// fun. reject
    )

    return deferred.promise;
  }/// fun. createNewBusiness



  /**
   * [createNewApplication will create new user object in api and return the created object with its object id]
   * @param  {object} application [application object with user Model data]
   * @return {[promis]}      [description]
   */
  function createNewApplication(applicationData){
    var deferred = $q.defer();

    $http.post(baseURL + endpointUrl, applicaitonData).then(
        function(payload){
          var res = payload.data;
          if(res.statusCode = 200){
            deferred.resolve(res.results);
          }
          else{
            deferred.reject(error.message);
          }
        }, //// fun. resolve
        function(error){
          var res = error.data;
          deferred.reject(res.message);
        }//// fun. reject
    )

    return deferred.promise;
  }/// fun. createNewApplication

  function getUsers(){
    var deferred = $q.defer();

    $http.get(baseURL + endpointUrl).then(
      function(payload){
        var res = payload.data;
        if(res.statusCode = 200){
          deferred.resolve(res.results);
        }
        else{
          deferred.reject(res.message);
        }
      },
      function(error){
        deferred.reject(error);
      }
    )

    return deferred.promise;
  }//// fun. getUsers

  function saveUser(userData){
    var deferred = $q.defer();

    $http.patch(baseURL + endpointUrl, userData)
    .then(
      function(payload){
        var res = payload.data;
        if(res.statusCode = 200){
          deferred.resolve(res.results);
        }
        else{
          deferred.reject(res.message);
        }
      },
      function(error){
        deferred.reject(error);
      }
    );/// patch.then

    return deferred.promise;
  }//// fun. saveUser

  function saveBusiness(userData){
    var deferred = $q.defer();

    $http.patch(baseURL + endpointUrl, userData)
        .then(
            function(payload){
              var res = payload.data;
              if(res.statusCode = 200){
                deferred.resolve(res.results);
              }
              else{
                deferred.reject(res.message);
              }
            },
            function(error){
              deferred.reject(error);
            }
        );/// patch.then

    return deferred.promise;
  }//// fun. saveBusiness


  function saveApplication(userData){
    var deferred = $q.defer();

    $http.patch(baseURL + endpointUrl, userData)
        .then(
            function(payload){
              var res = payload.data;
              if(res.statusCode = 200){
                deferred.resolve(res.results);
              }
              else{
                deferred.reject(res.message);
              }
            },
            function(error){
              deferred.reject(error);
            }
        );/// patch.then

    return deferred.promise;
  }//// fun. saveApplication

  function getBusinesses(){
    var deferred = $q.defer();

    $http.get(baseURL + endpointUrl).then(
        function(payload){
          var res = payload.data;
          if(res.statusCode = 200){
            deferred.resolve(res.results);
          }
          else{
            deferred.reject(res.message);
          }
        },
        function(error){
          deferred.reject(error);
        }
    )

    return deferred.promise;
  }//// fun. getBusinesses

  function getApplications(){
    var deferred = $q.defer();

    $http.get(baseURL + endpointUrl).then(
        function(payload){
          var res = payload.data;
          if(res.statusCode = 200){
            deferred.resolve(res.results);
          }
          else{
            deferred.reject(res.message);
          }
        },
        function(error){
          deferred.reject(error);
        }
    )

    return deferred.promise;
  }//// fun. getApplications

  function getTraifityAssessment(){
    var deferred = $q.defer();

    $http.get(baseURL + endpointUrl).then(
        function(payload){
          var res = payload.data;

          if(res.statusCode = 200){
            deferred.resolve(res.results);
          }
          else{
            deferred.reject(res.message);
          }
        },
        function(error){
          deferred.reject(error);
        }
    )

    return deferred.promise;
  }//// fun. getTraifity

  function createTraitifyAssessment(data){
    var deferred = $q.defer();

    $http.post(baseURL + endpointUrl, data).then(
        function(payload){
          var res = payload.data;
          if(res.statusCode = 200){
            deferred.resolve(res.results);
          }
          else{
            deferred.reject(error.message);
          }
        }, //// fun. resolve
        function(error){
          var res = error.data;
          deferred.reject(res.message);
        }//// fun. reject
    )

    return deferred.promise;
  }//// fun. createTraitifyAssessment

  function updateFavorites(data){
    var deferred = $q.defer();

    $http.post(baseURL + endpointUrl, data).then(
        function(payload){
          var res = payload.data;
          if(res.statusCode = 200){
            deferred.resolve(res.results);
          }
          else{
            deferred.reject(error.message);
          }
        }, //// fun. resolve
        function(error){
          var res = error.data;
          deferred.reject(res.message);
        }//// fun. reject
    )

    return deferred.promise;
  }/// fun. updateFavorite

  function getFavorites(){
    var deferred = $q.defer();

    $http.get(baseURL + endpointUrl).then(
        function(payload){
          var res = payload.data;

          if(res.statusCode = 200){
            deferred.resolve(res.results);
          }
          else{
            deferred.reject(res.message);
          }
        },
        function(error){
          deferred.reject(error);
        }
    )

    return deferred.promise;
  }

  return service;
}//// fun. HirelyApiService

})();
