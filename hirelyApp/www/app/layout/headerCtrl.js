/**
 * Created by labrina.loving on 8/6/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.layout').controller('HeaderCtrl', ['$stateParams', '$scope', '$modal', '$log', HeaderCtrl ]);

    function HeaderCtrl($stateParams, $scope, $modal, $log) {

        var vm = this;
        vm.login = function() {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/user/login.html',
                controller: 'LoginCtrl',
                resolve: {
                    items: function () {

                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    };
})();