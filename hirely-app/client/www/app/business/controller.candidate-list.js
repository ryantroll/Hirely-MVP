/**
 *
 * Applicant List Main Controller
 *
 * Iyad Bitar
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('CandidateListController', ['$scope', '$rootScope', '$stateParams', '$state', '$timeout', '$interpolate', 'DEFAULT_PROFILE_IMAGE', 'BusinessService', 'JobApplicationService', 'AuthService', 'UserService', 'PositionFiltersService', CandidateListController]);


  function CandidateListController($scope, $rootScope, $stateParams, $state, $timeout, $interpolate, DEFAULT_PROFILE_IMAGE, BusinessService, JobApplicationService, AuthService, UserService, PositionFiltersService) {
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
            // me.parent().addClass('active').siblings().removeClass('active');
            $scope.sortBy = me.attr('data-value');
            $scope.sortByLabel = me.text();

            applySort();
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
        $scope.isAuth = AuthService.isUserLoggedIn();

        return JobApplicationService.getByPositionId($scope.position._id);
      },
      function(err){

        $scope.dataError = true;
        $scope.isAuth = false;

      }
    )
    .then(
      function(data){

        // console.log(data)
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
       * Save the current state to bring user back after login
       */
      if(false === $scope.isAuth){
        $rootScope.nextState = {state:$state.current.name, params:$state.params};
        $state.go('account.login');
        return;
      }


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

      $scope.positionsList = BusinessService.getPositionsByLocation($scope.business, $scope.location._id, $scope.position._id);

      /**
       * Wait for some time and before showing the page
       */
      $timeout(function() {
        // $scope.updateStats();
        $scope.dataLoaded = true;

      }, 200);
    }//// initialize

    PositionFiltersService.addFilter('applied');
    $scope.sortBy = 'rank';
    $scope.sortByLabel = 'Rank';

    function applyFilters(){

      var ret = [];
      var list = $scope.applications;
      for(var x=0; x<list.length; x++){
        if( true === PositionFiltersService.test(list[x], $scope.applicants[list[x].userId], $scope.scores[list[x].userId]) ){
          var scoreObj = $scope.scores[list[x].userId];
          list[x].score = scoreObj.scores[$scope.position.expLvl].overall;
          ret.push(list[x]);
        }
      }

      $scope.filtered =  ret;
      updateStats();
      applySort();
    }

    /**
     * set statistic variables
     */
    function updateStats(){
      $scope.statistics = JobApplicationService.getStatistics($scope.applications);
    }

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

    function applySort(){

      $scope.filtered.sort(function(a, b){
        if($scope.sortBy === 'date'){
          var aScore = Number($scope.scores[a.userId].scores[$scope.position.expLvl].overall);
          var bScore = Number($scope.scores[b.userId].scores[$scope.position.expLvl].overall);
          return bScore - aScore;
        }
        else{
          var aTime = new Date(a.createdAt).getTime();
          var bTime = new Date(b.createdAt).getTime();
          return bTime - aTime;
        }

      });
    }//// fun. applyOrder

    $scope.updateAppStatus = function(ev, appId, status){
      var app = findAppById(appId);
      if(app){
        app.status = status;
        JobApplicationService.save(app)
        .then(
          function(saved){
            // $scope.updateStats();
            applyFilters();
          },
          function(err){
            console.log(err)
          }
        )
      }//// if app
    }

    $scope.setFilter = function(filter){
      PositionFiltersService.addFilter(filter);
      applyFilters();
    }

    $scope.isFilterActive = function(filter){
      return PositionFiltersService.isFilterActive(filter);
    }

    $scope.setSideFilter = function(ev, filter){
      var filtersDiv = angular.element('#filtersDiv');
      var aTag = angular.element(ev.currentTarget);
      var exp = $interpolate('<div class="filter-item" id="{{label}}">{{label2}} <a href="javascript:void(0);" data-id="{{label}}" class="icon glyphicon glyphicon-remove"></a></div>');
      var item = angular.element( exp({label:filter, label2:aTag.text()}) );
      item.find('a').off('click').on('click', function(ce){
        ce.preventDefault();
        var me = angular.element(ce.currentTarget);
        var filterName = me.attr('data-id');
        var toRemove = '#' + filterName;
        filtersDiv.find(toRemove).remove();

        PositionFiltersService.removeFilter(filterName);
        applyFilters();
        $scope.$apply();
      })
      if(filtersDiv.find('#'+filter).length < 1){
        filtersDiv.append(item);

        PositionFiltersService.addFilter(filter);
        applyFilters();
      }

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

    $scope.clearSideFilters = function(){
      var filtersDiv = angular.element('#filtersDiv');
      filtersDiv.children().each(function(){
        var item = angular.element(this);
        var filterName = item.attr('id');
        var toRemove = '#' + filterName;
        filtersDiv.find(toRemove).remove();

        PositionFiltersService.removeFilter(filterName);
      });
      applyFilters();
    }

    $scope.changePosition = function(posSlug){
      $state.go('business.candidateList', {businessSlug:$scope.business.slug, locationSlug: $scope.location.slug, positionSlug:posSlug})
    }

    $scope.goToPosition = function(){
      $state.go('job.position', {businessSlug:$scope.business.slug, locationSlug: $scope.location.slug, positionSlug:$scope.position.slug})
    }

    $scope.copyPositionURL = function(){
      var url = angular.element('#positionURL').val();
      window.prompt("Copy to clipboard: Press Ctrl+C or Cmd+C on Mac then Enter", url);
    }

  }//// controller
})();
