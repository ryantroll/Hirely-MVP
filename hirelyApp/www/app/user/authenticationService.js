/**
 * Created by labrina.loving on 8/8/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.user').factory('AuthService', ['$firebaseAuth', 'FirebaseUrl',AuthService]);

    function AuthService($firebaseAuth, FirebaseUrl) {
        var self = this;
        var rootRef = new Firebase(FirebaseUrl);

        // Handle third party login providers
        // returns a promise
        function thirdPartyLogin(provider) {
            var deferred = $.Deferred();

            rootRef.authWithOAuthPopup(provider, function (err, user) {
                if (err) {
                    deferred.reject(err);
                }

                if (user) {
                    deferred.resolve(user);
                }
            });

            return deferred.promise();
        };

        return {
            thirdPartyLogin: thirdPartyLogin
        };
    }
})();