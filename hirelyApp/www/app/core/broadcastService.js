/**
 * Created by labrina.loving on 9/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.core')
        .factory('BroadcastService', ['$rootScope', BroadcastService]);

    function BroadcastService($rootScope) {
        var self = this;

        var service =  {
            send: send
        };
        return service;

        function send(msg, data){
            $rootScope.$broadcast(msg, data);
        }




    }
})();