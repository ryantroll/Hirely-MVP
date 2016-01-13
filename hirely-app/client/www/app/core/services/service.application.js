/**
 * Created by Iyad Bitar
 *
 * Traitify Personality Analysis - more info: https://developer.traitify.com
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .factory('JobApplicationService', ['$q', 'HirelyApiService', JobApplicationService]);

  function JobApplicationService( $q, HirelyApiService) {

    /**
     * [service object that define angular service to be returned by factory function at the end of this code]
     * @type {Object}
     */
    var service = {
      save:save,
      isApplicationExists: isApplicationExists
    };

    /**
     * [addNewApplication this will create a new job application object in DB]
     * @param {[type]} jobApp [Job Application obj see models/applications.js for more]
     * @param {[type]} userId [User id to associate this job application with]
     * @param {[type]} jobID  [ID of the Job applicant is applying to]
     */
    function save(jobApp){
      var deferred = $q.defer();
      var data = {};

      /**
       * check if job app exists and set right create on date
       */
      return isApplicationExists(jobApp.userId, jobApp.variantId)
        .then(
            function(foundedApp){
                /**
                 * application exist do patch
                 */
                delete foundedApp.prescreenAnswers;

                angular.extend(foundedApp, jobApp);

                return HirelyApiService.applications(foundedApp._id).patch(jobApp);
            },
            function(){
                /**
                 * application doesn't exists do post
                 */
                return HirelyApiService.applications().post(jobApp);
            }
        )/// then


      return deferred.promise;
    }//// fun. save

    /**
     * [isApplicationExists used to check and retrive job applicaiton object]
     * @param  {[string]}  userID [id of user]
     * @param  {[string]}  jobID  [id of job]
     * @return {promise}        [usually promise will returned]
     */
    function isApplicationExists(userId, variantId){
        var deferred = $q.defer();

        HirelyApiService.applications({userId:userId, variantId:variantId}).get()
        .then(
            function(foundedApp){
                if(angular.isArray(foundedApp) && foundedApp.length > 0){
                    deferred.resolve(foundedApp[0]);
                }
                else{
                    deferred.reject();
                }
            },
            function(err){
                deferred.reject(err);
            }
        )//// .get().then()

        return deferred.promise;
    }

    /**
     * Return server object
     * this way we can have private functions that we don't want to expose
     */
    return service;
  }
})();
