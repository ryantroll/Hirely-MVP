/**
 * Created by labrina.loving on 9/28/2015.
 */
/**
 * Created by labrina.loving on 9/6/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateProfileExperienceCtrl', ['$scope','$state','$stateParams', 'CandidateService', 'OccupationService', CandidateProfileExperienceCtrl ]);


    function CandidateProfileExperienceCtrl($scope, $state,$stateParams, CandidateService, OccupationService) {
        var occupationService = OccupationService;
        var candidateService = CandidateService;
        function experienceModel(){
            this.company = {
                place: '',
                name: '',
                result: '',
            }
            this.occupation = '';
            this.location = {
                place: '',
                name: ''
            };
            this.startDate = '';
            this.endDate = '';
            this.currentlyWorking = false;
        }

        $scope.occupation = '';
        $scope.experience = {
        };

        $scope.startDate = '';
        $scope.endDate = ''
        $scope.experiences = [];
        $scope.occupations = [];

        $scope.companyDetails = '';
        $scope.companyResults = '';
        $scope.companyOptions = {
            types:  'establishment'
        };

        $scope.locationDetails = '';
        $scope.locationResults = '';
        $scope.locationOptions = {
            types: '(regions)'
        };

        $scope.addExperience = false;


        $scope.showExperience = function(){
            $scope.addExperience = true;
            $scope.experience = new experienceModel();
        };

        $scope.cancelExperience = function(){
            clearExperience();

        };

        $scope.saveExperience = function(){
            $scope.experience.startDate = $scope.startDate.toJSON();
            if($scope.endDate){
                $scope.experience.endDate = $scope.endDate.toJSON();
            }

            if($scope.companyResults && !$scope.experience.company.name)
            {
                $scope.experience.company.name = $scope.companyResults;
            }

            if($scope.experience.$id)
            {
                $scope.experiences.$save($scope.experience).then(function(ref){
                    clearExperience();

                });
            }
            else{
                $scope.experiences.$add($scope.experience);
                clearExperience();
            }


        }

        $scope.companySet = function(){

            if($scope.companyResults && $scope.companyDetails)
            {
                $scope.experience.company.place = $scope.companyDetails.id;
                $scope.experience.company.result = $scope.companyResults;
                $scope.experience.company.name = $scope.companyDetails.name;
                $scope.experience.location.place = $scope.companyDetails.id;
                var address = $scope.companyDetails.address_components;

                $scope.experience.location.name = address[2].long_name + ', ' + address[3].short_name + ', ' + address[4].long_name;
                $scope.locationResults =  $scope.experience.location.name;
                $scope.$apply();
            }

        }

        $scope.locationSet = function(){

            if($scope.locationResults && $scope.locationDetails)
            {
                $scope.experience.location.place = $scope.locationDetails.id;
                $scope.experience.location.name = $scope.locationResults;

                $scope.$apply();
            }

        }
        $scope.editExperience = function(key){
            $scope.experience = $scope.experiences.$getRecord(key);

            $scope.startDate = new Date($scope.experience.startDate);
            if($scope.experience.endDate){
                $scope.endDate = new Date($scope.experience.endDate);
            }


            $scope.companyResults = $scope.experience.company.result;

            $scope.locationResults = $scope.experience.location.name;
            $scope.addExperience = true;

        }



        $scope.deleteExperience = function(key){
            var item = $scope.experiences.$getRecord(key);
            if(item)
            {
                $scope.experiences.$remove(item).then(function(ref) {

                });
            }


        }

        var getOccupations = function(){
            occupationService.getOccupations().then(function(occupations) {
                $scope.occupations = occupations;

            }, function(err) {

            });
        };

        var getExperience = function() {
              $scope.experiences = candidateService.getExperience($scope.user.userId);

        }

        var clearExperience = function(){
            $scope.experienceForm.$setPristine();
            $scope.experience = new experienceModel();
            $scope.addExperience = false;
            $scope.startDate = '';
            $scope.endDate = ''

            $scope.companyDetails = '';
            $scope.companyResults = '';


            $scope.locationDetails = '';
            $scope.locationResults = '';

        }
        var initialize = function(){
            getOccupations();
            if($scope.profile && $scope.profile.experience){
                $scope.experiences = $scope.profile.experience;
            }

        };

        initialize();

    }
})()
;
