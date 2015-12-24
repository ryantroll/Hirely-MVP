/**
 *
 * Job Application Workflow Main Controller
 *
 * Develoopers - Hirely 2015
 *
 *
 */
(function () {
  'use strict';

  angular.module('mean.hirely').controller('StepFiveController', ['$scope', '$stateParams', 'multiStepFormInstance', 'GeocodeService', StepFiveController])
  .filter('hourRangesByDay', function(){
        return function(hours, day){
          var result = [];

          angular.forEach(hours, function(hour){
            var obj = {};
            
              obj.start = '6AM';
              obj.end = '8AM';
            
           
            result.push(obj);
          })
          return result;
        }
      })

  function StepFiveController($scope, $stateParams, multiStepFormInstance, GeocodeService) {

    $scope.today = function() {
    $scope.startDate = new Date();
    };
      $scope.today();

      $scope.clear = function () {
        $scope.startDate = null;
      };


      $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();
      $scope.maxDate = new Date(2020, 5, 22);

      $scope.openDatePicker = function($event) {
        $scope.status.opened = true;
      };

      $scope.setDate = function(year, month, day) {
        $scope.startDate = new Date(year, month, day);
      };

      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

      $scope.status = {
        opened: false
      };



      $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);

          for (var i=0;i<$scope.events.length;i++){
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }

        return '';
      };

      //// pattern to restrict number input only;
      $scope.onlyNumbers = /^\d+$/;

      /**
       * Weekely Time Table 
       */
    
        
    //// build and initiate time table array 
      var weeklyTimetable = [];
      for(var h=0; h<24; h++){
        var hourLabel = '';
        if(0==h){
            hourLabel += '12AM';
        }
        else if(h<12){
            hourLabel += String(h) + 'AM';
        }
        else{
            hourLabel += String(h-12 <= 0 ? 12 : h-12) + 'PM';
        }
        weeklyTimetable[h] = {
            'label': hourLabel,
            'days':{
                'su' : false,
                'mo' : false,
                'tu' : false,
                'we' : false,
                'th' : false,
                'fr' : false,
                'sa' : false
            }
          };
      }//// for

      $scope.weeklyTimetable = weeklyTimetable;

      
  }////fun. stepFiveController
})();