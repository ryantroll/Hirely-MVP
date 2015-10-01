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
            this.active = 'true';
            this.description = '';
            this.name = '';
            this.photos = [];
      
        }
       function addressObjModel(company){
                this.city = company.locality;
                this.formattedAddress = '';
                this.placeId = busId;
                this.state = '';
                this.street1 = '';
                this.street2 = '';
                this.zipCode = '';
        }

        function hoursObjModel(){
                this.startTime = '';
                this.endTime = '';
        }
        
        function companyObjModel(){
            this.active = 'true';
            this.address = '';
            this.currentlyHiring = 'true';
            this.description = '';
            this.hiringManagers = '';
            this.webaddress = '';
            this.name = '';
            this.parentBusiness = ''
            this.siteId = '';
            this.workHours = function hoursObjModel(){
                this.startTime = '';
                this.endTime = '';
          }   
        }

        function businessSiteLocationObjModel(siteLocation, siteId){
            this.siteId = '';
            this.latitude = '';
            this.longitude = '';
        }

        this.createNewBusiness = function createNewBusiness(company){
            var deferred = $q.defer();
            var business = new businessSiteModel(); 
            
            business.description = company.description;
            business.name = company.name;
            business.photos = '';
            businessRef.push(business);
            busId =  businessRef.key();
           
            var businessSite = new companyObjModel();
            businessSite.active = 'true';
            businessSite.address = new addressObjModel(company);
            businessSite.currentlyHiring = 'true';
            businessSite.description = company.description;;
            businessSite.hiringManagers = '';
            businessSite.webaddress = company.webaddress;
            businessSite.name = company.name;
            businessSite.parentBusiness = busId;
            businessSite.workHours = new hoursObjModel();
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


