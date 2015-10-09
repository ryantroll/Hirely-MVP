/**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('BusinessService', ['$rootScope', '$q','FBURL', '$firebaseObject', 'fbutil', 'UserService', BusinessService]);

    function BusinessService($rootScope, $q, FBURL, $firebaseObject, fbutil, UserService, BusinessService) {
        var self = this;
        var busref = new Firebase(FBURL + '/business');
        var businessRef = busref.push();
        var siteRef = new Firebase(FBURL + '/businessSite');
        var businessSiteRef = siteRef.push();
        var photoRef = new Firebase(FBURL + '/businessPhotos');
        var businessPhotoRef = photoRef.push();
        var firebaseRef = new Firebase(FBURL + '/businessSiteLocation');
        var geoFire = new GeoFire(firebaseRef);
        var posRef = new Firebase(FBURL + '/position');
        var positionSiteRef = posRef.push();
        var busId = '';
        var managerId = '';
        var siteId = '';
        var photoId = '';
        var currentUser;
        var currentUserId;
        var isLoggedIn = false;
        var profile;

        function businessSiteModel(){
            this.active = '';
            this.type = '';
            this.description = '';
            this.name = '';
        }

        function businessPhotosModel(){
            this.parentBusiness = '';
            this.main = '';
            this.size = '';
            this.source= '';
        }

        function addressObjModel(company){
            this.city = company.locality;
            this.formattedAddress = company.street_number;
            this.placeId = busId;
            this.state = company.administrative_area_level_1;
            this.street1 = company.route;
            this.street2 = '';
            this.zipCode = company.postal_code;
        }

        function hoursObjModel(companyo, companyc){
            this.startTime = companyo;
            this.endTime = companyc;
        }

        function daysObjModel(company){
            this.sunday = new hoursObjModel(company.open_store_hours0, company.closed_store_hours0);
            this.monday = new hoursObjModel(company.open_store_hours1, company.closed_store_hours1);
            this.tuesday = new hoursObjModel(company.open_store_hours2, company.closed_store_hours2);
            this.wednesday = new hoursObjModel(company.open_store_hours3, company.closed_store_hours3);
            this.thursday = new hoursObjModel(company.open_store_hours4, company.closed_store_hours4);
            this.friday  = new hoursObjModel(company.open_store_hours5, company.closed_store_hours5);
            this.saturday = new hoursObjModel(company.open_store_hours6, company.closed_store_hours6);
        }
     
        function companyObjModel(){
            this.active = '';
            this.address = '';
            this.currentlyHiring = '';
            this.description = '';
            this.hiringManagers = '';
            this.lastModifiedOn = '';
            this.name = '';      
            this.parentBusiness = '';
            this.profileImageUrl = '';
            this.webaddress = '';
            this.workHours = '';
        }

        this.createNewBusiness = function createNewBusiness(company, userId){
            var deferred = $q.defer();

            var business = new businessSiteModel(); 
            business.active = 'true';
            business.type = company.status;
            business.description = company.description;
            business.name = company.name;
            businessRef.set(business);
            busId =  businessRef.key();

            var businessPhotos = new businessPhotosModel();
            businessPhotos.parentBusiness = busId;
            businessPhotos.main = '';
            businessPhotos.size = '';
            businessPhotos.source= '';
            businessPhotoRef.push(businessPhotos);
           
            var businessSite = new companyObjModel();
            var timestamp = Firebase.ServerValue.TIMESTAMP;
            businessSite.active = 'true';
            businessSite.address = new addressObjModel(company);
            businessSite.currentlyHiring = 'true';
            businessSite.description = company.description;
            businessSite.hiringManagers = userId;
            businessSite.webaddress = company.webaddress;
            businessSite.name = company.name;
            businessSite.parentBusiness = busId;
            businessSite.workHours = new daysObjModel(company);
            businessSite.profileImageUrl = company.profileImageUrl;
            businessSite.lastModifiedOn = timestamp;
            businessSiteRef.set(businessSite);
            siteId =  businessSiteRef.key();

            geoFire.set(siteId, [38, -77]).then(function() {
              console.log("Provided key has been added to GeoFire");
            }, function(error) {
              console.log("Error: " + error);
            });  
        }

        this.getCurrentUser = function getCurrentUser() {
           return currentUserId;
        };

        this.getIsLoggedIn =  function getIsLoggedIn(){
            return isLoggedIn;
        };

        this.setCurrentUser = function setCurrentUser(user, userId){
            currentUser = user;
            currentUserId = userId;
        };

        function dailyObjModel(afternoon,evening, morning){
            this.afternoon = afternoon;
            this.evening = evening;
            this.morning = morning;
        }
      
       function daysAvailObjModel(job){
            this.sunday = new dailyObjModel(job.sun_afternoon, job.sun_evening, job.sun_morning);
            this.monday = new dailyObjModel(job.mon_afternoon, job.mon_evening, job.mon_morning);
            this.tuesday = new dailyObjModel(job.tues_afternoon, job.tues_evening, job.tues_morning);
            this.wednesday = new dailyObjModel(job.wed_afternoon, job.wed_evening, job.wed_morning);
            this.thursday = new dailyObjModel(job.thurs_afternoon, job.thurs_evening, job.thurs_morning);
            this.friday  = new dailyObjModel(job.fri_afternoon, job.fri_evening, job.fri_morning);
            this.saturday = new dailyObjModel(job.sat_afternoon, job.sat_evening, job.sat_morning);
        }

     function benefitsObjModel(job){
            this.dental = job.dental;
            this.discounts = job.discounts;
            this.flexibleSchedule= job.flexibleSchedule;
            this.life = job.life;
            this.medical = job.medical;
            this.retirement = job.retirement;
            this.stock = job.stock ;
            this.vision = job.vision;
        }
      function wageObjModel(job){
           this.frequency = '';
           this.minAmount = job.MinSalary;
           this.maxAmount = job.MaxSalary;
        }
      function compensationObjModel(job){
            this.commission = '';
            this.tips = '';
            this.wage = new wageObjModel(job);
        }

     function employmentObjModel(job){
            this.fullTime = ''; 
            this.partTime = '';
        }

     function workhoursObjModel(job){
            this.min = job.MinHours;
            this.max = job.MaxHours;
        }

     function positionObjModel(){
            this.availabilty = '';
            this.benefits = '';
            this.businessId = '';
            this.compensation= '';
            this.createDate = '';
            this.createDate = '';
            this.description = '';
            this.employmentTypes = ''; 
            this.HiringManager = '';
            this.modifiedDate = '';
            this.occupation = '';
            this.postdate = '';
            this.siteId = '';   
            this.status = 'Active';
            this.taskDesription = '';
            this.title = '';
            this.workhours = '';
        }


      this.createNewSitePosition = function createNewSitePosition(job, userId){
        
           
            var positionSite = new positionObjModel();
            var timestamp = Firebase.ServerValue.TIMESTAMP;
            positionSite.availabilty = new daysAvailObjModel(job);
            positionSite.benefits = new benefitsObjModel(job);
            positionSite.businessId = busId;
            positionSite.compensation= new compensationObjModel(job);
            positionSite.createDate = timestamp;
            positionSite.description = '';
            positionSite.employmentTypes= new employmentObjModel(job); 
            positionSite.HiringManager = userId;
            positionSite.modifiedDate = timestamp;
            positionSite.occupation = job.LayName;
            positionSite.postdate = timestamp;
            positionSite.siteId = '';   
            positionSite.status = 'Active';
            positionSite.taskDesription = 'Lorem ipsum dolor sit amet, consectetur adipisc...';
            positionSite.title = job.occupation;
            positionSite.workhours = new workhoursObjModel(job); 

            positionSiteRef.set(positionSite);

        }










































    }
})();
