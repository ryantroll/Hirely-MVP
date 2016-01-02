/**
 * Created by Iyad Bitar
 *
 * Traitify Personality Analysis - more info: https://developer.traitify.com
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp.core')
    .factory('JobApplicationService', ['$q', 'FIREBASE_URL', JobApplicationService]);

  function JobApplicationService( $q, FIREBASE_URL) {

    /**
     * [ref Firbase referance object]
     * @type {firebase object}
     */
    var ref = new Firebase(FIREBASE_URL + '/applications');

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
    function save(jobApp, userID, jobID){
      var deferred = $q.defer();
      var data = {};

      /**
       * check if job app exists and set right create on date
       */
      isApplicationExists(userID, jobID)
        .then(
            function(jobApp){
                data.createdOn = jobApp.createdOn;
            },
            function(){
                data.createdOn = Firebase.ServerValue.TIMESTAMP
            }
        )/// then
        .finally(
            //// update the date after createdOn data is been set
            function(){
                data.application = jobApp;

                ref.child(userID).child(jobID).set(data, function(error){
                    if(error){
                      deferred.reject(error);
                    }
                    else{
                      deferred.resolve(true);
                    }
                });
            }/// fun. in finally
        )/// finally

      return deferred.promise;
    }//// fun. save

    /**
     * [isApplicationExists used to check and retrive job applicaiton object]
     * @param  {[string]}  userID [id of user]
     * @param  {[string]}  jobID  [id of job]
     * @return {promise}        [usually promise will returned]
     */
    function isApplicationExists(userID, jobID){
        var deferred = $q.defer();

        ref.child(userID).child(jobID).once('value', function(snap){
            var exists = snap.val();
            if(null !== exists){
                deferred.resolve(exists);
            }
            else{
                deferred.reject(false);
            }
        })

        return deferred.promise;
    }

    /**
     * Return server object
     * this way we can have private functions that we don't want to expose
     */
    return service;
  }
})();
