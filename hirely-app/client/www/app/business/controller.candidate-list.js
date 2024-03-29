/**
 *
 * Applicant List Main Controller
 *
 * Iyad Bitar
 */
(function () {
    'use strict';

    angular.module('hirelyApp').controller('CandidateListController', ['$scope', '$stateParams', '$state', '$timeout', '$interpolate', '$uibModal', 'DEFAULT_PROFILE_IMAGE', 'BusinessService', 'JobApplicationService', 'PositionFiltersService', 'AuthService', CandidateListController]);


    function CandidateListController($scope, $stateParams, $state, $timeout, $interpolate, $uibModal, DEFAULT_PROFILE_IMAGE, BusinessService, JobApplicationService, PositionFiltersService, AuthService) {
        $scope.defaultImage = DEFAULT_PROFILE_IMAGE;

        $scope.showPositionMenu = false;
        $scope.showSortMenu = false;
        $scope.sortByLabel = 'Sort By';

        $scope.AuthService = AuthService;
        $scope.JobApplicationService = JobApplicationService;

        /**
         * [occIds array to save the occupation ids for all work experiences]
         * This array will be used to load the ONet icon display data to show the work category for each position
         * @type {Array}
         */
        var occIds = [];

        $(document).on('mouseenter', ".candidate-v2", function() {
            $(this).find(".card-no-hover").css('visibility', 'hidden');
            $(this).find(".card-hover").show();
        });
        $(document).on('mouseleave', ".candidate-v2", function() {
            $(this).find(".card-hover").hide();
            $(this).find(".card-no-hover").css('visibility', 'visible');
        });
        

        $scope.togglePositionMenu = function (event) {

            var handleMenuClick = function (e) {
                if (true === $scope.showPositionMenu) {
                    $scope.showPositionMenu = false;
                    $scope.$apply();
                    //// unbind when menu closed no need to check for click
                    $('body').unbind('click', handleMenuClick);
                }
                else {

                    $scope.showPositionMenu = true;
                    $scope.$apply();
                }
            };
            /**
             * the event will bubble up to body so do the work on body click \ only if menu is closed
             * this to make sure the menu is closed when click outside the menu
             */
            if (false === $scope.showPositionMenu) {
                $('body').bind('click', handleMenuClick);
            }
        }//// togglePositionMenu

        $scope.toggleSortMenu = function (ev) {
            var handleMenuClick = function (e) {
                if (true === $scope.showSortMenu) {
                    $scope.showSortMenu = false;
                    $scope.$apply();
                    //// unbind when menu closed no need to check for click
                    $('body').unbind('click', handleMenuClick);
                }
                else {
                    $scope.showSortMenu = true;
                    $scope.$apply();
                }
            };
            if (false === $scope.showSortMenu) {
                $('body').bind('click', handleMenuClick);

                /**
                 * bind click event on list items
                 */
                var list = angular.element('#sortMenu').find('a');

                list.off('click').on('click', function (e) {
                    var me = angular.element(e.currentTarget);
                    // me.parent().addClass('active').siblings().removeClass('active');
                    $scope.sortBy = me.attr('data-value');
                    $scope.sortByLabel = me.text();

                    applySort();
                })
            }
        }//// fun. showSortMenu

        $scope.toggleActionMenu = function (ev, menuId) {
            var menu = angular.element('#menu_' + menuId);

            var handleMenuClick = function (e) {
                if (false === menu.hasClass('hidden')) {
                    menu.addClass('hidden');
                    //// unbind when menu closed no need to check for click
                    $('body').unbind('click', handleMenuClick);
                }
                else {
                    menu.removeClass('hidden');
                }
            };

            if (true === menu.hasClass('hidden')) {
                $('body').bind('click', handleMenuClick);
            }
        } //// fun. toggleActionMenu

        $scope.toggleFilterMenu = function (ev) {
            var me = angular.element(ev.currentTarget);
            var menu = me.siblings().eq(0);


            if (menu.hasClass('hidden')) {
                ///// close all menus before opening the new one
                $('.jsFiltersList').addClass('hidden');
                $('.jsFiltersListBtn').find('i').addClass('glyphicon-menu-down').removeClass('glyphicon-menu-up');

                menu.removeClass('hidden');
                me.find('i').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');
            }
            else {
                menu.addClass('hidden');
                me.find('i').removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
            }

        }//// fun. toggleFilterMenu

        $scope.toggleStatusMenu = function () {
            var menu = angular.element('#statusBtns');

            var handleMenuClick = function (e) {
                if (false === menu.hasClass('show')) {
                    menu.addClass('show');
                    //// unbind when menu closed no need to check for click

                }
                else {
                    menu.removeClass('show');
                    $('body').unbind('click', handleMenuClick);
                }
            };

            if (false === menu.hasClass('show')) {
                $('body').bind('click', handleMenuClick);
            }
        }//// fun. toggleStatusMenu

        var docOriginalHeight = $(document).height();
        angular.element(window).on('scroll', function (ev) {
            var top = $(ev.currentTarget).scrollTop();
            var pad = 0;

            var filters = $('#filtersList')
            if (filters.length < 1) {

                return;
            }

            var limit = filters.offset().top;

            if (top >= limit) {
                $scope.isHeaderFixed = true;

                $('#mobile-nav').css({'position': 'fixed', 'z-index': 1501, 'top': 0, 'width': '100%'})
                    .parent().css('padding-top', 60);

                $('#subHeader').css({'position': 'fixed', 'z-index': 1500, 'top': 60})
                    .parent().css('padding-top', 60);

                pad = top - limit + 60 + 60 + 14;

                if (pad >= docOriginalHeight) {
                    pad = docOriginalHeight;
                }
            }
            else {
                $scope.isHeaderFixed = false;

                $('#mobile-nav').css({'position': 'static'})
                    .parent().css('padding-top', '');

                $('#subHeader').css({'position': 'static'})
                    .parent().css('padding-top', '');
            }

            $('#filtersList').css({'position': 'relative', 'padding-top': pad});


        })

        /**
         * End of layout interactivity code *************************************************
         */


        /**
         * Get Authentication
         */
        BusinessService.getBySlug($stateParams.businessSlug)
            .then(
                function (business) {

                    $scope.business = business;
                    $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);
                    $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business);
                    return JobApplicationService.getByPositionId($scope.position._id);
                },
                function (err) {
                    $scope.dataError = err;
                }
            )
            .then(
                function (appData) {
                    if (appData) {
                        $scope.applications = appData.applications;
                        $scope.applicants = appData.users;
                        $scope.scores = appData.careerMatchScoress;
                        // console.log($scope.scores);

                        Object.keys($scope.applicants).forEach(function (key) {
                            $scope.applicants[key].workExperience.forEach(function (work) {
                                work.monthCount = $scope.getDateDif(work);
                                occIds.push(work.occId);
                            });

                        });

                        Object.keys($scope.applications).forEach(function (key) {
                            var app = $scope.applications[key];

                            for (var i=app.history.length-1; i>=0; i--) {
                                var h = app.history[i];
                                h.age = $scope.getAgeFromDateStr(h.time);

                                if (h.type == "StatusChange") {
                                    app.lastStatusChange = h;
                                }
                            }

                        });

                        if(occIds.length > 0){
                            return BusinessService.getPositionDisplayData(occIds.join('|'));
                        }

                    } else {
                        $scope.dataError = "No applications found.";
                    }
                },
                function (err) {
                    console.log(err);
                    $scope.dataError = err;
                }
            )
            .then(
                function(iconData){
                    $scope.iconData = iconData;
                    return BusinessService.getPositionOccupationMetas($scope.position.occId)
                },
                function(error){
                  console.log(error)
                }
            )
            .then(
                function(metas){
                    $scope.occupationMetas = metas;
                    // console.log($scope.applicants)
                },
                function(error){
                  console.log(error)
                }
            )
            .finally(
                function () {
                    initialize();
                }
            );

        function initialize() {

            /**
             * don't continue if there is a data error
             */
            if ($scope.dataError) {
                $scope.dataLoaded = true;
                return;
            }

            /**
             * if no applicants don't bother and continue
             */
            if ($scope.applications.length < 1) {
                $scope.dataLoaded = true;
                return;
            }

            applyFilters();

            $scope.positionsList = BusinessService.getPositionsByLocation($scope.business, $scope.location._id, $scope.position._id);

            /**
             * Set the work category for each applicant
             */
            Object.keys($scope.applicants).forEach(function (key) {
                var cats = {}; /// object is used to ensure uniqueness

                for(var x=0; x<$scope.applicants[key].workExperience.length; x++) {
                    if(x>=3) break;
                    var work = $scope.applicants[key].workExperience[x];
                    var cat = $scope.getPositionCategory(work.occId);
                    cats[cat] = true;
                }//// for
                $scope.applicants[key].workCategories = Object.keys(cats).splice(0,2).join(' & ').replace('_', ' ');

                $scope.applicants[key].shiftsScore = $scope.getShiftScore($scope.applicants[key]);

            });


            /**
             * Wait for some time and before showing the page
             */
            $timeout(function () {
                // $scope.updateStats();
                $scope.dataLoaded = true;

            }, 200);
        }//// initialize

        PositionFiltersService.addFilter('applied');
        $scope.sortBy = 'date';
        $scope.sortByLabel = 'Date';

        function applyFilters() {
            var ret = [];
            var list = $scope.applications;
            for (var x = 0; x < list.length; x++) {
                var scoreObj = $scope.scores[list[x].userId];
                var userObj = $scope.applicants[list[x].userId];

                if (!scoreObj) {
                    console.log("CandidateList:applyFilters:error:0: user " + list[x].userId + " was not found in $scope.scores.  AppId: " + list[x]._id);
                    continue;
                }
                if (!userObj) {
                    console.log("CandidateList:applyFilters:error:1: user " + list[x].userId + " was not found in $scope.applicants.  AppId: " + list[x]._id);
                    continue;
                }

                if (true === PositionFiltersService.test(list[x], userObj, scoreObj)) {
                    list[x].score = scoreObj.scores[$scope.position.expLvl].overall;
                    ret.push(list[x]);
                }
            }

            $scope.filtered = ret;
            updateStats();
            applySort();
        }

        /**
         * set statistic variables
         */
        function updateStats() {
            $scope.statistics = JobApplicationService.getStatistics($scope.applications, $scope.applicants, $scope.scores);
        }

        $scope.getDateDif = function (work) {
            var start = new Date(work.dateStart);
            var end = work.dateEnd ? new Date(work.dateEnd) : new Date();
            var dif = end - start;
            dif = dif / 1000;
            var secInYear = 31536000;
            var secInMonth = 2628000;
            var years = Math.floor(dif / secInYear);
            var months = Math.round((dif - years * secInYear) / secInMonth);
            var ret = '(';
            if (years > 0) {
                ret += years.toString() + ' years';
            }
            else {
                ret += months.toString() + ' months';
            }
            ret += ')';
            return ret;
        };

        $scope.getAgeFromDateStr = function (dateStr) {
            var date1 = new Date(dateStr);
            var date2 = new Date();
            var dif = date2 - date1;
            dif = dif / 1000;
            var secInDay = 86400;
            var days = Math.floor(dif / secInDay);
            return days;
        };

        $scope.getShiftScore = function(applicant) {
            /**
             * Set availability score/match against shift
             */
            var avScore = angular.copy($scope.position.shifts);
            var shiftsCount = 0;
            var shiftsMatched = 0;
            var shiftLabels = {}; /// will be used to add dummy shifts in the days

            for(var day in avScore){
                for(var s=0; s<avScore[day].length; s++){
                    shiftLabels[avScore[day][s].label] = s;

                    var start = avScore[day][s].tStart;
                    var end = avScore[day][s].tEnd;
                    var isMatch = false;
                    var av = applicant.availability[day];

                    var shiftArr = [];
                    for(var x=start; x<=end-1; x++){
                        shiftArr.push(x);
                    }//// for

                    if(angular.isDefined(start) && angular.isDefined(end)){
                        if( av.join('|').indexOf(shiftArr.join('|')) > -1 ){
                            isMatch = true;
                            shiftsMatched++;
                        }
                    }
                    else{
                        isMatch = null;
                    }

                    avScore[day][s].match = isMatch;

                    shiftsCount++;
                }/// for s
            }//// for d
            avScore.shiftsMatched = shiftsMatched;
            avScore.shiftsCount = shiftsCount;
            avScore.availabilityScore = Math.round(100 * shiftsMatched / shiftsCount);

            /**
             * Fix the missed up shifts in each day by adding dummy shift object based on shift label
             */
            var labels = Object.keys(shiftLabels);

            for(day in avScore){
                var d = avScore[day];
                if(d.length < labels.length){
                    var temp = [];
                    for(var x=0; x<labels.length; x++){
                        //// search the day array for matching label;
                        var i = null;
                        for(var v=0; v<d.length; v++){
                            if(labels[x] == d[v].label){
                                i = v;
                                break;
                            }
                        }
                        if(null !== i){
                            temp.push( d.splice(i, 1)[0] );
                        }
                        else{
                            temp.push({label:labels[x]});
                        }

                    }
                    avScore[day] = temp;
                }//// if
            }

            return avScore;
        };

        $scope.getViewStatus = function (id, index) {

            var app = angular.copy($scope.applications[index]);
            var now = Date.now();
            var appDate = new Date(app.appliedAt);

            if (angular.isDefined(app.viewStatus)) {
                return JobApplicationService.viewStatusLabels[app.viewStatus];
            }
            else if (appDate.getTime() <= now - (86400 * 1000 * 6)) {
                /**
                 * update view status to aging
                 */
                app.viewStatus = 2;
                JobApplicationService.save(app).then(
                    function (app) {
                        $scope.applications[index] = app;
                    },
                    function (err) {
                        console.log(err);
                    }
                )
                return 'Aging';
            }

            return 'New';


        };

        function findAppById(appId) {
            var ret;

            for (var x = 0; x < $scope.applications.length; x++) {
                if ($scope.applications[x]._id === appId) {
                    ret = $scope.applications[x];
                    break;
                }
            }

            return ret;
        }

        function findAppIndexById(appId) {
            for (var x = 0; x < $scope.applications.length; x++) {
                if ($scope.applications[x]._id === appId) {
                    return x;
                }
            }
            return -1;
        }

        function applySort() {

            $scope.filtered.sort(function (a, b) {
                if ($scope.sortBy === 'rank') {
                    var aScore = Number($scope.scores[a.userId].scores[$scope.position.expLvl].overall);
                    var bScore = Number($scope.scores[b.userId].scores[$scope.position.expLvl].overall);
                    return bScore - aScore;
                }
                else {
                    var aTime = new Date(a.appliedAt).getTime();
                    var bTime = new Date(b.appliedAt).getTime();
                    return bTime - aTime;
                }

            });
        }//// fun. applyOrder

        $scope.updateAppStatus = function (ev, appId, status) {
            var app = findAppById(appId);
            if (app) {

                // Create history entry
                var historyEntry = {
                    time: new Date(),
                    type: 'StatusChange',
                    subject: "Status changed from " + JobApplicationService.statusLabelsHm[app.status + 1] + " to " + JobApplicationService.statusLabelsHm[status + 1],
                    body: "Status changed from " + JobApplicationService.statusLabelsHm[app.status + 1] + " to " + JobApplicationService.statusLabelsHm[status + 1],
                    meta: {
                        fromStatus: app.status,
                        toStatus: status
                    },
                    userId: AuthService.currentUserId,
                    userFirstName: AuthService.currentUser.firstName,
                    userLastName: AuthService.currentUser.lastName
                };

                if (!app.history || !app.history.length) {
                    app.history = [];
                }
                app.history.push(historyEntry);

                app.status = status;

                if (angular.isDefined($scope.detailsApp)) {
                    $scope.detailsApp.history = app.history;
                    $scope.detailsApp.status = status;
                }

                var toSave = {
                    _id: app._id,
                    history: app.history,
                    status: app.status
                };
                JobApplicationService.save(toSave)
                    .then(
                        function (saved) {
                            if (angular.isDefined($scope.detailsApp)) {
                                $scope.detailsApp.status = saved.status;
                                $scope.detailsApp.history = saved.history;
                            }
                            var appIndex = findAppIndexById(appId);
                            $scope.applications[appIndex] = saved;
                            applyFilters();
                        },
                        function (err) {
                            if ($scope.business._id == '570bb124678d1cdcaf075fb4') {
                                console.log("In test mode, so applying to display but not to backend");
                                var appIndex = findAppIndexById(appId);
                                $scope.applications[appIndex].status = app.status;
                                $scope.applications[appIndex].history = app.history;
                                applyFilters();
                            } else {
                                console.error("Error: application status not saved because: " + err);
                            }


                        }
                    )
            }//// if app
        }

        $scope.setFilter = function (filter) {
            PositionFiltersService.addFilter(filter);
            applyFilters();
        }

        $scope.isFilterActive = function (filter) {
            return PositionFiltersService.isFilterActive(filter);
        }

        $scope.setSideFilter = function (ev, filter) {
            var filtersDiv = angular.element('#filtersDiv');
            var aTag = angular.element(ev.currentTarget);
            var exp = $interpolate('<div class="filter-item" id="{{label}}">{{label2}} <a href="javascript:void(0);" data-id="{{label}}" class="icon glyphicon glyphicon-remove"></a></div>');
            var item = angular.element(exp({label: filter, label2: aTag.text()}));
            item.find('a').off('click').on('click', function (ce) {
                ce.preventDefault();
                var me = angular.element(ce.currentTarget);
                var filterName = me.attr('data-id');
                var toRemove = '#' + filterName;
                filtersDiv.find(toRemove).remove();

                PositionFiltersService.removeFilter(filterName);
                applyFilters();
                $scope.$apply();
            })
            if (filtersDiv.find('#' + filter).length < 1) {
                filtersDiv.append(item);

                PositionFiltersService.addFilter(filter);
                applyFilters();
            }

        }

        $scope.getFitClass = function (i, score) {

            var label = 'great';
            if (score < 90 && score >= 70) {
                label = 'good';
            } else if (score < 70 && score >= 50) {
                label = 'ok';
            } else if (score < 50) {
                label = 'poor';
            }
            // console.log(Math.round(score/10)-1, label, i)
            return i <= Math.round(score / 10) - 1 ? label : '';
        }

        $scope.clearSideFilters = function () {
            var filtersDiv = angular.element('#filtersDiv');
            filtersDiv.children().each(function () {
                var item = angular.element(this);
                var filterName = item.attr('id');
                var toRemove = '#' + filterName;
                filtersDiv.find(toRemove).remove();

                PositionFiltersService.removeFilter(filterName);
            });
            applyFilters();
        }

        $scope.changePosition = function (posSlug) {
            $state.go('master.default.business.candidateList', {businessSlug: $scope.business.slug, locationSlug: $scope.location.slug, positionSlug: posSlug})
        }

        $scope.goToPosition = function () {
            $state.go('master.default.job.position', {businessSlug: $scope.business.slug, locationSlug: $scope.location.slug, positionSlug: $scope.position.slug})
        }

        $scope.copyPositionURL = function () {
            var url = angular.element('#positionURL').val();
            window.prompt("Copy to clipboard: Press Ctrl+C or Cmd+C on Mac then Enter", url);
        }

        $scope.showDetails = function (index, userId, app) {
            $scope.detailsUserId = userId;
            $scope.detailsIndex = index;
            $scope.detailsApp = app;

            var scoreObj = $scope.scores[userId];
            $scope.detailsApp.score = scoreObj.scores[$scope.position.expLvl].overall;

            var detailsModal = $uibModal.open({
                size: 'full',
                controller: 'CandidateDetailsModalController',
                templateUrl: 'app/business/candidate-details.tpl.html',
                windowClass: 'gray modal-max-900',
                scope: $scope
            });


            if ($scope.isHeaderFixed === true) {
                $('#mobile-nav').hide()

                $('#subHeader').hide();
            }
            /**
             * Resolved when modal closed
             */
            detailsModal.result
                .then(
                    function (d) {

                    },
                    function (err) {

                    }
                )
                .finally(
                    function (d) {
                        $scope.showActionButtons = false;
                        if ($scope.isHeaderFixed === true) {
                            $('#mobile-nav').show()

                            $('#subHeader').show();
                        }
                        // delete $scope.detailsUserId;
                        // delete $scope.detailsIndex;
                        // delete $scope.detailsApp;
                    }
                )
            /**
             * Resolved when modal successfully open
             */
            detailsModal.opened
                .then(
                    function (result) {

                        if (true === result) {
                            /**
                             * Update the viewStats of the application to viewed
                             */
                            $scope.showActionButtons = true;

                            var appToSave = angular.copy(app);
                            appToSave.viewStatus = 1;
                            JobApplicationService.save(appToSave).then(
                                function (savedApp) {
                                    // $scope.applications[index] = savedApp;
                                    $scope.applications[index].viewStats = 1;

                                },
                                function (err) {
                                    console.log(err);
                                }
                            )
                        }//// if
                    },
                    function (err) {
                        console.log(err)
                    }
                )

        }

        $scope.activityColor = function (act) {
            var colors = [
                'purple', ///-1
                'gray', /// 0
                'blue', /// 1
                'green', /// 2
                'green', /// 3
                'green', /// 4
                'green', /// 5
                'red', /// 6
                'gray', /// 7
                'red', /// 8
            ];
            if (!act.meta || !act.meta.toStatus) {
                return 'gray';
            }
            return colors[act.meta.toStatus + 1];
        }

        $scope.getPositionCategory = function(occId){

          if(!occId || !Array.isArray($scope.iconData)){
            return null;
          }

          var icon;
          for(var x=0; x<$scope.iconData.length; x++){
              if($scope.iconData[x].occId == occId){
                icon = $scope.iconData[x].icon;
                break;
              }
          }/// for

          if(angular.isDefined(icon) ){
            return icon.split('_icon')[0];
          }
          return null;
        }//// fun. getIcon

    }//// controller
})();
