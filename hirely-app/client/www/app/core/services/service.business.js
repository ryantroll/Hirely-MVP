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


        this.testObj = function testObj(){

          var obj = {
            name : 'zouhir',
            testObje: {
              anotherName: [{name: 'zouuhir'}, {name2: 'zouhir2'}],
              ObjectNested: {
                againName: 'Zouhir'
              }
            }
          }
          businessRef.push(obj);
        }

        /**
         *
         * for Company profile refer to: Business model
         *
         *
         **/

        this.createNewBusiness = function createNewBusiness(companyProfile){

            var id = generatePushID();
            var business = new Business(
              companyProfile.name,
              companyProfile.description,
              companyProfile.admin,
              companyProfile.type,
              companyProfile.active,
              companyProfile.placeId,
              companyProfile.website,
              companyProfile.photo,
              companyProfile.address,
              companyProfile.contact
            );

            businessRef.child(id).set(business, function(error){
              if(!error){
                console.log('success');
              }
              else
                console.log('error');
            });
        }



    // retrievce business by its ID
    this.getBusinessById = function getBusinessById(id)
    {
      var deferred = $q.defer();
      var user = {};
      var url = new Firebase(FIREBASE_URL + "/business/" + id);
      url.on("value", function(snapshot) {
        user = snapshot.val();
        deferred.resolve(user);
      }, function (err) {
      deferred.reject(err);
      });

      return deferred.promise;
    }


    };

})();
