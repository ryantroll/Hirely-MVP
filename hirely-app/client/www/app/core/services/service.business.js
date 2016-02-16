(function () {
    'use strict';

    angular.module('hirelyApp.manager')
        .service('BusinessService', ['$q','HirelyApiService', BusinessService]);

     function BusinessService( $q, HirelyApiService) {

        // var deferred = $q.defer();
        //
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

        this.getBySlug = function(slug){
          var deferred = $q.defer();
          HirelyApiService.businesses(slug).get()
          .then(
            function(businesses){
                if(businesses){
                  deferred.resolve(businesses);
                }
                else{
                  deferred.reject('Business not found')
                }


            },
            function(err){
              deferred.reject(err)
            }
          );

          return deferred.promise;
        }//// fun. getBySlug

        this.locationBySlug = function(slug, business){

          if(angular.isUndefined(business.locationSlugs[slug])){
            return null;
          }
          if(angular.isDefined(business.locations[ business.locationSlugs[slug] ])){
            return business.locations[ business.locationSlugs[slug] ];
          }
          else{
            return null;
          }
        }//// loationBySlug

        this.positionBySlug = function(posSlug, locSlug, business){
          var loc = this.locationBySlug(locSlug, business);
          if(null === loc){
            return null;
          }
          if( angular.isUndefined(loc.positionSlugs[posSlug]) ){
            return null;
          }

          if( angular.isDefined(business.positions[ loc.positionSlugs[posSlug] ]) ){
            return business.positions[ loc.positionSlugs[posSlug] ];
          }
          else{
            return null;
          }
        }//// fun. positionBySlug
    }//// BsunessService


})();
