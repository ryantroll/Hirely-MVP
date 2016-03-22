/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  var hirelyApp = angular.module('hirelyApp').controller('ProfileEducationController', ['$scope', '$stateParams', '$filter', '$timeout', 'AuthService', 'UserService', 'StatesNames', 'JobApplicationService', ProfileEducationController]);

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

  function ProfileEducationController($scope, $stateParams, $filter, $timeout, AuthService, UserService, StatesNames, JobApplicationService) {



    /**
     * [orderBy this filter will be used to order the work experience and education array by dateStart]
     */
    var orderBy = $filter('orderBy');

    $scope.stepTwoLoaded = false;

    $scope.programTypes = JobApplicationService.educationPrograms;


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

            item.currentlyEnrolled = !item.isCompleted;

            if(item.isCompleted){
              item.dateEnd = new Date(item.dateEnd);
              item.dateEndYear = item.dateEnd.getFullYear();
              item.dateEndMonth = String(item.dateEnd.getMonth() + 1);
            }
            else{
              //// make now the end date if not completed
              // item.dateEnd = new Date();
            }


          });//// for each

          $scope.eduItems = orderBy(founded.education, 'dateEnd', true);
        }//// if isArray(eduction)

        $timeout(function(){
          if(!$scope.stepOneLoaded){
            $scope.stepTwoLoaded = true;
          }
        }, 1000);/// $timeout

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

        if(angular.isDefined($scope.editIndex)){

          if(true !== $scope.education.currentlyEnrolled){
            $scope.education.dateEnd = new Date(Number($scope.education.dateEndYear), Number($scope.education.dateEndMonth)-1, 1);
          }

          $scope.education.isCompleted = !$scope.education.currentlyEnrolled;

          angular.extend($scope.eduItems[$scope.editIndex], $scope.education);

          $scope.occupation = {};
          delete $scope.editIndex;

          $scope.stepTwoE.$setUntouched();
          $scope.stepTwoE.$setPristine();

          $scope.addEducationForm = false;
          return;
        }/// if edit

        var newEdu = angular.copy($scope.education);

        if(true !== newEdu.currentlyEnrolled){
          newEdu.dateEnd = new Date(Number(newEdu.dateEndYear), Number(newEdu.dateEndMonth)-1, 1);
        }

        newEdu.isCompleted = !newEdu.currentlyEnrolled;

        $scope.eduItems.push(newEdu);

        $scope.eduItems = orderBy($scope.eduItems, 'dateEnd', true);


        $scope.education = {};

        $scope.stepTwoE.$setUntouched();
        $scope.stepTwoE.$setPristine();

        $scope.addEducationForm = false;
      }

      /**
       * [fixFormDiv will set the form div to window height and scroll page to top
       * form is shown as an overlay and should cover the whole screen]
       * @return {null}
       */
      function fixFormDiv(){
        var formDiv = $('#expFormDiv');
        $(window).scrollTop(0);
        /**
         * Add some delay so we can read the height property after div is added to dom
         */
        setTimeout(function(){
          if(formDiv.height() < $(document).height()){
            formDiv.height($(document).height());
          }
        },100)
      }

      /**
       * [removeEducation will remove one education entry from education list Array by entry index]
       * @param  {Number} index [index of array to be removed]
       * @return {[type]}       [description]
       */
      $scope.removeEducation = function(index){
        $scope.eduItems.splice(index, 1);
      }

      $scope.editEducation = function(index){
        $scope.education = angular.copy($scope.eduItems[index]);
        $scope.editIndex = index;
        $scope.addEducationForm = true;

        fixFormDiv();
      }

      /**
       * [cancelJobXp will be trigger when cancel is clicked in form, will reset the form and clear the required variables]
       * @return {null} [description]
       */
      $scope.cancelEducation = function(){
        $scope.education={};

        delete $scope.editIndex;

        $scope.stepTwoE.$setUntouched();
        $scope.stepTwoE.$setPristine();

        $scope.addEducationForm=false;
      }//// fun. cancelJobXp

      /**
       * [showJobXp will be triggered when "Add Experinece" clicked to show the form and set the required vars]
       * @return {null} [description]
       */
      $scope.showEducation = function(){
        $scope.education={};
        delete $scope.editIndex;
        $scope.addEducationForm=true;

        fixFormDiv();
      }//// fun. ShowJobXp

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
              var toSave = {education:angular.copy($scope.eduItems)};
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