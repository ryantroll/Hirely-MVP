/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
    'use strict';

    var hirelyApp = angular.module('hirelyApp').controller('ProfileEducationController', ['$scope', '$filter', '$timeout', 'AuthService', 'UserService', 'StatesNames', 'JobApplicationService', ProfileEducationController]);

    hirelyApp.directive('validateMonth', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, ele, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (value) {
                        var m = Number(value);
                        var valid = undefined !== m && NaN !== m && m < 13 && m > 0;
                        ctrl.$setValidity('invalidMonth', valid)

                        return valid ? value : undefined;
                    });/// unshift
                }//// fun. link
            }/// return object

        })/// validate month
        .directive('validateYear', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, ele, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (value) {
                        var m = Number(value);
                        var now = new Date();
                        var valid = undefined !== m && NaN != m && m <= now.getFullYear() && m >= 1940;
                        ctrl.$setValidity('invalidYear', valid);

                        return valid ? value : undefined;
                    });/// unshift
                }//// fun. link
            }/// return object

        })/// validate year

    function ProfileEducationController($scope, $filter, $timeout, AuthService, UserService, StatesNames, JobApplicationService) {


        /**
         * [orderBy this filter will be used to order the work experience and education array by dateStart]
         */
        var orderBy = $filter('orderBy');

        $scope.stepTwoLoaded = false;

        $scope.programTypes = JobApplicationService.educationPrograms;

        $scope.states = StatesNames;

        $scope.educationChanged = false;

        $scope.months = [
            {order: 1, name: 'Jan'},
            {order: 2, name: 'Feb'},
            {order: 3, name: 'Mar'},
            {order: 4, name: 'Apr'},
            {order: 5, name: 'May'},
            {order: 6, name: 'Jun'},
            {order: 7, name: 'Jul'},
            {order: 8, name: 'Aug'},
            {order: 9, name: 'Sep'},
            {order: 10, name: 'Oct'},
            {order: 11, name: 'Nov'},
            {order: 12, name: 'Dec'}
        ];

        $scope.statuss = [
            {val:0, text:'Attending'},
            {val:1, text:'Partially Completed'},
            {val:2, text:'Completed'}
        ];

        $scope.initEducation = function () {

            /**
             * [eduItems will hold the education data]
             * @type {Array}
             */
            if (!AuthService.currentUser.education) {
                AuthService.currentUser.education = [];
            }
            $scope.education = AuthService.currentUser.education;
            $scope.education = orderBy($scope.education, 'dateEnd', true);


            /**
             * [education will hold a single education data and serve as angular data model
             * this object get filled while user filling the form and cleard after users add it to list of education]
             * @type {Object}
             */
            $scope.educationInstance = {};

            angular.forEach($scope.education, function (item) {

                if (item.dateEnd && item.dateEnd.length) {
                    item.dateEnd = new Date(item.dateEnd);
                    item.dateEndYear = item.dateEnd.getFullYear();
                    item.dateEndMonth = String(item.dateEnd.getMonth() + 1);
                }
                else {
                    //// make now the end date if not completed
                    // item.dateEnd = new Date();
                }
            });//// for each

            $scope.stepTwoLoaded = true;
            $(window).scrollTop(0);
        };
        $timeout($scope.initEducation);

        $scope.$watch('educationInstance.status', function(newVal, oldVal) {
            if ($scope.educationInstance && (!$scope.educationInstance.status || $scope.educationInstance.status=='0')) {
                $scope.educationInstance.dateEndMonth = null;
                $scope.educationInstance.dateEndYear = null;
            }
        });


        /**
         * [addEducation will save education form to education list, order the education by dateStart and clear the form for next save
         * this function will be trigger by click of "Save Education" button ]
         */
        $scope.addEducation = function () {
            if (!$scope.stepTwoE.$valid) return null;

            $scope.educationChanged = true;

            // Get extraCurriculars from dom as an array
            // Do it this way because direct mapping using ng-model causes focus issues
            var extraCurricularRaws = [];
            if ($scope.educationInstance.programType!='Certificate') {
                $scope.extraCurricularObjs.forEach(function (extraCurricularObj) {
                    var extraCurricularRaw = extraCurricularObj.text.trim();
                    if (extraCurricularRaw.length != 0) {
                        extraCurricularRaws.push(extraCurricularRaw);
                    }
                });
            }
            $scope.educationInstance.extraCurriculars = extraCurricularRaws;
            $scope.extraCurricularObjs = [];

            if ($scope.educationInstance.programType=='High School') {
                $scope.educationInstance.focus = null;
            }

            if (angular.isDefined($scope.editIndex)) {

                if ($scope.educationInstance.dateEndYear && $scope.educationInstance.dateEndYear.length &&
                    $scope.educationInstance.dateEndMonth && $scope.educationInstance.dateEndMonth.length) {
                    $scope.educationInstance.dateEnd = new Date(Number($scope.educationInstance.dateEndYear), Number($scope.educationInstance.dateEndMonth) - 1, 1);
                } else {
                    $scope.educationInstance.dateEnd = null;
                }

                angular.extend($scope.education[$scope.editIndex], $scope.educationInstance);

                $scope.occupation = {};
                delete $scope.editIndex;

                $scope.stepTwoE.$setUntouched();
                $scope.stepTwoE.$setPristine();

                $scope.addEducationForm = false;
                return;
            } else {

                var newEdu = angular.copy($scope.educationInstance);

                if (newEdu.dateEndYear && newEdu.dateEndYear.length &&
                    newEdu.dateEndMonth && newEdu.dateEndMonth.length) {
                    newEdu.dateEnd = new Date(Number(newEdu.dateEndYear), Number(newEdu.dateEndMonth) - 1, 1);
                }

                $scope.education.push(newEdu);

                $scope.education = orderBy($scope.education, 'dateEnd', true);


                $scope.educationInstance = {};

                $scope.stepTwoE.$setUntouched();
                $scope.stepTwoE.$setPristine();

                $scope.addEducationForm = false;
            }
        };

        /**
         * [fixFormDiv will set the form div to window height and scroll page to top
         * form is shown as an overlay and should cover the whole screen]
         * @return {null}
         */
        function fixFormDiv() {
            var formDiv = $('#expFormDiv');
            $(window).scrollTop(0);
            /**
             * Add some delay so we can read the height property after div is added to dom
             */
            setTimeout(function () {
                if (formDiv.height() < $(document).height()) {
                    formDiv.height($(document).height());
                }
            }, 100)
        }

        /**
         * [removeEducation will remove one education entry from education list Array by entry index]
         * @param  {Number} index [index of array to be removed]
         * @return {[type]}       [description]
         */
        $scope.removeEducation = function (index) {
            $scope.education.splice(index, 1);
            $scope.educationChanged = true;
        };

        $scope.editEducation = function (index) {
            $scope.educationInstance = angular.copy($scope.education[index]);
            // Convert status from int to string so that the select is chosen correctly
            $scope.educationInstance.status = String($scope.educationInstance.status);

            // Setup extra curricular activities
            var extraCurricularRaws = $scope.educationInstance.extraCurriculars ? $scope.educationInstance.extraCurriculars : [];
            $scope.extraCurricularObjs = [];
            // Convert list of strings to list of objects, otherwise angular gets cranky with ngRepeat and inputs
            extraCurricularRaws.forEach(function(text) {
                $scope.extraCurricularObjs.push({text:text});
            });


            $scope.editIndex = index;
            $scope.addEducationForm = true;
            fixFormDiv();
        };

        /**
         * [cancelJobXp will be trigger when cancel is clicked in form, will reset the form and clear the required variables]
         * @return {null} [description]
         */
        $scope.cancelEducation = function () {
            $scope.educationInstance = {};

            delete $scope.editIndex;

            $scope.stepTwoE.$setUntouched();
            $scope.stepTwoE.$setPristine();

            $scope.addEducationForm = false;
        }; //// fun. cancelJobXp

        /**
         * [showJobXp will be triggered when "Add Experinece" clicked to show the form and set the required vars]
         * @return {null} [description]
         */
        $scope.showEducation = function () {
            $scope.educationInstance = {status: null};
            $scope.extraCurricularObjs = [];
            delete $scope.editIndex;
            $scope.addEducationForm = true;

            fixFormDiv();
        }; //// fun. ShowJobXp


        $scope.addAndFocusExtraCurricular = function() {
            $scope.extraCurricularObjs.push({text:''});
            $timeout(function() {
                $('.extraCurricular:last').focus()
            });
        };

        $scope.rmAndFocusExtraCurricular = function(index) {
            $scope.extraCurricularObjs.splice(index,1);
        };

        /**
         * Save the entries to database on scope destroy]
         */
        $scope.$on('$destroy', function () {
            if ($scope.educationChanged || true) {
                var toSave = {education: angular.copy($scope.education)};
                UserService.saveUser(toSave, AuthService.currentUserId)
                    .then(
                        function (user) {
                            angular.extend(AuthService.currentUser, {education: user.education});
                        },
                        function (err) {
                            alert("Error!\nYour data was not saved, please try again.")
                            console.log(err);
                        }
                    )
            }
        });/// $on.$destroy

    }
})();