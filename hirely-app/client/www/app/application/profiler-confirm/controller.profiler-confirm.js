
(function () {
    'use strict';

    angular.module('hirelyApp')
        .controller('ProfilerConfirmController', ['$scope', '$state', '$stateParams', '$timeout', 'AuthService', 'JobApplicationService', ProfilerConfirmController]);


    function ProfilerConfirmController($scope, $state, $stateParams, $timeout, AuthService, JobApplicationService) {

        //// wait for destroy event to update data
        $scope.$on('$destroy', function (event) {

            // If "Finish" was clicked, update the status of the application
            if ($scope.destroyDirection) {
                console.log("'Submit' was clicked, update the status of the profile");

                // Create history entry
                var historyEntry = {
                    time: new Date(),
                    type: 'StatusChange',
                    subject: "Status changed from "+JobApplicationService.statusLabelsHm[$scope.application.status]+" to "+JobApplicationService.statusLabelsHm[4],
                    body: "Status changed from "+JobApplicationService.statusLabelsHm[$scope.application.status]+" to "+JobApplicationService.statusLabelsHm[4],
                    meta: {
                        fromStatus: $scope.application.status,
                        toStatus: 4
                    },
                    userId: AuthService.currentUserId,
                    userFirstName: AuthService.currentUser.firstName,
                    userLastName: AuthService.currentUser.lastName
                };

                if (!$scope.application.history || !$scope.application.history.length) {
                    $scope.application.history = [];
                }
                $scope.application.history.push(historyEntry);

                $scope.application.status = 4;
                $scope.application.appliedAt = new Date();

            }

            JobApplicationService.save($scope.application)
                .then(
                    function () {
                        console.log("Profile created");
                    },//// save resolve
                    function (err) {
                        console.log(err);
                        alert('Error while saving your profile\nPlease try again');
                    }//// save reject
                );//// save().then()
        });

    }
})();
