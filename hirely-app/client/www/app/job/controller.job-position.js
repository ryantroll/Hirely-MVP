/**
 * Created by Iyad Bitar on 02/29/2016.
 */
(function () {
    'use strict';

  angular.module('hirelyApp.job').controller('JobPositionController', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$sce', '$window', '$location', '$anchorScroll', 'BusinessService', 'AvailabilityService', 'FavoritesService', 'AuthService', 'UserService', 'JobApplicationService', JobPositionController])
      .directive('validatePhone', function () {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function (scope, ele, attrs, ctrl) {
            ctrl.$parsers.unshift(function (value) {
              var pat = /^((\(\d{3}\))|(\d{3})) ?\d{3}(\-| )?\d{4}$/;

              if (false === pat.test(value)) {
                ctrl.$setValidity('invalidPhone', false);
                return value;
              }

              ctrl.$setValidity('invalidPhone', true);
              return value;
            });/// unshift
          }//// fun. link
        }/// return object
      })/// validate date;

  function JobPositionController($scope, $rootScope, $state, $stateParams, $timeout, $sce, $window, $location, $anchorScroll, BusinessService, AvailabilityService, FavoritesService, AuthService, UserService, JobApplicationService) {

    BusinessService.getBySlug($stateParams.businessSlug)
    .then(
      function(business){

        $scope.business = business;
        $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);

        $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business);


        if (AuthService.currentUserId && $rootScope.addFavoriteAfterLogin == true) {
          $scope.favoriteClick();
        }

        initialize();
      }
    );



    var sideBar = angular.element('#sideBar');
    var stickyHeader = angular.element('#stickyHeader');
    var posDetails = angular.element('#posDetails');


    function posWindowScroll(e){
      var diff = posDetails.offset().top - $(e.target).scrollTop();

      if(  diff <= 0 ){
        if( !stickyHeader.hasClass('show') ){
          stickyHeader.addClass('show');
        }

        /**
         * Don't make the sidebar sticky if it increase the height more than the the details height
         * -28 because the last box in details has margin bottom and this make sidebar stop at right position
         */
        if(
          sideBar.height()+Math.abs(diff) <= posDetails.height() - 28
          && angular.element('#wageBox').css('display') !== 'none'
        ){
          sideBar.css('padding-top', Math.abs(diff) + 'px');
        }

      }
      else{
        if( stickyHeader.hasClass('show') ){
          stickyHeader.removeClass('show');
          sideBar.css('padding-top', '');
        }
      }

    }//// fun. posWindowScroll

    function initialize(){

      /**
       * Check for data error first of all
       */
      $scope.dataError = !$scope.business || !$scope.location || !$scope.position;

      /**
       * don't continue if there is a data error
       */
      if($scope.dataError){
        $scope.dataLoaded = true;
        return;
      }

      var textAreaQs= [];
      var booleanQs = [];
      $scope.position.prescreenQuestions.forEach(function(q) {
        if (q.type == "textarea") {
          textAreaQs.push(q);
        } else if (q.type == "boolean") {
          booleanQs.push(q);
        } 
      });

      $scope.application = {
        user: {email:'', firstName:'', lastName:'', mobile:''},
        positionId: $scope.position._id,
        textAreaQs: textAreaQs,
        booleanQs: booleanQs,
        preferences: {
          communications: {
            preferredMode: null
          }
        }
      };


      $scope.heroImageURL = $scope.location.heroImageURL ? $scope.location.heroImageURL : $scope.business.heroImageURL;
      $scope.businessDescriptionHtml = $sce.trustAsHtml($scope.business.description);
      $scope.positionDescriptionHtml = $sce.trustAsHtml($scope.position.description);


      $scope.numOfBenefits = getNumOfBenefits();
      $scope.workTypeTitle = BusinessService.getWorkTypeTitle($scope.position.workType);

      /**
       * [aggregatedWeekTimes will hold array of location operation hours]
       * @type {[Array]}
       */
      $scope.aggregatedWeekTimes = AvailabilityService.getWeeklyAggregatedArray($scope.location.hoursOfOperation);

      /**
       * [otherPositions this will hold an array of position be be displayed in sidebar]
       * @type {Array}
       */
      $scope.otherPositions = [];

      /**
       * [strOccIds will hold an array of ALL occupations that we need to retrieve the display data form them icon and color ]
       * @type {Array}
       */
      var strOccIds = [];

      /**
       * Loop through the positions and build the other position array and array of occupations IDs
       */
      for(var pos in $scope.business.positions){
        strOccIds.push($scope.business.positions[pos].occId);
        //// add position in same location only
        if(
          $scope.business.positions[pos].locationId === $scope.location._id
          && $scope.business.positions[pos]._id !== $scope.position._id
        ){
          $scope.otherPositions.push($scope.business.positions[pos]);
        }
      }

      /**
       * Get the icons and colors data for all occupations needed for this page
       */
      BusinessService.getPositionDisplayData(strOccIds.join('|'))
      .then(
        function(iconData){
          $scope.iconData = iconData;
        },
        function(error){
          console.log(error)
        }
      );




      /**
       * Wait for some time and before showing the page
       */
      $timeout(function() {
        $scope.dataLoaded = true;

        $timeout(function() {
          var heroHeight = $('.hero').height();
          var heroImgHeight = $('.hero img').height();
          if (heroImgHeight - heroHeight) {
            $('.hero img').css('margin-top', -(heroImgHeight - heroHeight)/2)
          }
        })

      }, 200);


      /**
       * if user logged in get the distance
       */
      if(AuthService.currentUserId){
        /**
         * find if user favorite this job
         */
        FavoritesService.getFavorite({type:'position', userId:AuthService.currentUserId, positionId: $scope.position._id})
        .then(
          function(found){
            if(Array.isArray(found) && found.length > 0){
              $scope.thisPositionFav = found[0];
            }
          },
          function(err){
            console.log(err)
          }
        );//// .then

      }//// if isAuth


      /**
       * Bind the scroll event of the page
       */
      angular.element(window).on('scroll', posWindowScroll)
    }//// fun. initialize

    /**
     * [getNumOfBenefits will return the number of benefits that is set to true]
     * @return {[Number]} [description]
     */
    var getNumOfBenefits = function(){
      var numOfBenefits = 0;
      for(var ben in $scope.position.benefits){

        if(true === $scope.position.benefits[ben]) ++numOfBenefits;
      }
      return numOfBenefits;
    }; //// fun. numOfBenefits

    $scope.applyClick = function(){
      // $state.go('master.application.apply', {businessSlug:$scope.business.slug, locationSlug:$scope.location.slug, positionSlug:$scope.position.slug});
      $scope.applyClicked = true;
      $timeout(function() {
        $location.hash("application");
        var yOffset = $(document).width() > 768 ? 50 : 80;
        var y = $("#application").offset().top - yOffset;
        $("html, body").animate({ scrollTop: y }, "slow");
      });

      if(!AuthService.currentUserId){
        $window.ga('send', 'pageview', { page: $location.url() });
      }

    };

    /**
     * [formatPhone Will set the right format for phone while the user typing in]
     */
    $scope.formatPhone = function () {
      var newVal = $scope._mobile;

      if (newVal === false || angular.isUndefined(newVal)) return;

      $scope._mobile = UserService.formatPhone(newVal);

      // Android doesn't move the cursor to the end of the input when we change it, so re-focus
      $("#email").focus();
      $("#mobile").focus();

    };

    $scope.otherPositionClick = function(slug){
      $state.go('master.default.job.position', {businessSlug:$scope.business.slug, locationSlug:$scope.location.slug, positionSlug:slug});
    };

    /**
     * [getWorkTypeTitle will return the work type in a displayable way like part-time -> Part Time]
     * @param  {[String]} type [the work type that is saved in DB]
     * @return {[String]}      [description]
     */
    $scope.getWorkTypeTitle = function(type){
      return BusinessService.getWorkTypeTitle(type);
    };

    /**
     * [getPositionIcon this function will be called from template to get the display property needed for each position based on occupation id]
     * @param  {[String]} occId    [onet occupation id for the position ]
     * @param  {[String]} property [the property of display object needed e.g. icon, cssClass, iconColor]
     * @return {[String]}          [description]
     */
    $scope.getPositionIcon = function(occId, property){

      if(!occId || !Array.isArray($scope.iconData)){
        return null;
      }
      var icon;
      for(var x=0; x<$scope.iconData.length; x++){
          if($scope.iconData[x].occId == occId){
            icon = $scope.iconData[x];
            break;
          }
      }/// for

      if(angular.isDefined(icon) && angular.isDefined(icon.icon)){
        return icon.icon;
      }
      return null;
    }//// fun. getIcon

    $scope.favoriteClick = function(){
      if(AuthService.currentUserId){
        var favObj = {
          userId: AuthService.currentUserId,
          positionId: $scope.position._id,
          locationId: $scope.location._id,
          businessId: $scope.business._id,
          type: 'position'
        };

        FavoritesService.updateFavorite(favObj)
        .then(
          function(obj){
            if(angular.isDefined(obj._id)){
              //// favorite is added
              $scope.thisPositionFav = obj;
            }
            else if(angular.isDefined(obj.deleted)){
              //// favorite is deleted
              delete $scope.thisPositionFav;
            }
          }
        );/// .then

        $rootScope.addFavoriteAfterLogin = false;
      }//// if CurrrentId
      else{
        /**
         * user is not logged in redirect to login page after saving the current state in rootScope
         * LoginController will detect this rootScope object and redirect back after login
         */
        $rootScope.nextState.push({state:$state.current.name, params:$state.params});
        $rootScope.addFavoriteAfterLogin = true;
        $state.go('master.default.account.loginWithMessage', {message: "Please login to favorite a business."});
      }
    }; //// fun. favorite click

    $scope.registerPasswordUser = function() {

      $scope.applicationBlocked = true;

      if (!$scope.applicationForm.$valid) {
        return null;
      }

      $scope.application.booleanQs.forEach(function(q) {
        if (!q.answer) {
          q.answer = false;
        }
      });

      $scope.application.user.mobile = '+1.' + UserService.clearPhoneFormat($scope._mobile);

      var application = {
        user: $scope.application.user,
        positionId: $scope.position._id,
        prescreenAnswers: $scope.application.textAreaQs.concat($scope.application.booleanQs)
      };

      JobApplicationService.create(application)
          .then(
              function () {
                console.log("Application accepted");
                $state.go('master.default.confirm', $stateParams);
              },//// save resolve
              function (err) {
                console.log(err);
                alert('Error while saving your application: '+err);
                $scope.applicationBlocked.false;
              }//// save reject
          );//// save().then()

    }//// fun. registerPasswrodUser


  }//// fun. JobController

 })();
