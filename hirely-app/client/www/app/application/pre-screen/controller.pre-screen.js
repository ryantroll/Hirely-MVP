/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 *
 *
 */
(function () {
    'use strict';

    angular.module('hirelyApp')
        .directive('validateQuestion', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                replace: true,
                link: function (scope, ele, attrs, ctrl) {
                    ctrl.$validators.validateQuestion = function(modelValue, viewValue) {
                        if (!viewValue) {
                            return false;
                        }
                        return viewValue.length > 3;
                    };/// unshift
                }//// fun. link
            }/// return object
        })/// validate question is not empty;
        .directive('characterCounter', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                // require: 'ngModel',
                template: '<div class="char-counter pull-right">{{leftChars}}</div>',
                link: function (scope, ele, attrs, ctrl) {
                    var max = parseInt(attrs.max, 10);
                    if(!max) max = 140;
                    var f;/// the field
                    var div = $(ele).find('.char-counter').eq(0);

                    var filedKey = function(e){
                        var code = e.keyCode || e.which || e.charCode;
                        var allowed = [48, 57, 9, 91, 8, 37, 38, 39, 40, 13, 16, 17, 18, 93];

                        var length = f.val().length + (code === 8 ? -1 : (allowed.indexOf(code) == -1 ? 1 : 0) ); /// +1 because we using keydown and field value not updated yet and -1 for backspace
                        var left = max - length;
                        scope.leftChars = left < 0 ? 0 : (left > max ? max : left); /// protect left from over boundaries
                        if(left+1  <=  0 && allowed.indexOf(code) ===-1){
                            if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
                        }
                        else if(scope.leftChars <= 12){

                            div.addClass('error')
                        }
                        else{
                            div.removeClass('error');
                        }
                    }

                    var onDocLoad = function(){
                        f = angular.element('#' + attrs.fieldId);
                        scope.leftChars = max - f.val().length;
                        f.on('keydown', filedKey);
                    }
                    $timeout(onDocLoad, 100)//// timeout delay is added to allot DOM element access
                }//// fun. link
            }/// return object
        }])/// .directive;

        .controller('PreScreenController', ['$scope', '$state', '$stateParams', '$timeout', 'AuthService', 'JobApplicationService', PreScreenController]);


    function PreScreenController($scope, $state, $stateParams, $timeout, AuthService, JobApplicationService) {

        $scope.daysUntilReapply = 0;

        $scope.initPrescreen = function () {
            $scope.daysUntilReapply = $scope.getDaysUntilReapply($scope.application);
            $scope.isApplyEligible = $scope.daysUntilReapply == 0;
            $scope.$parent.blockFinished = !$scope.isApplyEligible;

            $(window).scrollTop(0);
            $scope.stepFourLoaded = true;
        };
        $timeout($scope.initPrescreen);

        $scope.dayDiff = function (d1, d2) {
            if (isNaN(d2) || !d2) {
                d2 = new Date();
            }
            if (angular.isString(d1)) {
                d1 = new Date(d1);
            }
            if (angular.isString(d2)) {
                d2 = new Date(d2);
            }

            var one_day=1000*60*60*24; // one day in milliseconds
            return Math.round((d2.getTime() - d1.getTime()) / one_day);
        };

        $scope.getDaysUntilReapply = function (application) {
            if (application.status<=0 || !application.appliedAt) {
                return 0;
            }
            var dayDiff = $scope.dayDiff(application.appliedAt);
            var daysUntilReapply = 30 - dayDiff;
            if (daysUntilReapply < 0) {
                daysUntilReapply = 0;
            }
            return daysUntilReapply;
        };

        $scope.gotoPosition = function () {
            $state.go('master.default.job.position', $stateParams);
        };

        //// wait for destroy event to update data
        $scope.$on('$destroy', function (event) {

            // If "Finish" was clicked, update the status of the application
            if ($scope.destroyDirection) {
                console.log("'Submit' was clicked, update the status of the application");

                // Create history entry
                var historyEntry = {
                    time: new Date(),
                    type: 'StatusChange',
                    subject: "Status changed from "+JobApplicationService.statusLabelsHm[$scope.application.status]+" to "+JobApplicationService.statusLabelsHm[2],
                    body: "Status changed from "+JobApplicationService.statusLabelsHm[$scope.application.status]+" to "+JobApplicationService.statusLabelsHm[2],
                    meta: {
                        fromStatus: $scope.application.status,
                        toStatus: 2
                    },
                    userId: AuthService.currentUserId,
                    userFirstName: AuthService.currentUser.firstName,
                    userLastName: AuthService.currentUser.lastName
                };

                if (!$scope.application.history || !$scope.application.history.length) {
                    $scope.application.history = [];
                }
                $scope.application.history.push(historyEntry);

                $scope.application.status = 2;
                $scope.application.appliedAt = new Date();

            }

            JobApplicationService.save($scope.application)
                .then(
                    function () {
                        console.log("Application created");
                    },//// save resolve
                    function (err) {
                        console.log(err);
                        alert('Error while saving your application\nPlease try again');
                    }//// save reject
                );//// save().then()
        });

    }
})();
