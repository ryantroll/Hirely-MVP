/**
 * Created by mike.baker on 9/25/2015.
 */


(function () {
    'use strict';

    angular.module('hirelyApp.manager')
        .service('BusinessService', ['$rootScope', '$q','FBURL', '$firebaseObject', 'fbutil', BusinessService]);

     function BusinessService($rootScope, $q, FBURL, $firebaseObject, fbutil, BusinessService) {
        var self = this;
        var bpostref = new Firebase(FBURL + '/business');
        var businessRef = bpostref.push();
        var rootRef = new Firebase(FBURL + '/businessSite');
        var businessSiteRef = rootRef.push();
        var busId = '';
        var siteId = '';
        var firebaseRef = new Firebase(FBURL + '/businessSiteLocation');
        var geoFire = new GeoFire(firebaseRef);

        function businessSiteModel(){
            this.active = '';
            this.type = '';
            this.description = '';
            this.name = '';
            this.photos = [];
      
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
            this.webaddress = '';
            this.name = '';
            this.parentBusiness = '';
            this.workHours = ''; 
        }

        this.createNewBusiness = function createNewBusiness(company){
            var deferred = $q.defer();
            var business = new businessSiteModel(); 

            business.active = 'true';
            business.type = company.status;
            business.description = company.description;
            business.name = company.name;
            business.photos = '';
            businessRef.push(business);
            busId =  businessRef.key();
           
            var businessSite = new companyObjModel();
            businessSite.active = 'true';
            businessSite.address = new addressObjModel(company);
            businessSite.currentlyHiring = 'true';
            businessSite.description = company.description;
            businessSite.hiringManagers = '';
            businessSite.webaddress = company.webaddress;
            businessSite.name = company.name;
            businessSite.parentBusiness = busId;
            businessSite.workHours = new daysObjModel(company);
            businessSiteRef.push(businessSite);
            siteId =  businessSiteRef.key();

            geoFire.set(siteId, [38.6294021, -77.2796177]).then(function() {
              console.log("Provided key has been added to GeoFire");
            }, function(error) {
              console.log("Error: " + error);
            });  
        }
    };

})();


