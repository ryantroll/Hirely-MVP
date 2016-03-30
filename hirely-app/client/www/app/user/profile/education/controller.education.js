/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
    'use strict';

    var hirelyApp = angular.module('hirelyApp').controller('ProfileEducationController', ['$scope', '$stateParams', '$filter', '$timeout', 'AuthService', 'UserService', 'StatesNames', 'JobApplicationService', ProfileEducationController]);

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

    function ProfileEducationController($scope, $stateParams, $filter, $timeout, authService, userService, StatesNames, JobApplicationService) {


        /**
         * [orderBy this filter will be used to order the work experience and education array by dateStart]
         */
        var orderBy = $filter('orderBy');

        $scope.stepTwoLoaded = false;

        $scope.programTypes = JobApplicationService.educationPrograms;


        $scope.states = StatesNames;

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

        $scope.initEducation = function () {

            /**
             * [eduItems will hold the education data]
             * @type {Array}
             */
            if (!authService.currentUser.education) {
                authService.currentUser.education = [];
            }
            $scope.education = authService.currentUser.education;
            $scope.education = orderBy($scope.education, 'dateEnd', true);


            /**
             * [education will hold a single education data and serve as angular data model
             * this object get filled while user filling the form and cleard after users add it to list of education]
             * @type {Object}
             */
            $scope.educationInstance = {};

            angular.forEach($scope.education, function (item) {

                item.currentlyEnrolled = !item.isCompleted;

                if (item.isCompleted) {
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
        };
        $scope.$watch('$parent.userIsSynced', function(newValue, oldValue) {
            if (newValue == true) {
                console.log("edu.$parent.userIsSynced = true;")
                $scope.initEducation();
            }
        });


        /**
         * [addEducation will save education form to education list, order the education by dateStart and clear the form for next save
         * this function will be trigger by click of "Save Education" button ]
         */
        $scope.addEducation = function () {
            if (!$scope.stepTwoE.$valid) return null;

            if (angular.isDefined($scope.editIndex)) {

                if (true !== $scope.educationInstance.currentlyEnrolled) {
                    $scope.educationInstance.dateEnd = new Date(Number($scope.educationInstance.dateEndYear), Number($scope.educationInstance.dateEndMonth) - 1, 1);
                }

                $scope.educationInstance.isCompleted = !$scope.educationInstance.currentlyEnrolled;

                angular.extend($scope.education[$scope.editIndex], $scope.educationInstance);

                $scope.occupation = {};
                delete $scope.editIndex;

                $scope.stepTwoE.$setUntouched();
                $scope.stepTwoE.$setPristine();

                $scope.addEducationForm = false;
                return;
            }/// if edit

            var newEdu = angular.copy($scope.educationInstance);

            if (true !== newEdu.currentlyEnrolled) {
                newEdu.dateEnd = new Date(Number(newEdu.dateEndYear), Number(newEdu.dateEndMonth) - 1, 1);
            }

            newEdu.isCompleted = !newEdu.currentlyEnrolled;

            $scope.education.push(newEdu);

            $scope.education = orderBy($scope.education, 'dateEnd', true);


            $scope.educationInstance = {};

            $scope.stepTwoE.$setUntouched();
            $scope.stepTwoE.$setPristine();

            $scope.addEducationForm = false;
        }

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
        }

        $scope.editEducation = function (index) {
            $scope.educationInstance = angular.copy($scope.education[index]);
            $scope.editIndex = index;
            $scope.addEducationForm = true;

            fixFormDiv();
        }

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
        }//// fun. cancelJobXp

        /**
         * [showJobXp will be triggered when "Add Experinece" clicked to show the form and set the required vars]
         * @return {null} [description]
         */
        $scope.showEducation = function () {
            $scope.educationInstance = {};
            delete $scope.editIndex;
            $scope.addEducationForm = true;

            fixFormDiv();
        }//// fun. ShowJobXp

        /**
         * Save the entries to database on scope destroy]
         */
        $scope.$on('$destroy', function () {
            /**
             * Make sure user is authenticated
             */
            if (authService.isUserLoggedIn()) {
                var toSave = {education: angular.copy($scope.education)};
                userService.saveUser(toSave, authService.currentUserID)
                    .then(
                        function (user) {
                            authService.setCurrentUser(user);
                            $scope.initEducation();
                        },
                        function (err) {
                            alert("Error!\nYour data was not saved, please try again.")
                            console.log(err);
                        }
                    )
            }//// if isAuth
            else {

            }//// if isAuth else
        });/// $on.$destroy

    }
})();