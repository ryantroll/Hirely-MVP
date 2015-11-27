(function () {
    'use strict';

    angular.module('hirelyApp.manager')
        .service('BusinessService', ['$q','FIREBASE_URL', 'RESPONSE', BusinessService]);

     function BusinessService( $q, FIREBASE_URL, RESPONSE) {


        var deferred = $q.defer();

        var businessRef = new Firebase(FIREBASE_URL + '/business');

        //var onComplete = function (error) {
        //  if(error){
        //    deferred.resolve(RESPONSE.success);
        //  } else {
        //    deferred.reject(RESPONSE.success);
        //  }
        //};

        /**
         *
         * for Company profile refer to: Business model
         *
         * for Address refer to Address Model
         *
         * for Contact refer to Contact Model
         *
         **/

        this.createNewBusiness = function createNewBusiness(companyProfile, pAddress, pContact, userEmail){

            var id = generatePushID();
            var business = new Business(
              companyProfile.name,
              companyProfile.description = description,
              companyProfile,
              companyProfile.type,
              companyProfile.active,
              companyProfile.placeId,
              companyProfile.website
            );

            var address = new Address(
              pAddress.formattedAddress,
              pAddress.zipCode,
              pAddress.street,
              pAddress.city,
              pAddress.state,
              pAddress.lng,
              pAddress.lat
            );

            //businessRefPush.set(business, onComplete);

            businessRef.child(id).set(business, function(error){
              if(!error){
                businessRef.child(id).child('address').set(address);
                businessRef.child(id).child('contact').set(contact);
              }
            });
        }


    };

})();


