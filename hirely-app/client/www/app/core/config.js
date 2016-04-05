/**
 * Created by labrina.loving on 9/7/2015.
 */
(function() {
    'use strict';

    angular
        .module('hirelyApp.core')
        .config(function(NotificationProvider) {
            NotificationProvider.setOptions({
                delay: 5000,
                startTop: 80,
                startRight: 20,
                verticalSpacing: 20,
                horizontalSpacing: 20,
                positionX: 'left',
                positionY: 'top'
            });
    });
})();