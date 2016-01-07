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
  var baseURL = 'http://localhost:7200/api';

  /**
   * [endPoint private string variable to set endpoint in url for next request]
   * @type {String}
   */
  var endpoint = '';

  var service = {
    version:version,

    users:setUsersEndpoint
  }

  /**
   * [users child object to hold user endpoint functions and allow function call chain]
   * @type {Object}
   */
  var users = {
    createNew:createNewUser,
    get:getUsers
  }

  /**
   * [setUsersEndpoint this will set the endpint for users api and return child users object for function call chain]
   * @param {[type]} userId [if userId is sent to this function the endpoint will end with user id like /users/userId]
   */
  function setUsersEndpoint(userId, params){
    endpoint = '/' + version + '/users';

    if(angular.isDefined(userId) && userId !== '') endpoint += '/' + userId;

    if(angular.isDefined(userId)){
      if("string" === typeof params && '' !== params){
        endpoint += '/' + params;
      }
      else if(angular.isArray(params)){
        endpoint += "?" + params.join('&');
      }
    }

    return users;
  }



  /**
   * [createNewUser will create new user object in api and return the created object with its object id]
   * @param  {object} user [user object with user Model data]
   * @return {[promis]}      [description]
   */
  function createNewUser(userData){
    var deferred = $q.defer();

    $http.post(baseURL + endpoint, userData).then(
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
  }/// fun. createNewUser

  function getUsers(){
    var deferred = $q.defer();

    $http.get(baseURL + endpoint).then(
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

  return service;
}//// fun. HirelyApiService

})();
