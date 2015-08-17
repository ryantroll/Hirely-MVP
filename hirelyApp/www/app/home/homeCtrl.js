/**
 * Created by mike.baker on 8/9/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.home').controller('HomeCtrl', ['$scope', '$state', '$stateParams', 'GeocodeService', HomeCtrl ]);

  function HomeCtrl ($scope, $state, $stateParams, GeocodeService) {
      var geocodeService = GeocodeService;

      $scope.results = '';
      $scope.options = {
          types: '(regions)'
      };

      $scope.details = '';

<<<<<<< Updated upstream

      $scope.getResults = function() {
          geocodeService.setPlace($scope.details);
            $state.go('app.job')

      }

  }
=======
      $scope.onSelect = function(place){
	    var result = { selected :'place' };
	    $state.go('app.job', result);
	  }
	  
	  $scope.selectedJob = $scope.jobs[0];

	  $scope.selectedCity = function(selected){
      var result = { selectedCity :'selected' };
      $state.go('app.job', result);
};
}
    
>>>>>>> Stashed changes
 })();
