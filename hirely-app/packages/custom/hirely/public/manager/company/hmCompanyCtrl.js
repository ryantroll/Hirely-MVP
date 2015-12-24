/**
 * Created by mike.baker on 10/3/2015.
 */
(function () {
    'use strict';

   var app = angular.module('mean.hirely.manager').controller('HMCompanyCtrl', ['$scope', '$state', '$modal',  '$firebaseArray', 'FBURL', '$stateParams', 'FilePickerService', 'filePickerKey', 
        'GeocodeService', 'UserService', 'OccupationService', 'CandidateService', 'BusinessService', 'Notification', 'PositionService', HMCompanyCtrl]);

    function HMCompanyCtrl($scope, $state, $modal, $firebaseArray, FBURL, $stateParams, FilePickerService, filePickerKey, GeocodeService, UserService, OccupationService, CandidateService, BusinessService, Notification, PositionService) {
        var managerId = '';
        var businessRef = new Firebase(FBURL + '/business');
        var businessSiteRef = new Firebase(FBURL + '/businessSite');
        var photoRef = new Firebase(FBURL + '/businessPhotos');
        var positionRef = new Firebase(FBURL + '/position');
        var occupationRef = new Firebase(FBURL + "/onetOccupation")
        var vm = this;
        var currentUser = BusinessService;
        var businessService = BusinessService;
        var candidateService = CandidateService;
        var filePickerService = FilePickerService;
        var geocodeService = GeocodeService;
        var occupationService = OccupationService;
        var positionService = PositionService;
        var userService = UserService;

        $scope.occupations = [];
        $scope.occupations = occupationRef;
        $scope.companies = $firebaseArray(businessSiteRef);
        $scope.pictures = $firebaseArray(photoRef);
        $scope.split_jobs = ['job1', 'job2', 'job3'];
 
        $scope.HiringManager = currentUser.getCurrentUser();
	   
        $scope.results = '';
        $scope.options = {
            types: '(regions)'
        };

        $scope.positions = [];

        $scope.filter = {
          distance: ($stateParams.distance) ? $stateParams.distance : 20,
          minWage: ($stateParams.wage) ? $stateParams.wage : 0,
          occupationId: ($stateParams.occupationId) ? $stateParams.occupationId : '',
          occupation: ''

        };

        $scope.occupation = '';
        $scope.details = '';
       
        $scope.placeId = $stateParams.placeId;

        $scope.error = '';

        
        $scope.business = {name: '', description: '', status: '', street_number: '', route: '', locality: '', administrative_area_level_1: '', 
        postal_code: '', country: '', latitude: '', longitude: '', webaddress: '', open_store_hours0: '', 
        closed_store_hours0: '', open_store_hours1: '', closed_store_hours1: '', open_store_hours2: '', closed_store_hours2: '', 
        open_store_hours3: '', closed_store_hours3: '', open_store_hours4: '', closed_store_hours4: '', open_store_hours5: '', 
        closed_store_hours5: '', open_store_hours6: '', closed_store_hours6: ''}

       $scope.job = {occupation: '', LayName: '', Feature: '', mon_morning: '', mon_afternoon: '', mon_evening: '', tues_morning: '', 
        tues_afternoon: '', tues_evening: '', wed_morning: '', wed_afternoon: '', wed_evening: '', thurs_morning: '', thurs_afternoon: '', thurs_evening: '', 
        fri_morning: '', fri_afternoon: '', fri_evening: '', sat_morning: '', sat_afternoon: '', sat_evening: '', sun_morning: '', sun_afternoon: '', sun_evening: '', 
        MinHours: '', MaxHours: '', MinSalary: '', MaxSalary: '', medical: '', vision: '', discounts: '', dental: '', life: '', stock: '', flexibleSchedule: '', retirement: ''}
       


        filePickerService.setKey(filePickerKey);
        $scope.pickFile = function pickFile(){
            filePickerService.pick(
                {
                    mimetype: 'image/*',
                    services: ['CONVERT', 'COMPUTER', 'FACEBOOK', 'DROPBOX', 'GOOGLE_DRIVE', 'INSTAGRAM', 'WEBCAM'],
                    conversions: ['crop', 'rotate', 'filter']
                },

                onSuccess
            );
        };
 
    
       $scope.positions = $firebaseArray(positionRef);
       app.run(function(editableOptions) {
        editableOptions.theme = 'bs3';
       });

     

        if($scope.profile && $scope.profile.availability){
            $scope.schedule = $scope.profile.availability;
        }


        function onSuccess(Blob){
            $scope.companies.profileImageUrl = Blob.url;
            $scope.business.profileImageUrl = Blob.url;
            $scope.$apply();
        };

        $scope.registerNewBus = function() {
            submitBusinessProfile($scope.business, $scope.HiringManager)
        }

        function submitBusinessProfile(newbusinessObj, managerId) {
            businessService.createNewBusiness(newbusinessObj, managerId);
            $state.go('app.hmDashboard');
        }
    
        $scope.createNewPosition = function() {
            createNewSitePosition($scope.job, $scope.HiringManager)
        }

        function createNewSitePosition(newbusinessObj, managerId) {
            businessService.createNewSitePosition(newbusinessObj, managerId);
            $modalInstance.close();
            $state.go('app.hmPosition');
        }
    
        $scope.hmaddposition = function(){
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/manager/company/hmAddPosition.html',
                controller: 'HMCompanyCtrl as vm',
                
            });
        };

     
}


})();
