 /**
 * Created by labrina.loving on 8/10/2015.
 */
(function () {
    'use strict';

angular.module('hirelyApp.manager').directive('autoFillableField', [
  '$timeout',
  function($timeout) {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function(scope, element, attrs, ngModel) {

        $timeout(function() {
          if (ngModel.$viewValue !== element.val()) {
            ngModel.$setViewValue(element.val());
          }
        }, 50);
      }
    };
  }
]);
}
)();