/**
 *
 * User main dashboard page controller
 *
 * Iyad Bitar - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('UserDashboardController', ['$rootScope', '$scope', 'FavoritesService', 'JobApplicationService', 'BusinessService', 'UserService', UserDashboardController]);


  function UserDashboardController($rootScope, $scope, FavoritesService, JobApplicationService, BusinessService, UserService) {

    var positionIds  = [];

    $scope.rootScope = $rootScope;

    $scope.myLocations = [];
    $scope.myPositions = [];

    FavoritesService.getFavorite({userId:$rootScope.currentUserId, type:'position'})
    .then(
        function(favs){
            $scope.myFavorites = favs;
            for(var x=0; x< favs.length; x++){
                positionIds.push(favs[x].positionId)
            }
            return JobApplicationService.getByUserId($rootScope.currentUserId)
        },
        function(err){
            console.log(err);
            $scope.dataError = true;
        }
    )
    .then(
        function(apps){
            $scope.myApplications = apps;
            for(var x=0; x< apps.length; x++){
                if(positionIds.indexOf(apps[x].positionId) < 0){
                    positionIds.push(apps[x].positionId)
                }
            }
            return BusinessService.getPositionsByIds(positionIds);
        },
        function(err){
            console.log(err);
            $scope.dataError = true;
        }
    )
    .then(
        function(positions){
            $scope.positions = positions;
            return BusinessService.getPositionsByManagerId($rootScope.currentUserId);
        },
        function(err){
            console.log(err);
            $scope.dataError = true;
        }
    )
    .then(
        function(positions){

            /**
             * Build my Locations
             */
            $scope.myLocationsObj = {};

            for(var pos in positions){
                if( !(positions[pos].locationId in $scope.myLocationsObj) ){
                    $scope.myLocationsObj[positions[pos].locationId] = [];
                    $scope.myLocationsObj[positions[pos].locationId].push(angular.copy(positions[pos]))
                    $scope.myLocations.push(angular.copy(positions[pos].location));
                }
                else{
                    $scope.myLocationsObj[positions[pos].locationId].push(angular.copy(positions[pos]))
                    $scope.myLocations.push(angular.copy(positions[pos].location));
                }
            }
            console.log($scope.myLocationsObj);
            $scope.myPositions = positions;
        },
        function(err){
            console.log(err);
            $scope.dataError = true;
        }
    )
    .finally(
        function(){
            $scope.dataLoaded = true;
        }
    )

    $scope.favoriteUpdate = function(index, posId, locationId, businessId){
        if($rootScope.currentUserId){
            var favObj = {
              userId: $rootScope.currentUserId,
              positionId: posId,
              locationId: locationId,
              businessId: businessId,
              type: 'position'
            };


            FavoritesService.updateFavorite(favObj)
            .then(
              function(obj){
                if(angular.isDefined(obj._id)){
                  //// favorite is added

                }
                else if(angular.isDefined(obj.deleted)){
                  //// favorite is deleted
                  $scope.myFavorites.splice(index, 1);
                }
              }
            );/// .then
        }//// if
    }//// fun. favoriteUpdate

    $scope.getApplicationStatus = function(status){
        return JobApplicationService.statusLabels[status];
    }//// .getApplicationsStatus

    $scope.getFormatedPhone = function(phone){
        return UserService.formatPhone(phone)
    }//// .getFormatedPhone
  }
})();
