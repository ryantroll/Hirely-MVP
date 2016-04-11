/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
    'use strict';

    var hirelyApp = angular.module('hirelyApp').controller('ProfileExperienceController', ['$scope', '$filter', '$timeout', 'AuthService', 'OccupationService', 'UserService', 'StatesNames', ProfileExperienceController]);

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
            }; /// return object

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
            }; /// return object

        }); /// validate year

    function ProfileExperienceController($scope, $filter, $timeout, AuthService, OccupationService, UserService, StatesNames) {

        $scope.requireWorkOccupationValidation = false;

        /**
         * [orderBy this filter will be used to order the work experience and education array by dateStart]
         */
        var orderBy = $filter('orderBy');

        $scope.stepTwoLoaded = false;

        $scope.states = StatesNames;

        $scope.occupation = {};

        $scope.workExperienceChanged = false;

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


        $scope.initExperience = function () {
            if (!AuthService.currentUser.workExperience) {
                console.log("Initializing new work experience");
                AuthService.currentUser.workExperience = [];
            }
            $scope.workExperience = angular.copy(AuthService.currentUser.workExperience);
            angular.forEach($scope.workExperience, function (item) {
                /**
                 * do some dates clenaing and fixing
                 */
                item.dateStart = new Date(item.dateStart);
                item.dateStartYear = item.dateStart.getFullYear();
                item.dateStartMonth = String(item.dateStart.getMonth() + 1);

                if (item.currentlyHere != true) {
                    item.dateEnd = new Date(item.dateEnd);
                    item.dateEndYear = item.dateEnd.getFullYear();
                    item.dateEndMonth = String(item.dateEnd.getMonth() + 1);
                }

            });
            $(window).scrollTop(0);
            $scope.stepTwoLoaded = true;
        };
        $timeout($scope.initExperience);

        /**
         * [customDebounce is used to debounce inputs, thereby waiting to call a callback until the activity stops X ms.
         * Can be called like so:  $scope.customDebounce(callback, ms)]
         */
        $scope.customDebounce = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();


        /**
         * [addJobXp will add new work experience object to array after setting dataStart and dataEnd]
         */
        $scope.addJobXp = function () {
            if (!$scope.stepTwo.$valid) return null;

            /**
             * Check if edit
             */
            if (angular.isDefined($scope.editIndex)
                && $scope.editIndex >= 0
                && $scope.editIndex < $scope.workExperience.length
            ) {
                console.log($scope.editIndex, $scope.editIndex > 0);
                $scope.occupation.dateStart = new Date(Number($scope.occupation.dateStartYear), Number($scope.occupation.dateStartMonth) - 1, 1);

                if (true !== $scope.occupation.currentlyHere) {
                    $scope.occupation.dateEnd = new Date(Number($scope.occupation.dateEndYear), Number($scope.occupation.dateEndMonth) - 1, 1);
                }
                angular.extend($scope.workExperience[$scope.editIndex], $scope.occupation);

                $scope.occupation = {};
                delete $scope.editIndex;

                // $scope.workExperience = orderBy($scope.workExperience, 'dateStart', true);

                $scope.stepTwo.$setUntouched();
                $scope.stepTwo.$setPristine();

                $scope.addWorkXpForm = false;
                $scope.workExperienceChanged = true;
                return;
            }//// if edit;

            var newExp = angular.copy($scope.occupation);
            newExp.dateStart = new Date(Number(newExp.dateStartYear), Number(newExp.dateStartMonth) - 1, 1);

            if (true !== newExp.currentlyHere) {
                newExp.dateEnd = new Date(Number(newExp.dateEndYear), Number(newExp.dateEndMonth) - 1, 1);
            }

            $scope.workExperience.push(newExp);

            $scope.workExperience = orderBy($scope.workExperience, 'dateStart', true);

            $scope.occupation = {};

            $scope.stepTwo.$setUntouched();
            $scope.stepTwo.$setPristine();

            $scope.addWorkXpForm = false;
            $scope.workExperienceChanged = true;
        }; //// fun. addJobXp

        /**
         * [fixFormDiv will set the form div to window height and scroll page to top
         * form is shown as an overlay and should cover the whole screen]
         * @return {null}
         */
        function fixFormDiv(divId){
            var formDiv = $(divId);
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
         * [removeJobXp will remove work wperience from the array]
         * @param  {number} index [index of item to be removed]
         * @return {null}       [description]
         */
        $scope.removeJobXp = function (index) {
            $scope.workExperience.splice(index, 1);
            $scope.workExperienceChanged = true;
        };

        /**
         * [editJobXp will show the form after setting the occupatin scope var to holde the edited item]
         * @param  {number} index [index of edited item in workExperience array ]
         * @return {null}       [description]
         */
        $scope.editJobXp = function (index) {
            $scope.occupation = angular.copy($scope.workExperience[index]);
            $scope.editIndex = index;
            $scope.addWorkXpForm = true;
            fixFormDiv('#expFormDiv');
            $scope.queueChoiceAutoSelect = true;
        };

        /**
         * [cancelJobXp will be trigger when cancel is clicked in form, will reset the form and clear the required variables]
         * @return {null} [description]
         */
        $scope.cancelJobXp = function () {
            $scope.occupation = {};

            delete $scope.editIndex;

            $scope.stepTwo.$setUntouched();
            $scope.stepTwo.$setPristine();

            $scope.addWorkXpForm = false;
        }; //// fun. cancelJobXp

        /**
         * [showJobXp will be triggered when "Add Experinece" clicked to show the form and set the required vars]
         * @return {null} [description]
         */
        $scope.showJobXp = function () {
            $scope.occupation = {};
            delete $scope.editIndex;
            $scope.addWorkXpForm = true;
            fixFormDiv('#expFormDiv');
        }; //// fun. ShowJobXp

        /**
         * [searchOccupations will be used in typeahead to query occs and return a list of matching]
         * @param  {string} query [string from typeahead text field]
         * @return {array}       [array of matched occupations]
         */
        $scope.occupationChoices = [];
        $scope.occupationState = "blankReportedOccTitle";
        $scope.handleReportedOccTitleChangeImmediate = function () {
            if ($scope.addWorkXpForm) {
                console.log("Occ working...");
                $scope.occupation.occTitle = "";
                $scope.occupation.occId = "";
                $scope.occupationChoices = [];
                $scope.occupationState = 'working';
            }
        };

        $scope.handleReportedOccTitleChangeDebounced = function () {
            if ($scope.addWorkXpForm) {
                console.log("In debounce");
                if ($scope.occupation.reportedOccTitle == undefined || $scope.occupation.reportedOccTitle.trim().length == 0) {
                    // Query is empty
                    $scope.occupationState = "blankReportedOccTitle";
                    console.log("No rep title");
                    $scope.$apply();
                } else if ($scope.occupation.reportedOccTitle.trim().length < 4) {
                    // Query is not long enough
                    $scope.occupationState = "lowReportedOccTitle";
                    console.log("Low rep title");
                    $scope.$apply();
                } else {
                    // Search for query
                    return OccupationService.searchOccupations($scope.occupation.reportedOccTitle).then(function (matches) {
                        if (matches.length == 0) {
                            $scope.occupationState = "notFound";
                        } else {
                            $scope.occupationState = "choicesAvailable";
                            $scope.occupationChoices = matches.slice(0, 5);
                            console.log("Showing choices");

                            if ($scope.queueChoiceAutoSelect) {
                                $scope.chooseOccupation({
                                    occTitle: $scope.workExperience[$scope.editIndex].occTitle,
                                    occId: $scope.workExperience[$scope.editIndex].occId
                                });
                                $scope.queueChoiceAutoSelect = false;
                            }
                        }
                        // $scope.$apply(); // This doesn't need to be done because me thinks ajax?
                    });
                }
            }
        };
        $scope.$watch('occupation.reportedOccTitle', $scope.handleReportedOccTitleChangeImmediate);
        $scope.$watch('occupation.reportedOccTitle', _.debounce($scope.handleReportedOccTitleChangeDebounced, 1000));

        $scope.chooseOccupation = function (occupationChoice, $event) {
            $scope.occupation.occTitle = occupationChoice.occTitle;
            $scope.occupation.occId = occupationChoice.occId;
            $scope.occupationChoice = occupationChoice;
            $scope.occupationState = "chosen";
            console.log("Chosen");
            if ($event) {
                $event.preventDefault();
            }
        };

        /**
         * Watch dates to make sure end data is greater than start date
         */
        $scope.$watchCollection('[occupation.dateStartYear, occupation.dateStartMonth, occupation.dateEndYear, occupation.dateEndMonth]', function (newValues, oldVaues) {
            var start = new Date(Number(newValues[0]), Number(newValues[1]) - 1, 1);
            var end = new Date(Number(newValues[2]), Number(newValues[3]) - 1, 1);

            /**
             * check if end date is less than start date
             */

            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                console.log("end date is less than start date");
                $scope.stepTwo.workDateEndY.$setValidity('invalidEndDate', end > start);
                $scope.stepTwo.workDateEndM.$setValidity('invalidEndDate', end > start);
            }

            // TODO:  redo validity tests
            $scope.stepTwo.workDateEndY.$setValidity('endDateConflict', true);
            $scope.stepTwo.workDateEndM.$setValidity('endDateConflict', true);
            $scope.stepTwo.workDateStartY.$setValidity('startDateConflict', true);
            $scope.stepTwo.workDateStartM.$setValidity('startDateConflict', true);
            // $scope.workExperience[x].conflict = false;

        });

        /**
         * Save the entries to database on scope destroy]
         */
        $scope.$on('$destroy', function () {
            if ($scope.workExperienceChanged) {
                var toSave = {
                    workExperience: angular.copy($scope.workExperience)
                };
                UserService.saveUser(toSave, AuthService.currentUserId)
                    .then(
                        function (user) {
                            console.log("User experience updated");
                            angular.extend(AuthService.currentUser, {workExperience: user.workExperience});
                            return user;
                        },
                        function (err) {
                            alert("Error!\nYour data was not saved, please try again.");
                            console.log(err);
                        }
                    )
            }//// if isAuth
        });/// $on.$destroy
    }
})();