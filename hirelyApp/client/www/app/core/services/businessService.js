/**
 * Created by mike.baker on 9/25/2015.
 */


(function () {
    'use strict';

    angular.module('hirelyApp.manager')
        .service('BusinessService', ['$q','FIREBASE_URL', '$firebaseObject', 'fbutil', BusinessService]);

     function BusinessService( $q, FIREBASE_URL, $firebaseObject, fbutil, BusinessService) {
        var self = this;
        var buesinessRef = new Firebase(FIREBASE_URL + '/business');
        var businessRefPush = buesinessRef.push();


       //internal constructor
        function businessModel(name, description, type, active, placeId, website, photos, children, parent, jobs, address){
            this.name = name;
            this.description = description;
            this.type = type;
            this.active = active;
            this.placeId = placeId;
            this.website = website;
            this.photos = photos;
            this.children = children;
            this.parent = parent;
            this.jobs = jobs;
            this.address = address;

        }

        var onComplete = function (error) {
          if(error){
            console.log(error + 'storing failed');
          } else {
            console.log('YAY YAY YAY');
          }
        };

        //exported to be used in Controller as: BusinessService.createNewBusiness(xx,xx)
        this.createNewBusiness = function createNewBusiness(company, userId){
          

            var business = new businessModel(
              company.name,
              company.description,
              company.type,
              company.active,
              company.placeId,
              company.website,
              company.photos,
              company.children,
              company.parent,
              company.jobs,
              company.address
            );

            businessRefPush.set(business, onComplete);
        }
    };

})();


