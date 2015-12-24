/**
 * Created by labrina.loving on 9/4/2015.
 */

(function () {
    'use strict';

    angular.module('mean.hirely.core')
        .service('FilePickerService', ['$window', FilePickerService]);

    function FilePickerService($window) {
        return $window.filepicker;
    }

})();