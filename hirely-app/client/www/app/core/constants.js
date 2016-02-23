/**
 * Created by labrina.loving on 8/8/2015.
 */
(function() {
    'use strict';

    angular
        .module('hirelyApp.core')
        // version of this seed app is compatible with angularFire 0.6
        // see tags for other versions: https://github.com/firebase/angularFire-seed/tags
        .constant('version', '0.6')

        // where to redirect users if they need to authenticate (see module.routeSecurity)
        .constant('loginRedirectPath', 'app.home')

        // your Firebase URL goes here
        .constant('FIREBASE_URL', 'https://hirely-dev.firebaseio.com')

        .constant('GOOGLEMAPSURL', 'https://maps.google.com/maps/api/geocode/json?latlng={POSITION}&sensor=false')

        .constant('filePickerKey', 'AALU2i7ySUuUi8XUDHq8wz')

        .constant('GOOGLEMAPSSERVERKEY', 'AIzaSyDoM7YVRZsYdeoJ3XezTX-l_eCgFz2EqfM')

        .constant('GOOGLEPLACESURL', 'https://maps.googleapis.com/maps/api/place/details/json?placeid={PLACEID}&key={KEY}')

        .constant('candidateStatus', {1: 'Active', 2: 'Employed', 3: 'Inactive'})

        .constant('RESPONSE', {success: {code: '1', status: 'ok'}, error: {code: '0', status: 'error'}})

        .constant('TRAITIFY_PUBLIC_KEY', "vjcprrh344sj6d5jbs80b4tjns")

        .constant('AMAZON_S3_CREDS', {
            bucket_url:'http://hirely.io.s3-website-us-east-1.amazonaws.com',
            // bucket:'arn:aws:s3:::hirely.io',
            bucket:'hirely.io',
            'access_key': 'AKIAJGQYT2PTNFUBUJ2Q',
            'secret_key': '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'
        });
})();