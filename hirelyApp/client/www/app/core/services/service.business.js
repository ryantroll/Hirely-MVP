(function () {
    'use strict';

    angular.module('hirelyApp.manager')
        .service('BusinessService', ['$q','FIREBASE_URL', 'RESPONSE', BusinessService]);

     function BusinessService( $q, FIREBASE_URL, RESPONSE) {


        var deferred = $q.defer();

        var businessRef = new Firebase(FIREBASE_URL + '/business');
        var businessRefPush = businessRef.push();

        var onComplete = function (error) {
          if(error){
            deferred.resolve(RESPONSE.success);
          } else {
            deferred.reject(RESPONSE.success);
          }
        };

        /**
         *
         * for Company profile refer to: Business model
         *
         * for Address refer to Address Model
         *
         * for Contact refer to Contact Model
         *
         **/

        this.createNewBusiness = function createNewBusiness(companyProfile, address, contact, userEmail){

            var business = new Business(
              company.name,
              company.description = description,
              userEmail,
              company.type,
              company.active,
              company.placeId,
              company.website
            );

            businessRefPush.set(business, onComplete);
        }
    };

})();


