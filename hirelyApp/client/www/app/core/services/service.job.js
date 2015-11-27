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


    //internal constructor
    var Job = function (businessId, hiringMngrId, position, description, contact, applicants, workingHrs, created_at, modified_at, occupation_id) {
      this.businessId = businessId;
      this.hiringMngrId = hiringMngrId;
      this.position = position;
      this.description = description;
      this.contact = contact;
      this.applicants = applicants;
      this.workingHrs = workingHrs;
      this.created_at = created_at;
      this.modified_at = modified_at;
      this.occupation_id = occupation_id;
    };

    var Contact = function (email, phone, mobile, other) {
      this.email = email;
      this.phone = phone;
      this.mobile = mobile;
      this.other = other;
    };

    var onComplete = function (error) {
      if (error) {
        throw new Error('Storing new job failed' + error);
      } else {
        console.log('success.');
      }
    };

    //exported to be used in Controller as: JobService.createNewJob(Job)
    this.createNewJob = function createNewJob(jobData) {

      //Create Job object from constructor
      var job = new Job(
        jobData.businessId,
        jobData.hiringMngrId,
        jobData.position,
        jobData.description,
        jobData.applicants,
        jobData.workingHrs,
        jobData.created_at,
        jobData.modified_at,
        jobData.occupation_id
      );

      //Create contact object
      var contact = new Contact(
        jobData.contact.email || '',
        jobData.contact.phone || '',
        jobData.contact.mobile || '',
        jobData.conatct.other || ''
      );

      ref.child(generatePushID).set(job, function(){
        ref.child(generatePushID).child('contact').set(contact, onComplete());
      });
    }
  };

})();


