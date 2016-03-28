/**
 * Created by mike.baker on 9/25/2015.
 */


(function () {
  'use strict';

  angular.module('hirelyApp.job')
    .service('JobService', ['$q',  JobService]);

  function JobService($q, JobService) {
    var self = this;

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


    // retrieve job by its ID
     this.getJobById = function getJobById(id)
    { 
      // var deferred = $q.defer();
      // var user = {};
      // var url = new Firebase(FIREBASE_URL + "/business/" + id);
      // url.on("value", function(snapshot) {
      //   user = snapshot.val();
      //   deferred.resolve(user);
      // }, function (err) {
      // deferred.reject(err);
      // });
      //
      // return deferred.promise;
    }


  };

})();


