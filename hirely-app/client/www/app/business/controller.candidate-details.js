    /**
 *
 * Applicant List Main Controller
 *
 * Iyad Bitar
 */
(function () {
    'use strict';

    angular.module('hirelyApp').controller('CandidateDetailsController', ['$stateParams', '$scope', 'DEFAULT_PROFILE_IMAGE', 'AvailabilityService', 'BusinessService', 'JobApplicationService', 'TraitifyService', 'UserService', CandidateDetailsController]);
    angular.module('hirelyApp').controller('CandidateDetailsModalController', ['$stateParams', '$scope', '$uibModalInstance', 'DEFAULT_PROFILE_IMAGE', 'AvailabilityService', 'BusinessService', 'JobApplicationService', 'TraitifyService', 'UserService', CandidateDetailsModalController]);

    function CandidateDetailsControllerCore($stateParams, $scope, DEFAULT_PROFILE_IMAGE, AvailabilityService, BusinessService, JobApplicationService, TraitifyService, UserService) {
        $scope.defaultImage = DEFAULT_PROFILE_IMAGE;
        $scope.days = AvailabilityService.days;
        $scope.hours = AvailabilityService.hours;
        $scope.statusLabelsHm = JobApplicationService.statusLabelsHm;
        $scope.dayHours = {};
        $scope.educationStatusLabels = UserService.educationStatus;

        $scope.daysUntilAvailable = 0;
        $scope.initializeCandidateDetails = function() {
            $scope.applicant.workExperience.forEach(function(work) {
                work.monthCount = $scope.getDateDif(work);
            });

            $scope.availability = AvailabilityService.toFrontEndModel($scope.applicant.availability);
            $scope.daysUntilAvailable = getDaysUntilAvailable();

            /**
             * get experience icons
             */
            var strOccIds = [];
            for (var x = 0; x < $scope.applicant.workExperience.length; x++) {
                strOccIds.push($scope.applicant.workExperience[x].occId);
            }

            /**
             * initiate the availability table to monday
             */
            $scope.showTimeTable('mon', 0);

            /**
             * Get the icons and colors data for all occupations needed for this page
             */
            BusinessService.getPositionDisplayData(strOccIds.join('|'))
                .then(
                    function (iconData) {
                        $scope.iconData = iconData;
                    },
                    function (error) {
                        console.log("BS.getPositionDisplayData.error: "+error)
                    }
                );

            /**
             * Get traitify meta data for user personality blend
             * @type {[type]}
             */
            var blend = $scope.applicant.personalityExams[0].personalityBlend.name;
            var metaArray = [blend];
            for(var x=0; x<5; x++){
                metaArray.push($scope.applicant.personalityExams[0].personalityTraits[x]._id);
            }

            return TraitifyService.getMeta(metaArray.join('|')).then(
                function(metas){
                    for(var x=0; x<metas.length; x++){
                        if(metas[x]._id === blend){
                            $scope.personalityBlendMeta = metas[x];
                            continue;
                        }
                        for(var xx=1; xx<6; xx++){
                            if(metas[x]._id === metaArray[xx]){
                                $scope.applicant.personalityExams[0].personalityTraits[xx-1].meta = metas[x].meta;
                                continue;
                            }
                        }//// for

                    }//// for

                },
                function(err){
                    console.log("BS.getMeta.error: "+err)
                }
            )

        }

        // Added '2' to not be confused with controller.candidate-list.getFitClass
        $scope.getFitClass2 = function(i, score){

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

        function getDaysUntilAvailable() {
            var days = Number($scope.applicant.availability.startAvailability)
            var list = AvailabilityService.startOptions;
            var ret = '';

            for (var x = 0; x < list.length; x++) {
                if (list[x].days === days) {
                    ret = list[x].label;
                    break;
                }
            }
            return ret;
        }

        $scope.showTimeTable = function (day, index) {
            /**
             * Don't create new copy of currentDays if exists
             * this function can be called from inside days buttons in this case the other days data will be erased if copy is exectured
             * Only save and cancel will delete currentDays
             */
            if (angular.isUndefined($scope.currentDays)) {
                $scope.currentDays = angular.copy($scope.availability.weeklyTimetable);
            }
            $scope.currentDayLabel = day;
            $scope.currentDayIndex = index;

        }//// showTimetable;

        $scope.nextDay = function () {
            if (angular.isUndefined($scope.currentDays) || angular.isUndefined($scope.currentDayLabel) || angular.isUndefined($scope.currentDayIndex)) {
                return null;
            }

            $scope.currentDayIndex = ($scope.currentDayIndex + 1) % 7;
            $scope.currentDayLabel = $scope.days[$scope.currentDayIndex];

        }; //// fun. nextDay

        $scope.previousDay = function () {
            if (angular.isUndefined($scope.currentDays) || angular.isUndefined($scope.currentDayLabel) || angular.isUndefined($scope.currentDayIndex)) {
                return null;
            }
            var pre = ($scope.currentDayIndex - 1) % 7;
            $scope.currentDayIndex = pre < 0 ? 6 : pre;
            $scope.currentDayLabel = $scope.days[$scope.currentDayIndex];

        }; //// fun. nextDay

        $scope.dayHours = function(day){

        };//// fun. dayHorus

        $scope.getDateDif = function (work) {
            var start = new Date(work.dateStart);
            var end = work.dateEnd ? new Date(work.dateEnd) : new Date();
            var dif = end - start;
            dif = dif / 1000;
            var secInYear = 525600 * 60;
            var secInMonth = 43800 * 60;
            var years = Math.floor(dif / secInYear);
            var months = Math.round((dif - years * secInYear) / secInMonth);
            var ret = '(';
            if (years > 0) {
                ret += years.toString() + ' year' + (years > 1 ? 's' : '');
            }
            if (months > 0) {
                ret += ' ' + months.toString() + ' month' + (months > 1 ? 's' : '');
            }
            ret += ')';
            return ret;
        };

        $scope.getPositionIcon = function (occId, property) {

            if (!occId || !Array.isArray($scope.iconData)) {
                return null;
            }
            var icon;
            for (var x = 0; x < $scope.iconData.length; x++) {
                if ($scope.iconData[x].occId == occId) {
                    icon = $scope.iconData[x];
                    break;
                }
            }/// for

            if (angular.isDefined(icon) && angular.isDefined(icon[property])) {
                return icon[property];
            }
            return null;
        }; //// fun. getIcon


        /**
         * Add details top menu interactivity
         */
        $scope.showSection = function (section) {
            $scope.activeSection = section;
        }//// fun.showSection

    }//// controller

    function CandidateDetailsController($stateParams, $scope, DEFAULT_PROFILE_IMAGE, AvailabilityService, BusinessService, JobApplicationService, TraitifyService, UserService) {
        CandidateDetailsControllerCore($stateParams, $scope, DEFAULT_PROFILE_IMAGE, AvailabilityService, BusinessService, JobApplicationService, TraitifyService, UserService);
        $scope.isModal = false;

        function initializeApplication() {
            console.log(JobApplicationService)
            // This page is being accessed outside of a modal
            JobApplicationService.getById($stateParams.applicationId).then(function (applicationData) {
                $scope.application = applicationData.application;
                $scope.applicant = applicationData.applicant;
                // $scope.careerMatchScores = applicationData.careerMatchScores;
                $scope.initializeCandidateDetails();
            });
        }
        initializeApplication();

    }

    function CandidateDetailsModalController($stateParams, $scope, $uibModalInstance, DEFAULT_PROFILE_IMAGE, AvailabilityService, BusinessService, JobApplicationService, TraitifyService, UserService) {

        CandidateDetailsControllerCore($stateParams, $scope, DEFAULT_PROFILE_IMAGE, AvailabilityService, BusinessService, JobApplicationService, TraitifyService, UserService);

        $scope.isModal = true;

        // This should only be used when modal
        $scope.closeModal = function () {
            $uibModalInstance.close();
        };


        // This should only be used when modal
        $scope.nextApplication = function () {
            var newIndex = $scope.detailsIndex + 1;
            if (newIndex < $scope.filtered.length) {
                $scope.detailsIndex = newIndex;
            }
        }; //// fun. nextApplication

        // This should only be used when modal
        $scope.preApplication = function () {
            var newIndex = $scope.detailsIndex - 1;
            if (newIndex >= 0) {
                $scope.detailsIndex = newIndex;
            }
        }//// fun. previousApplication

        function initializeApplication() {
            $scope.application = $scope.filtered[$scope.detailsIndex];
            $scope.applicant = $scope.applicants[$scope.application.userId];
            // $scope.careerMatchScores = applicationData.careerMatchScores;
            // Assume scope was passed in, ie from candidate list controller
            $scope.initializeCandidateDetails();
        }
        initializeApplication();
        $scope.$watch('detailsIndex', function(newVal, oldVal) {
            initializeApplication();
        });

        $scope.formatPhoneNumber = function(phone){
           phone = phone.slice(2);
           return UserService.formatPhone(phone)
        }
    }

})();
