/**
 *
 * User main dashboard page controller
 *
 * Iyad Bitar - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('UserDashboardController', ['$scope', '$stateParams', '$state', 'AuthService', 'FavoritesService', 'JobApplicationService', 'BusinessService', 'UserService', UserDashboardController]);


  function UserDashboardController($scope, $stateParams, $state, AuthService, FavoritesService, JobApplicationService, BusinessService, UserService) {


    $scope.isAuth = AuthService.isUserLoggedIn();

    $scope.user = AuthService.currentUser;

    var positionIds  = [];

    FavoritesService.getFavorite({userId:AuthService.currentUserID, type:'position'})
    .then(
        function(favs){
            $scope.myFavorites = favs;
            for(var x=0; x< favs.length; x++){
                positionIds.push(favs[x].positionId)
            }
            return JobApplicationService.getByUserId(AuthService.currentUserID)
        },
        function(err){
            console.log(err)
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
            return BusinessService.getPositionById(positionIds);
        },
        function(err){
            console.log(err);
            $scope.dataError = true;
        }
    )
    .then(
        function(positions){
            $scope.positions = positions;
            return BusinessService.getPositionsByManagerId(AuthService.currentUserID);
        },
        function(err){
            console.log(err);
            $scope.dataError = true;
        }
    )
    .then(
        function(positions){
            console.log(positions)
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
        if($scope.isAuth && AuthService.currentUserID){
            var favObj = {
              userId: AuthService.currentUserID,
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
