/**
 * Created by labrina.loving on 9/7/2015.
 */
(function() {
    'use strict';

    angular
        .module('hirelyApp.core')

        .config(function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                key: '711561845732-pg1q3d3cn30f4jk07bmqno9qeio7unmg.apps.googleusercontent.com',
                v: '3.20', //defaults to latest 3.X anyhow
                libraries: 'weather,geometry,visualization'
            });
        })
})();