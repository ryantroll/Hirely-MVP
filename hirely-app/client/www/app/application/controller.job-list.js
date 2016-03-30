/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('JobListController', ['$scope', '$stateParams', '$state', 'AuthService', 'UserService', 'JobApplicationService', 'HirelyApiService', JobListController]);


  function JobListController($scope, $stateParams, $state, authService, userService, JobApplicationService, HirelyApiService) {

    delete $scope.layoutModel.noHeader;
    delete $scope.layoutModel.business;
    delete $scope.layoutModel.location;
    delete $scope.layoutModel.position;

    HirelyApiService.businesses($stateParams.businessSlug).get()
    .then(
        function(business) {

          $scope.business = business;

          /**
           * Build variant array
           */
          $scope.positions = [];
          for(var v in $scope.business.positions){
            $scope.positions.push({id:v, data:$scope.business.positions[v]})
          }

        }//// fun.
    )//// then

    $scope.jobApply = function(index){
        /**
         * build job  url
         */
        var pos = $scope.business.positions[$scope.positions[index].id];
        var positionSlug =  pos.slug;
        var locationSlug = $scope.business.locations[pos.location_id].slug;
        var businessSlug = $scope.business.slug;

        $state.go('application.apply', {businessSlug:businessSlug, locationSlug:locationSlug, positionSlug:positionSlug});
    }
  }
})();
