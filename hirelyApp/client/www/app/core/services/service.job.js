/**
 * Created by mike.baker on 9/25/2015.
 */


(function () {
  'use strict';

  angular.module('hirelyApp.manager')
    .service('JobService', ['$q', 'FIREBASE_URL', '$firebaseObject', 'fbutil', JobService]);

  function JobService($q, FIREBASE_URL, $firebaseObject, fbutil, JobService) {
    var self = this;
    var ref = new Firebase(FIREBASE_URL + '/job');

    /*
    var onComplete = function (error) {
      if (error) {
        throw new Error('Storing new job failed' + error);
      } else {
        console.log('success.');
      }
    };*/

    

    /**
         *
         * for jobData refer to: Job model
         *
    **/

    this.createNewJob = function createNewJob(jobData) {

      var id = generatePushID();
      var job = new Job(
        jobData.businessId,
        jobData.hiringManager,
        jobData.position,
        jobData.numberOfPositions,
        jobData.occupationId,
        jobData.description,
        jobData.createdAt,
        jobData.updatedAt,
        jobData.available
      );

      ref.child(id).set(job, function(error){
        if (! error)
          console.log('success');
        else
          console.log('error');  
      });
    }
  };

})();


