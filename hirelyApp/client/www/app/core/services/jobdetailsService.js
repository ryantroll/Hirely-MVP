/**
 * Created by mike.baker on 8/19/2015.
 */

(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('JobdetailsService', ['$q', '$http', JobdetailsService]);

    function JobdetailsService($q, $http) {
  
        var currentJob = '';
        var selected = '';
        var service =  {
            getJob: getJob,
            setJob: setJob
        };
        return service;

        function setJob(selected)
        {
            currentJob = selected;
        }

        function getJob()
        {
            return currentJob;
        }

    }


})();
