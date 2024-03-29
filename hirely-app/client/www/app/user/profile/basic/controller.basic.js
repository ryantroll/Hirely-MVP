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

    angular.module('hirelyApp').controller('ProfileBasicController', ['$rootScope', '$scope', '$timeout', 'multiStepFormInstance', 'AuthService', 'UserService', 'FileUpload', 'DEFAULT_PROFILE_IMAGE', ProfileBasicController])
        .directive('validateDate', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, ele, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (value) {
                        var pat = /^\d{2}\/\d{2}\/\d{4}$/;
                        var valid = true;

                        valid = valid && pat.test(value);
                        if (false === valid) {
                            ctrl.$setValidity('invalidDate', false)
                            return value;
                        }

                        var dateParts = value.split('/');
                        var D = Date.parse(dateParts[2] + "-" + dateParts[0] + "-" + dateParts[1]);
                        var now = new Date();

                        if (isNaN(D)) {
                            ctrl.$setValidity('invalidDate', false)
                            return value;
                        }

                        D = new Date(D);

                        if (D >= now) {
                            ctrl.$setValidity('invalidDate', false)
                            return value;
                        }

                        ctrl.$setValidity('invalidDate', true);
                        return value;
                    });/// unshift
                }//// fun. link
            }/// return object
        })/// validate date;
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
        .directive('validateZipcode', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, ele, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (value) {
                        scope.searchLocations(value)
                            .then(
                                function (locations) {
                                    console.log(locations);
                                },
                                function (err) {
                                    console.log(err)
                                }
                            )
                        return value;
                    });/// unshift
                }//// fun. link
            }/// return object
        })/// validate date;
        .directive('file', function () {
            return {
                restrict: 'AE',
                scope: {
                    file: '@'
                },
                link: function (scope, el, attrs) {
                    el.bind('change', function (event) {
                        var files = event.target.files;
                        var file = files[0];
                        scope.file = file;
                        scope.$parent.file = file;
                        // scope.$apply();
                        scope.$parent.uploadPhoto();
                    });
                }
            };
        });


    function ProfileBasicController($rootScope, $scope, $timeout, multiStepFormInstance, AuthService, UserService, FileUpload, DEFAULT_PROFILE_IMAGE) {

        $scope.validStep = false;

        $scope.DEFAULT_PROFILE_IMAGE = DEFAULT_PROFILE_IMAGE;

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        $scope.$watch('stepOne.$valid', function (state) {
            multiStepFormInstance.setValidity(state);
        });

        /**
         * [formatPhone Will set the right format for phone while the user typing in]
         */
        $scope.formatPhone = function () {
            var newVal = $scope._mobile;

            if (newVal === false || angular.isUndefined(newVal)) return;

            $scope._mobile = UserService.formatPhone(newVal);

            // Android doesn't move the cursor to the end of the input when we change it, so re-focus
            $("#dob").focus();
            $("#mobile").focus();

        };

        $scope.$watchCollection('_dateOfBirth', function (newValue, oldValue) {
            if (!(newValue && oldValue)) return;
            if ((newValue.length == 2 || newValue.length == 5) && (oldValue.length == 1 || oldValue.length == 4)) {
                $scope._dateOfBirth += '/';

                // Android doesn't move the cursor to the end of the input when we change it, so re-focus
                $("#mobile").focus();
                $("#dob").focus();
            }

        });

        $scope.formatDate = function () {
            var newVal = angular.copy($scope._dateOfBirth);
            if (newVal === null || angular.isUndefined(newVal)) return;

            //// clear date format
            newVal = newVal.split('/').join('');

            var formated = '';
            if (newVal.length >= 2) {
                formated += newVal.slice(0, 2) + '/';
                newVal = newVal.slice(2);
            }
            if (newVal.length >= 2) {
                formated += newVal.slice(0, 2) + '/';
                newVal = newVal.slice(2);
            }
            formated += newVal;

            $scope._dateOfBirth = formated;
        }//// fun. formatDate

        /**
         *
         */
        

        $scope.initBasic = function () {
            $scope.user = angular.copy(AuthService.currentUser);

            /**
             * Set scope _dateOfBirth and _mobile these 2 properites need to be fomrated before display
             */
            if ($scope.user.mobile) {
                $scope._mobile = UserService.formatPhone($scope.user.mobile.split('+1.').join(''));
            }
            if ($scope.user.dateOfBirth) {
                $scope._dateOfBirth = UserService.formatDate($scope.user.dateOfBirth);
            }

            var languagesListRaw = $scope.user.languagesSpoken;
            if (!languagesListRaw || !languagesListRaw.length) {
                languagesListRaw = ["English"];
            }
            // Convert list of strings to list of objects, otherwise angular gets cranky with ngRepeat and inputs
            $scope.languagesListObjs = [];
            languagesListRaw.forEach(function(lang) {
                $scope.languagesListObjs.push({language:lang});
            });

            $(window).scrollTop(0);
            $scope.stepOneLoaded = true;
        };
        $timeout($scope.initBasic);

        $scope.addAndFocusLanguage = function() {
            $scope.languagesListObjs.push({language:''});
            $timeout(function() {
                $('.language:last').focus()
            });
        };

        $scope.rmAndFocusLanguage = function(index) {
            if ($scope.languagesListObjs.length == 1) {
                alert("You must list at least one language.");
                return;
            }
            $scope.languagesListObjs.splice(index,1);
        };

        $scope.manualFormValidation = function(newVal, oldVal) {
            if (angular.isArray(newVal) && newVal.length) {
                $scope.$emit('setEnableNextButton', {newValue:true});
            } else if (newVal && newVal.length > 3) {
                $scope.$emit('setEnableNextButton', {newValue:true});
            } else {
                $scope.$emit('setEnableNextButton', {newValue:false});
            }
        };

        $scope.$watch('user.firstName', $scope.manualFormValidation);
        $scope.$watch('user.lastName', $scope.manualFormValidation);
        $scope.$watch('_mobile', $scope.manualFormValidation);
        $scope.$watch('user.postalCode', $scope.manualFormValidation);
        $scope.$watch('languagesListObjs', $scope.manualFormValidation);

        //// wait for destroy event to update data
        $scope.$on('$destroy', function (event) {

            if ($scope._dateOfBirth) {
                $scope.user.dateOfBirth = new Date($scope._dateOfBirth);
            }
            if ($scope._mobile) {
                $scope.user.mobile = '+1.' + UserService.clearPhoneFormat($scope._mobile);
            }

            /**
             * Save only basic information
             */

            // Get lanuages from dom as an array
            // Do it this way because direct mapping using ng-model causes focus issues
            var languagesSpokenRaw = [];
            $scope.languagesListObjs.forEach(function(language) {
                language = language.language.trim();
                if (language.length != 0) {
                    languagesSpokenRaw.push(language);
                }
            });


            var toSave = {
                _id: $scope.user._id,
                firstName: $scope.user.firstName,
                lastName: $scope.user.lastName,
                profileImageURL: $scope.user.profileImageURL,
                mobile: $scope.user.mobile,
                dateOfBirth: $scope.user.dateOfBirth,
                postalCode: $scope.user.postalCode,
                languagesSpoken: languagesSpokenRaw
            };
            UserService.saveUser(toSave).then(function(user) {
                angular.extend(AuthService.currentUser, user);
            });
        });

        $scope.selectFile = function () {
            angular.element('#photoFile').show().focus().click();
        }; //// selectFile

        $rootScope.$on('UploadProgress', function (event, per) {
            var percent = Math.round(per * 100);
            angular.element('.image-loader').text(percent);
        });

        $scope.uploadPhoto = function () {

            // IE11 bounces on this for some reason, and this errors out
            try {

                if (!$scope.file || angular.isUndefined($scope.file)) {
                    console.log("skipped $scope.uploadPhoto due to debounce");
                    return null;
                }

                var fileName = $scope.file.name.split('.');
                var ext = fileName.pop();
                fileName = fileName.join('.');
                fileName += '-pofile-' + AuthService.currentUserId + '.' + ext;

                angular.element('.image-loader').show();

                FileUpload.putFile($scope.file, fileName, 'profile-photos')
                    .then(
                        function (fileUrl) {
                            $scope.user.profileImageURL = fileUrl;
                            AuthService.currentUser.profileImageURL = fileUrl;

                            var splitPoint = fileUrl.search('/profile-photos');
                            var thumbUrl = fileUrl.slice(0, splitPoint) + '/thumbnails' + fileUrl.slice(splitPoint);
                            AuthService.currentUser.profileImageThumbURL = thumbUrl;

                            // For scope, don't use thumb in case AWS takes a while to gen the thumb
                            $scope.user.profileImageThumbURL = fileUrl;

                            var userData = {profileImageURL: fileUrl, profileImageThumbURL: thumbUrl};
                            return UserService.saveUser(userData, AuthService.currentUserId);
                        },
                        function (err) {
                            console.log("Error uploading: "+err);
                            alert("Error uploading image");
                            return null;
                        }
                    )///
                    .then(
                        function (savedUser) {
                            delete $scope.file;
                            angular.element('#photoFile').val(null);
                            angular.element('.image-loader').hide();
                        },
                        function (err) {
                            console.log("Error saving image url to db: "+err);
                            alert("Error saving image to db");
                        }
                    )
            } catch (IEerror) {
                console.log("Caught error. Prob IE bounce: " + IEerror);
            }
        }//// fun. uploadPhoto

        $scope.removeImage = function () {
            AuthService.currentUser.profileImageURL = null;
            AuthService.currentUser.profileImageThumbURL = null;
            $scope.user.profileImageThumbURL = null;
            var userData = {profileImageURL: null, profileImageThumbURL: null};
            return UserService.saveUser(userData, AuthService.currentUserId)
                .then(
                    function (savedUser) {
                        delete $scope.file;
                        angular.element('#photoFile').val(null);
                        angular.element('.image-loader').hide();
                    },
                    function (err) {
                        console.log("Error removing image from db: "+err);
                        alert("Error saving image to db");
                    }
                )



        }//// fun. removeImage


    }
})();
