/**
 *
 * Applicant List Main Controller
 *
 * Iyad Bitar
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('CandidateListController', ['$scope', '$stateParams', '$state', '$timeout', '$interpolate', '$uibModal', 'DEFAULT_PROFILE_IMAGE', 'BusinessService', 'JobApplicationService', 'PositionFiltersService', CandidateListController]);


  function CandidateListController($scope, $stateParams, $state, $timeout, $interpolate, $uibModal, DEFAULT_PROFILE_IMAGE, BusinessService, JobApplicationService, PositionFiltersService) {
    $scope.defaultImage = DEFAULT_PROFILE_IMAGE;

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

    $scope.toggleStatusMenu = function(){
      var menu = angular.element('#statusBtns');

      var handleMenuClick = function(e){
          if(false === menu.hasClass('show')){
              menu.addClass('show');
              //// unbind when menu closed no need to check for click

          }
          else{
              menu.removeClass('show');
              $('body').unbind('click', handleMenuClick);
          }
      };

      if(false === menu.hasClass('show')){
        $('body').bind('click', handleMenuClick);
      }
    }//// fun. toggleStatusMenu

    angular.element(window).on('scroll', function(ev){
      var top = $(ev.currentTarget).scrollTop();
      var pad = 0;

      var filters = $('#filtersList')

      var limit = filters.offset().top;

      if(top >= limit){
        $('#mobile-nav').css({'position':'fixed', 'z-index': 1501, 'top': 0, 'width':'100%'})
        .parent().css('padding-top', 60);

        $('#subHeader').css({'position':'fixed', 'z-index': 1500, 'top': 60})
        .parent().css('padding-top', 60);

        pad = top - limit;
      }
      else{
        $('#mobile-nav').css({'position':'static'})
        .parent().css('padding-top', '');

        $('#subHeader').css({'position':'static'})
        .parent().css('padding-top', '');
      }

      // $('#filtersList').css('padding-top', pad);
    })

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
        return JobApplicationService.getByPositionId($scope.position._id);
      },
      function(err){
        $scope.dataError = err;
      }
    )
    .then(
      function(appData){
        if (appData) {
          $scope.applications = appData.applications;
          $scope.applicants = appData.users;
          $scope.scores = appData.careerMatchScoress;
        } else {
          $scope.dataError = "No applications found.";
        }
      },
      function(err){
        console.log(err);
        $scope.dataError = err;
      }
    )
    .finally(
      function(){

        initialize();
      }
    );

    function initialize(){

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
      for(var x=0; x<list.length; x++) {
        var scoreObj = $scope.scores[list[x].userId];
        var userObj = $scope.applicants[list[x].userId];

        if (!scoreObj) {
          console.log("CandidateList:applyFilters:error:0: user "+list[x].userId+" was not found in $scope.scores.  AppId: " + list[x]._id);
          continue;
        }
        if (!userObj) {
          console.log("CandidateList:applyFilters:error:1: user "+list[x].userId+" was not found in $scope.applicants.  AppId: " + list[x]._id);
          continue;
        }

        if( true === PositionFiltersService.test(list[x], userObj, scoreObj) ){
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

      var app = angular.copy($scope.applications[index]);
      var now = Date.now();
      var appDate = new Date(app.createdAt);

      if(angular.isDefined(app.viewStatus)){
        return JobApplicationService.viewStatusLabels[app.viewStatus];
      }
      else if(appDate.getTime() <= now - (86400 * 1000 * 6) ){
        /**
         * update view status to aging
         */
        app.viewStatus = 2;
        JobApplicationService.save(app).
        then(
          function(app){
            $scope.applications[index] = app;
          },
          function(err){
            console.log(err);
          }
        )
        return 'Aging';
      }

      return 'New';



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
        if($scope.sortBy === 'rank'){
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
        if(angular.isDefined($scope.detailsApp)){
          $scope.detailsApp.status = status;
        }
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
      $state.go('master.default.business.candidateList', {businessSlug:$scope.business.slug, locationSlug: $scope.location.slug, positionSlug:posSlug})
    }

    $scope.goToPosition = function(){
      $state.go('master.default.job.position', {businessSlug:$scope.business.slug, locationSlug: $scope.location.slug, positionSlug:$scope.position.slug})
    }

    $scope.copyPositionURL = function(){
      var url = angular.element('#positionURL').val();
      window.prompt("Copy to clipboard: Press Ctrl+C or Cmd+C on Mac then Enter", url);
    }

    $scope.showDetails = function(index, userId, app){
      $scope.detailsUserId = userId;
      $scope.detailsIndex = index;
      $scope.detailsApp = app;

      var scoreObj = $scope.scores[userId];
      $scope.detailsApp.score = scoreObj.scores[$scope.position.expLvl].overall;

      var detailsModal  = $uibModal.open({
        size:'full',
        controller: 'CandidateDetailsModalController',
        templateUrl: 'app/business/candidate-details.tpl.html',
        windowClass: 'gray',
        scope:$scope
      })

      /**
       * Resolved when modal successfully open
       */
      detailsModal.opened
      .then(
        function(result){
          if(true === result){
            /**
             * Update the viewStats of the application to viewed
             */
            var appToSave = angular.copy(app);
            appToSave.viewStatus = 1;
            JobApplicationService.save(appToSave).
            then(
              function(app){
                  $scope.applications[index] = app;
              },
              function(err){
                console.log(err);
              }
            )
          }//// if
        },
        function(err){
          console.log(err)
        }
      )
      /**
       * Resolved when modal closed
       */
      detailsModal.result
      .then(
        function(d){

        },
        function(err){

        }
      )
    }



  }//// controller
})();
