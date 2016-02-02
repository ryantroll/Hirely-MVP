/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  var hirelyApp = angular.module('hirelyApp').controller('StepTwoEController', ['$scope', '$stateParams', '$filter', 'AuthService', 'UserService', 'StatesNames', StepTwoEController]);

  hirelyApp.directive('validateMonth', function(){
    return {
      restrict:'A',
      require:'ngModel',
      link:function(scope, ele, attrs, ctrl){
        ctrl.$parsers.unshift(function(value){
          var m = Number(value);
          var valid = undefined !== m && NaN !== m && m < 13 && m > 0;
          ctrl.$setValidity('invalidMonth', valid)

          return valid ? value : undefined;
        });/// unshift
      }//// fun. link
    }/// return object

  })/// validate month
  .directive('validateYear', function(){
    return {
      restrict:'A',
      require:'ngModel',
      link:function(scope, ele, attrs, ctrl){
        ctrl.$parsers.unshift(function(value){
          var m = Number(value);
          var now = new Date();
          var valid = undefined !== m && NaN != m && m <= now.getFullYear() && m >= 1940;
          ctrl.$setValidity('invalidYear', valid);

          return valid ? value : undefined;
        });/// unshift
      }//// fun. link
    }/// return object

  })/// validate year

  function StepTwoEController($scope, $stateParams, $filter, AuthService, UserService, StatesNames) {



    /**
     * [orderBy this filter will be used to order the work experience and education array by dateStart]
     */
    var orderBy = $filter('orderBy');

    $scope.stepTwoLoaded = false;

    $scope.programTypes = ['High School Equivalent', 'Associates', 'Bachelors', 'Masters', 'PhD'];

    $scope.states = StatesNames;

    $scope.months = [
      {order:1, name:'Jan'},
      {order:2, name:'Feb'},
      {order:3, name:'Mar'},
      {order:4, name:'Apr'},
      {order:5, name:'May'},
      {order:6, name:'Jun'},
      {order:7, name:'Jul'},
      {order:8, name:'Aug'},
      {order:9, name:'Sep'},
      {order:10, name:'Oct'},
      {order:11, name:'Nov'},
      {order:12, name:'Dec'}
    ];

    /**
     * [eduItems will hold the education data]
     * @type {Array}
     */
    $scope.eduItems = [];

    /**
     * [education will hold a single education data and serve as angular data model
     * this object get filled while user filling the form and cleard after users add it to list of education]
     * @type {Object}
     */
    $scope.education = {};




    UserService.getUserCompleteFields(AuthService.currentUserID, ['education'])
    .then(
      function(founded){


        if(Array.isArray(founded.education) ){
          /**
           * list of education is found for this user
           */
          angular.forEach(founded.education, function(item){
            item.dateStart = new Date(item.dateStart);
            item.dateStartYear = item.dateStart.getFullYear();
            item.dateStartMonth = item.dateStart.getMonth() + 1;

            if(angular.isDefined(item.dateEnd) ){
              item.dateEnd = new Date(item.dateEnd);
              item.dateEndYear = item.dateEnd.getFullYear();
              item.dateEndMonth = item.dateEnd.getMonth() + 1;
            }

          });//// for each

          $scope.eduItems = orderBy(founded.education, 'dateStart', true);
        }//// if isArray(eduction)

        /**
         * Set step validity if user already has education and experienc
         */
        // $scope.$setValidity($scope.eduItems.length > 0 && $scope.xpItems.length > 0);
        $scope.stepTwoLoaded = true;
      },
      function(err){
        //// console.log(err);
        $scope.stepTwoLoaded = true;
      }
    );//// then






      /**
       * [addEducation will save education form to education list, order the education by dateStart and clear the form for next save
       * this function will be trigger by click of "Save Education" button ]
       */
      $scope.addEducation = function(){
        if(!$scope.stepTwoE.$valid) return null;

        var newEdu = angular.copy($scope.education);

        newEdu.dateStart = new Date(Number(newEdu.dateStartYear), Number(newEdu.dateStartMonth)-1, 1);

        if(true !== newEdu.currentlyEnrolled){
          newEdu.dateEnd = new Date(Number(newEdu.dateEndYear), Number(newEdu.dateEndMonth)-1, 1);
        }

        newEdu.isOnline = !!newEdu.isOnline;

        newEdu.isCompleted = !newEdu.currentlyEnrolled;

        $scope.eduItems.push(newEdu);

        $scope.eduItems = orderBy($scope.eduItems, 'dateStart', true);

        $scope.education = {};

        $scope.stepTwoE.$setUntouched();
        $scope.stepTwoE.$setPristine();

        /**
         * Update step validity
         */
        // $scope.$setValidity($scope.eduItems.length > 0 && $scope.xpItems.length > 0);
      }

      /**
       * [removeEducation will remove one education entry from education list Array by entry index]
       * @param  {Number} index [index of array to be removed]
       * @return {[type]}       [description]
       */
      $scope.removeEducation = function(index){
        $scope.eduItems.splice(index, 1);

        /**
         * Update step validity
         */
        // $scope.$setValidity($scope.eduItems.length > 0 && $scope.xpItems.length > 0);
      }

      /**
       * Watch education dates to make sure end data is greater than start date
       */
       $scope.$watchCollection('[education.dateStartYear, education.dateStartMonth, education.dateEndYear, education.dateEndMonth]', function(newValues, oldVaues){
          var start = new Date(Number(newValues[0]), Number(newValues[1])-1, 1);
          var end = new Date(Number(newValues[2]), Number(newValues[3])-1, 1);

          /**
           * check if end date is less than start date
           */
          if(true !== $scope.education.currentlyEnrolled && !isNaN(start.getTime() ) && !isNaN(end.getTime() ) ){
            $scope.stepTwoE.eduDateEndY.$setValidity('invalidEndDate', end > start);
            $scope.stepTwoE.eduDateEndM.$setValidity('invalidEndDate', end > start);
          }

          /**
           * Check for date conflicts with previous dates
           */
          if(Array.isArray($scope.eduItems))
          for(var x=0; x<$scope.eduItems.length; x++){
            /**
             * check if start date in a middle of range
             */
            if(start >= $scope.eduItems[x].dateStart && start < $scope.eduItems[x].dateEnd){
              $scope.stepTwoE.eduDateStartY.$setValidity('startDateConflict', false);
              $scope.stepTwoE.eduDateStartM.$setValidity('startDateConflict', false);
              $scope.eduItems[x].conflict = true;
              break;
            }
            else{
              $scope.stepTwoE.eduDateStartY.$setValidity('startDateConflict', true);
              $scope.stepTwoE.eduDateStartM.$setValidity('startDateConflict', true);
              $scope.eduItems[x].conflict = false;
            }

            /**
             * check if end date in a middle of range
             */
            if(end > $scope.eduItems[x].dateStart && end <= $scope.eduItems[x].dateEnd){
              $scope.stepTwoE.eduDateEndY.$setValidity('endDateConflict', false);
              $scope.stepTwoE.eduDateEndM.$setValidity('endDateConflict', false);
              $scope.eduItems[x].conflict = true;
              break;
            }
            else{
              $scope.stepTwoE.eduDateEndY.$setValidity('endDateConflict', true);
              $scope.stepTwoE.eduDateEndM.$setValidity('endDateConflict', true);
              $scope.eduItems[x].conflict = false;
            }

            /**
             * Check if new rang is overlap one old range
             */
            if(start <= $scope.eduItems[x].dateStart && end >= $scope.eduItems[x].dateEnd){

              $scope.stepTwoE.eduDateEndY.$setValidity('endDateConflict', false);
              $scope.stepTwoE.eduDateEndM.$setValidity('endDateConflict', false);

              $scope.stepTwoE.eduDateStartY.$setValidity('startDateConflict', false);
              $scope.stepTwoE.eduDateStartM.$setValidity('startDateConflict', false);
              $scope.eduItems[x].conflict = true;
              break;
            }
            else{

              $scope.stepTwoE.eduDateEndY.$setValidity('endDateConflict', true);
              $scope.stepTwoE.eduDateEndM.$setValidity('endDateConflict', true);
              $scope.stepTwoE.eduDateStartY.$setValidity('startDateConflict', true);
              $scope.stepTwoE.eduDateStartM.$setValidity('startDateConflict', true);
              $scope.eduItems[x].conflict = false;
            }

          }//// for
       });//// $watch


      /**
       * Save the entries to database on scope destroy]
       */
      $scope.$on('$destroy', function(){
        /**
         * Make sure user is authenticated
         */
        AuthService.getAuth()
        .then(
          function(isAuth){
            /**
             * User is authenticated
             * do save
             */
            if(isAuth){
              var toSave = {
                education:angular.copy($scope.eduItems)
              };
              UserService.saveUser(toSave, AuthService.currentUserID)
              .then(
                function(user){
                  // console.log(user);
                },
                function(err){
                  alert("Error!\nYour data was not saved, please try again.")
                  console.log(err);
                }
              )
            }//// if isAuth
            else{

            }//// if isAuth else
          }//// reslove
        )//// getAuth.then()
      })/// $on.$destroy

  }
})();