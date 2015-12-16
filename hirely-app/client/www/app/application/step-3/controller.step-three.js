/**
 *
 * Job Application Workflow
 *
 * Develoopers - Hirely 2015
 *
 *
 */
(function () {
  'use strict';

  angular.module('hirelyApp').controller('StepThreeController', ['$scope', '$stateParams', 'TraitifyService' ,'TRAITIFY_PUBLIC_KEY', StepThreeController]);


  function StepThreeController($scope, $stateParams, TraitifyService, TRAITIFY_PUBLIC_KEY) {

    $scope.stepThreeLoaded = false;

    Traitify.setPublicKey(TRAITIFY_PUBLIC_KEY);
    Traitify.setHost("api-sandbox.traitify.com");
    Traitify.setVersion("v1");

    TraitifyService.getAssessmentId().then(function (data) {
        var assessmentId =  data.results.id;
        var traitify = Traitify.ui.load(assessmentId, ".personality-analysis", {
          results: {target: ".personality-results"},
          personalityTypes: {target: ".personality-types"},
          personalityTraits: {target: ".personality-traits"}
        });
        // traitify.onInitialize(function(){
        //   $scope.stepThreeLoaded = true;
        //   $scope.$apply();
        // });

        traitify.onInitialize(function(){
          if(traitify.data.get("Slides")){
            $scope.stepThreeLoaded = true;
            $scope.$apply();
          }
          // console.log(traitify.data.get("Slides"));
          // console.log("Initialized");
        });

    });



  }
})();
