/**
 *
 * Applicant List Main Controller
 *
 * Iyad Bitar
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('CandidateListController', ['$scope', '$rootScope', '$stateParams', '$state', '$timeout', 'DEFAULT_PROFILE_IMAGE', 'BusinessService', 'JobApplicationService', 'AuthService', 'UserService', CandidateListController]);


  function CandidateListController($scope, $rootScope, $stateParams, $state, $timeout, DEFAULT_PROFILE_IMAGE, BusinessService, JobApplicationService, AuthService, UserService) {
    $scope.defaultImage = DEFAULT_PROFILE_IMAGE;

    /**
     * Code for layout interactivity *****************************************************
     */

    $scope.showPositionMenu = false;
    $scope.showSortMenu = false;
    $scope.sortByLabel = 'Sort By';


    $scope.togglePositionMenu = function(event){

      var handleMenuClick = function(e){
          if(true === $scope.showPositionMenu){
              $scope.showPositionMenu = false;
              $scope.$apply();
              //// unbind when menu closed no need to check for click
              $('body').unbind('click', handleMenuClick);
          }
          else{
              $scope.showPositionMenu = true;
              $scope.$apply();
          }
      };
      /**
       * the event will bubble up to body so do the work on body click \ only if menu is closed
       * this to make sure the menu is closed when click outside the menu
       */
      if(false === $scope.showPositionMenu){
          $('body').bind('click', handleMenuClick);
      }
    }//// togglePositionMenu

    $scope.toggleSortMenu = function(ev){
        var handleMenuClick = function(e){
          if(true === $scope.showSortMenu){
              $scope.showSortMenu = false;
              $scope.$apply();
              //// unbind when menu closed no need to check for click
              $('body').unbind('click', handleMenuClick);
          }
          else{
              $scope.showSortMenu = true;
              $scope.$apply();
          }
      };
      if(false === $scope.showSortMenu){
          $('body').bind('click', handleMenuClick);

          /**
           * bind click event on list items
           */
          var list = angular.element('#sortMenu').find('a');

          list.off('click').on('click', function(e){
            var me = angular.element(e.currentTarget);
            me.parent().addClass('active');
            $scope.sortBy = me.attr('data-value');
            $scope.sortByLabel = me.text();
          })
      }
    }//// fun. showSortMenu

    $scope.toggleActionMenu = function(ev, menuId){
        var menu = angular.element('#menu_' + menuId);

        var handleMenuClick = function(e){
          if(false === menu.hasClass('hidden')){
              menu.addClass('hidden');
              //// unbind when menu closed no need to check for click
              $('body').unbind('click', handleMenuClick);
          }
          else{
              menu.removeClass('hidden');
          }
      };

      if(true === menu.hasClass('hidden')){
        $('body').bind('click', handleMenuClick);
      }
    } //// fun. toggleActionMenu

    $scope.toggleFilterMenu = function(ev){
        var me = angular.element(ev.currentTarget);
        var menu = me.parent().siblings().eq(0)
        if(menu.hasClass('hidden')){
            menu.removeClass('hidden');
            me.find('i').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');
        }
        else{
            menu.addClass('hidden');
            me.find('i').removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
        }

    }//// fun. toggleFilterMenu

    /**
     * End of layout interactivity code *************************************************
     */

    $scope.filters = {};
    $scope.filters.application = {status:{value:1, op:'=='}};

    $scope.filterEngine = function(item){

      var ret = true;

      for(var key in $scope.filters){
        var str = '';
        if(key === 'application'){
          str += 'item';
        }
        for(var prop in $scope.filters[key]){

          str += "['" + prop + "']";
          str += $scope.filters[key][prop].op;
          str += $scope.filters[key][prop].value;
        }
        var result = eval(str);

        ret = ret && result

        if(false === ret){
          break;
        }
      }//// for

      return ret;
    }

    function applyFilters(){
      var ret = [];
      var list = $scope.applications;
      for(var x=0; x<list.length; x++){
        if(true === $scope.filterEngine( list[x] ) ){
          var scoreObj = $scope.scores[list[x].userId];

          list[x].score = scoreObj.scores[$scope.position.expLvl].overall;
          list[x].scoreLabel = 'great';
          ret.push(list[x]);
        }
      }
      // console.log(ret)
      $scope.filtered =  ret;
    }



    /**
     * Get Authentication
     */
    BusinessService.getBySlug($stateParams.businessSlug)
    .then(
      function(business){

        $scope.business = business;
        $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);

        $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business);

        /**
         * Check if user is logged in and move to next promise
         */
        return AuthService.getAuth();
      },
      function(err){

        $scope.dataError = true;
        return AuthService.getAuth();
      }
    )
    .then(
      function(isAuth){
        /**
         * user is logged in
         */
        $scope.isAuth = isAuth;

        return JobApplicationService.getByPositionId($scope.position._id);

      },
      function(err){
        /**
         * User in not logged in redirect to login
         */
        $scope.isAuth = false;

        /**
         * Save the current state to bring user back after login
         */
        $rootScope.nextState = {state:$state.current.name, params:$state.params};
        $state.go('account.login');

      }
    )
    .then(
      function(data){
        console.log(data)
        $scope.applications = data.applications
        $scope.applicants = data.users;
        $scope.scores = data.careerMatchScoress;
      },
      function(err){
        console.log(err)
      }
    )
    .finally(
      function(){
        initialize();
      }
    );

    function initialize(){

      /**
       * Check for data error first of all
       */
      $scope.dataError = !$scope.business || !$scope.location || !$scope.position;

      /**
       * don't continue if there is a data error
       */
      if($scope.dataError ){
        $scope.dataLoaded = true;
        return;
      }

      /**
       * if no applicants don't bother and continue
       */
      if($scope.applications.length < 1 ){

        $scope.dataLoaded = true;
        return;
      }

      applyFilters();

      /**
       * set statistic variables
       */
      $scope.updateStats = function (){
        $scope.statistics = JobApplicationService.getStatistics($scope.applications);
      }

      /**
       * Wait for some time and before showing the page
       */
      $timeout(function() {
        $scope.updateStats();
        $scope.dataLoaded = true;
      }, 200);
    }//// initialize

    $scope.getViewStatus = function(id, index){

      var app = $scope.applications[index];
      var now = Date.now();
      var appDate = new Date(app.createdAt);

      if(appDate.getTime() <= now - (86400 * 1000 * 6) ){
        return 'Aging';
      }
      return angular.isDefined(app.viewStatus) ? JobApplicationService.viewStatusLabels[app.viewStatus] : 'New';
    }

    function findAppById(appId){
      var ret;

      for(var x=0; x<$scope.applications.length; x++){
        if($scope.applications[x]._id === appId){
          ret = $scope.applications[x];
          break;
        }
      }

      return ret;
    }

    $scope.updateAppStatus = function(ev, appId, status){
      var app = findAppById(appId);
      if(app){
        app.status = status;
        JobApplicationService.save(app)
        .then(
          function(saved){
            $scope.updateStats();
            applyFilters();
          },
          function(err){
            console.log(err)
          }
        )
      }//// if app
    }

    $scope.setFilter = function(filter){
      angular.extend($scope.filters, filter);
      applyFilters();
    }

    $scope.getFitClass = function(i, score){

      var label = 'great';
      if(score < 90 && score >=70){
        label = 'good';
      }else if(score < 70 && score >= 50){
        label = 'ok';
      }else if(score < 50){
        label = 'poor';
      }
      // console.log(Math.round(score/10)-1, label, i)
      return i <= Math.round(score/10)-1 ? label : '';
    }



  }//// controller
})();
