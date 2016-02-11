/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('JobListController', ['$scope', '$stateParams', '$state', 'AuthService', 'UserService', 'JobApplicationService', 'HirelyApiService', JobListController]);


  function JobListController($scope, $stateParams, $state, AuthService, UserService, JobApplicationService, HirelyApiService) {

    HirelyApiService.businesses($stateParams.businessSlug).get()
    .then(
        function(business) {

          $scope.business = business;

          /**
           * Build variant array
           */
          $scope.variants = [];
          for(var v in $scope.business.variants){
            $scope.variants.push({id:v, data:$scope.business.variants[v]})
          }

        }//// fun.
    )//// then

    $scope.jobApply = function(index){
        /**
         * build job  url
         */
        var variantSlug = $scope.variants[index].data.slug;
        var posid = $scope.variants[index].data.position_id;
        var positionSlug =  $scope.business.positions[posid].slug;
        var locationSlug = $scope.business.locations[$scope.business.positions[posid].location_id].slug;
        var businessSlug = $scope.business.slug;

        $state.go('application.apply', {businessSlug:businessSlug, locationSlug:locationSlug, positionSlug:positionSlug, variantSlug:variantSlug});
    }
  }
})();
