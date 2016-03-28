/**
 * Created by labrina.loving on 8/16/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.candidate').controller('CandidateDashboardCtrl', ['$scope','$stateParams', CandidateDashboardCtrl ]);


    function CandidateDashboardCtrl($scope, $stateParams) {

        
        $scope.uiGridOptions  = {
            data: 'recentApps',
            columnDefs: [{
                field: 'company'
            }, {
                field: 'position'
            }, {
                field: 'application date'
            },
                {
                    field: 'current status'
                }
            ]
        };

        $scope.recentApps = [];

        if($scope.user.Applications){
            $scope.recentApps = $scope.user.Applications;
        }

        // Chart.js Data
        $scope.data = [
            {
                value: 5,
                color:'#FFA540',
                highlight: '#BF7C30',
                label: 'Review'
            },
            {
                value: 2,
                color: '#38A2D0',
                highlight: '#5AD3D1',
                label: 'Interview Scheduled '
            },
            {
                value: 1,
                color: '#37DB79',
                highlight: '#FFC870',
                label: 'Passed'
            }
        ];

        // Chart.js Options
        $scope.options =  {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke : true,

            //String - The colour of each segment stroke
            segmentStrokeColor : '#fff',

            //Number - The width of each segment stroke
            segmentStrokeWidth : 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout : 50, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps : 100,

            //String - Animation easing effect
            animationEasing : 'easeOutBounce',

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate : true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale : false,

            showLegend: false

          };



    }
})()
;
