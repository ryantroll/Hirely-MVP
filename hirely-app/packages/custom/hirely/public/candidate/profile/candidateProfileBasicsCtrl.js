/**
 * Created by labrina.loving on 8/28/2015.
 */

(function () {
    'use strict';

    angular.module('mean.hirely.candidate').controller('CandidateProfileBasicsCtrl', ['$scope','$state','$stateParams', 'FilePickerService', 'filePickerKey','UserService', 'CandidateService', CandidateProfileBasicsCtrl ]);


    function CandidateProfileBasicsCtrl($scope, $state,$stateParams, FilePickerService, filePickerKey, UserService, CandidateService) {
        var userService = UserService;
        var filePickerService = FilePickerService;
        var candidateService = CandidateService;

        var vm = this;
        $scope.results = '';
        $scope.options = {
            types: '(regions)'
        };
        $scope.details = '';
        $scope.candidate = {authorizedInUS: false};

        if($scope.profile && $scope.profile.candidate){

            $scope.candidate = $scope.profile.candidate;
        }

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

        function onSuccess(Blob){
            $scope.user.profileImageUrl = Blob.url;
            $scope.$apply();
        };

        $scope.submitProfile = function() {

            userService.saveUser($scope.user);
            candidateService.saveCandidate($scope.candidate, $scope.user.userId);
            $state.go('app.candidate.profile.experience');
        }
    }
})()
;

