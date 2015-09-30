/**
 * Created by mike.baker on 9/25/2015.
 */


(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .service('BusinessService', ['$rootScope', '$q', 'FBURL', '$firebaseObject', 'fbutil', BusinessService]);

     function BusinessService($rootScope, $q, FBURL, $firebaseObject, fbutil, BusinessService) {
        var self = this;
        var postref = new Firebase(FBURL + "/business");
        var newPostRef = postref.push();

        function businessSiteModel(){
            this.active = 'true';
            this.description = '';
            this.name = '';
            this.photos = [];
            this.siteId = '';
            this.companyName = '';
            this.siteName = '';
            this.address = '';
            this.photos = [];
      
        }

        function companyObjModel(businessObj){
            this.active = 'true';
            this.address.city = '';
            this.address.formattedAddress = '';
            this.address.placeId = '';
            this.address.state = '';
            this.address.street1 = '';
            this.address.street2 = '';
            this.address.zipCode = '';
            this.currentlyHiring = 'true';
            this.description = '';
            this.hiringManagers = '';
            this.webaddress = '';
            this.name = '';
            this.parentBusiness = 'siteId';
            this.siteId = '';
            this.workHours.sunday.startTime = '';
            this.workHours.sunday.endTime = '';
            this.workHours.monday.startTime = '';
            this.workHours.monday.endTime = '';
            this.workHours.tuesday.startTime = '';
            this.workHours.tuesday.endTime = '';
            this.workHours.wednesday.startTime = '';
            this.workHours.wednesday.endTime = '';
            this.workHours.thursday.startTime = '';
            this.workHours.thursday.endTime = '';
            this.workHours.friday.startTime = '';
            this.workHours.friday.endTime = '';
            this.workHours.saturday.startTime = '';
            this.workHours.saturday.endTime = '';
        }

        function businessSiteLocationObjModel(siteLocation, siteId){
            this.siteId = '';
            this.latitude = '';
            this.longitude = '';
        }


        function createNewBusiness(businessObj){
            var ref = new Firebase(FBURL);
            var deferred = $q.defer();
            var businessRef = business.ref();
            // run it and see what we get
            businessRef.once('value', function(snap) {
                    var businesses = snap.val();
                    var business = new businessSiteModel();        
                    var meetsActive = usiness.active == 'Active'

                    if(meetsActive){
                        business.description = siteObj.businessSite.description;
                        businessname = siteObj.businessSite.name;
                        business.photos = siteObj.photos;
                        business.push(business);
                        newPostRef.setValue(business);
                        business.siteId = newPostRef.getKey();

                                //check if position meets criteria
                                var meetsActive = positionObj.status == 'Active'
                                if(meetsActive)
                                {
                                    var businessSite = new companyObjModel();
                                    businessSite.active = 'true';
                                    businessSite.address.city = 'businessObj.city';
                                    businessSite.address.formattedAddress = 'businessObj.address';
                                    businessSite.address.placeId = '';
                                    businessSite.address.state = 'businessObj.state';
                                    businessSite.address.street1 = 'businessObj.address';
                                    businessSite.address.street2 = 'businessObj.street';
                                    businessSite.address.zipCode = 'businessObj.zip';
                                    businessSite.currentlyHiring = 'true';
                                    businessSite.description = '';
                                    businessSite.hiringManagers = '';
                                    businessSite.webaddress = 'businessObj.webaddress';
                                    businessSite.name = 'businessObj.name';
                                    businessSite.parentBusiness = 'site.siteId';
                                    businessSite.workHours.sunday.startTime = 'businessObj.OHours0';
                                    businessSite.workHours.sunday.endTime = 'businessObj.CHours0';
                                    businessSite.workHours.monday.startTime = 'businessObj.OHours1';
                                    businessSite.workHours.monday.endTime = 'businessObj.CHours1';
                                    businessSite.workHours.tuesday.startTime = 'businessObj.OHours2';
                                    businessSite.workHours.tuesday.endTime = 'businessObj.CHours2';
                                    businessSite.workHours.wednesday.startTime = 'businessObj.OHours3';
                                    businessSite.workHours.wednesday.endTime = 'businessObj.CHours3';
                                    businessSite.workHours.thursday.startTime = 'businessObj.OHours4';
                                    businessSite.workHours.thursday.endTime = 'businessObj.CHours4';
                                    businessSite.workHours.friday.startTime = 'businessObj.OHours5';
                                    businessSite.workHours.friday.endTime = 'businessObj.CHours5';
                                    businessSite.workHours.saturday.startTime = 'businessObj.OHours6';
                                    businessSite.workHours.saturday.endTime = 'businessObj.CHours6';
                                    businessSite.push(businessSite);
                                    businessSite.siteId = newPostRef.getKey();
                                }
                            } deferred.resolve(site);
                           

                    }), function (err) {
                    deferred.reject(snap);
                   
                }
            return deferred.promise;
          
       }
    };
})();


