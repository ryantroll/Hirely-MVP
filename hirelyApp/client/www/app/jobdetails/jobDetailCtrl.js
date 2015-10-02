/**
 * Created by mike.baker on 8/17/2015.
 */

 (function () {
    'use strict';

    angular.module('hirelyApp.jobdetails').controller('JobDetailCtrl', ['$scope', '$state', '$stateParams','PositionService', 'GeocodeService', JobDetailCtrl ]);

    function JobDetailCtrl ($scope, $state, $stateParams, PositionService, GeocodeService) {

        var positionService = PositionService;
        var geocodeService = GeocodeService;
        var params = $stateParams;
        var siteId = $stateParams.siteId;
        var positionId = $stateParams.positionId;
        var placeId = $stateParams.placeId;
        $scope.position = '';
        $scope.wageFormatted = '';
        $scope.hoursFormatted = '';
        $scope.distance = '';
        $scope.photos = [];

        positionService.getPositionbyId(siteId, positionId).then(function (positionObj) {
            var today=new Date();
            $scope.position = positionObj;
            $scope.wageFormatted = positionObj.position.compensation.wage.maxAmount ? getMaxWageDisplay(positionObj.position.compensation.wage) : getnoMaxWageDisplay(positionObj.position.compensation.wage);
            $scope.hoursFormatted =positionObj.position.workHours.max ? positionObj.position.workHours.min + '-' + positionObj.position.workHours.max : positionObj.position.workHours.min + '+'
            var largePhoto = _.matcher({size: "l"});
            var photos =  _.filter(positionObj.businessPhotos, largePhoto);
            angular.forEach(photos, function(photoObj, photoKey) {

                $scope.photos.push(photoObj.source);
            });

           geocodeService.calculateDistancetoSite(siteId, placeId).then(function (distance) {
               $scope.distance = distance;
           }, function (err) {
                //TODO:  add error handling
            });

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

 