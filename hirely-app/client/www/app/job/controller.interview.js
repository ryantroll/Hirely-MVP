(function () {
    'use strict';

    angular.module('hirelyApp.job').controller('InterviewController', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', 'BusinessService', 'AvailabilityService', 'FavoritesService', 'AuthService', InterviewController]);

    function InterviewController($scope, $rootScope, $state, $stateParams, $timeout, BusinessService, AvailabilityService, FavoritesService, AuthService) {

        $scope.AuthService = AuthService;

        var nowDate = new Date();
        var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        $scope.today = monthNames[nowDate.getMonth()]+' '+nowDate.getDate()+', '+nowDate.getFullYear();
        
        BusinessService.getBySlug($stateParams.businessSlug)
            .then(
                function (business) {
                    $scope.business = business;
                    $scope.location = BusinessService.locationBySlug($stateParams.locationSlug, business);
                    $scope.position = BusinessService.positionBySlug($stateParams.positionSlug, $stateParams.locationSlug, business);
                    $scope.interviewQuestionSet = $scope.position.interviewQuestions[$stateParams.interviewQuestionsIndex];
                    
                    $scope.dataError = !$scope.business || !$scope.location || !$scope.position || !$scope.interviewQuestionSet;
                    $scope.dataLoaded = true;

                    $timeout(function () {
                        $('.qRow').each(function (index) {
                            var rowHeight = $(this).css('height');
                            $(this).find('.qCol').css('height', rowHeight);
                            // $(this).css('height', '600px');
                            $(this).find('.qQuestion').css('height', rowHeight);
                        });

                    });

                }
            );

    }//// fun. InterviewController

})();
