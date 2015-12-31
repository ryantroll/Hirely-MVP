/**
 * Created by mike.baker on 8/17/2015.
 */

 (function () {
    'use strict';

    angular.module('hirelyApp.jobdetails').controller('JobDetailCtrl', ['$scope', '$state', '$stateParams','JobService', 'GeocodeService', JobDetailCtrl ]);

    function JobDetailCtrl ($scope, $state, $stateParams, JobService, GeocodeService) {

        var jobService = JobService;
        var geocodeService = GeocodeService;
        var params = $stateParams;
        var siteId = $stateParams.siteId;
        var jobId = $stateParams.jobId;
        var placeId = $stateParams.placeId;
        $scope.job = '';
        $scope.wageFormatted = '';
        $scope.hoursFormatted = '';
        $scope.distance = '';
        $scope.photos = [];

        jobService.getJobById(jobId).then(function (jobObj) {
            var today=new Date();
            $scope.job = jobObj;
            $scope.wageFormatted = 1; // jobObj.position.compensation.wage.maxAmount ? getMaxWageDisplay(jobObj.position.compensation.wage) : getnoMaxWageDisplay(jobObj.position.compensation.wage);
            $scope.hoursFormatted = 1; // jobObj.position.workHours.max ? jobObj.position.workHours.min + '-' + jobObj.position.workHours.max : jobObj.position.workHours.min + '+'
            //var largePhoto = _.matcher({size: "l"});
            //var photos =  _.filter(jobObj.businessPhotos, largePhoto);
            //angular.forEach(photos, function(photoObj, photoKey) {
            //
            //    $scope.photos.push(photoObj.source);
            //});

           //geocodeService.calculateDistancetoSite(siteId, placeId).then(function (distance) {
           //    $scope.distance = distance;
           //}, function (err) {
           //     //TODO:  add error handling
           //});

        }, function (err) {
            //TODO:  add error handling
        });

        var getMaxWageDisplay = function(wage)
        {

            return  numeral(wage.minAmount).format('$0.00') + '-' + numeral(wage.maxAmount).format('$0.00');
        }

        var getnoMaxWageDisplay = function(wage)
        {

            return  numeral(wage.minAmount).format('$0.00') + '+';
        }

    }


})();

 