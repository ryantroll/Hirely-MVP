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
          // businessRef.push(obj);
        }

        this.getWorkTypeTitle = function(type){
          var types = [
            {name:'part-time', title:'Part Time'},
            {name:'full-time', title:'Full Time'},
            {name:'seasonal', title:'Seasonal'},
            {name:'exempt', title:'Exempt'}
          ];
          var ret = null;
          var limit = types.length;
          for(var x=0; x < limit; x++){
            if(types[x].name === type){
              ret = types[x].title;
              break;
            }
          }
          return ret;
        }//// fun. getWorkTypeTitle

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
