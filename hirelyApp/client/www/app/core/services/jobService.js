/**
 * Created by mike.baker on 9/25/2015.
 */


(function () {
    'use strict';

    angular.module('hirelyApp.manager')
        .service('JobService', ['$q','FIREBASE_URL', '$firebaseObject', 'fbutil', JobService]);

     function JobService( $q, FIREBASE_URL, $firebaseObject, fbutil, JobService) {
        var self = this;
        var jobRef = new Firebase(FIREBASE_URL + '/job');
        var jobRefPush = jobRef.push();


       //internal constructor
        function jobModel(businessId,hiringMgr,contact,applicants,workingHrs,created_at,,modified_at,occupation_id){
            this.businessId = businessId;
            this.hiringMgr = hiringMgr;
            this.contact = contact;
            this.applicants = applicants;
            this.workingHrs = workingHrs;
            this.created_at = created_at;
            this.modified_at = modified_at;
            this.occupation_id = occupation_id;

        }

        var onComplete = function (error) {
          if(error){
            console.log(error + 'storing failed');
          } else {
            console.log('YAY YAY YAY');
          }
        };

        //exported to be used in Controller as: JobService.createNewJob(xx,xx)
        this.createNewJob = function createNewJob(jobData, userId){
          

            var job = new jobModel(
              jobData.businessId,
              jobData.hiringMgr,
              jobData.contact,
              jobData.applicants,
              jobData.workingHrs
              jobData.created_at,
              jobData.modified_at,
              jobData.occupation_id
            );

            jobRefPush.set(job, onComplete);
        }
    };

})();


