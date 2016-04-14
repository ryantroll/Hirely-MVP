'use strict';
var q = require('q');
var BusinessService = require('./business.service');

var permissionService = {
    checkPermission: function(userPermissions, permObj) {
        var grant = false;
        var promises = [];

        // TODO:  Check CRUD level perms

        // console.log("PS:checkPermission:info:0");
        // userPermissions.forEach(function(permission) {
        for (let userPerm of userPermissions) {
            // console.log("PS:checkPermission:info:1");
            if (userPerm.destType == '*' || (userPerm.destType == permObj.destType && userPerm.destId == permObj.destId)) {
                // console.log("PS:checkPermission:info:1.1: isSuperUser=true");
                var deferred = q.defer();
                deferred.resolve(true);
                return deferred.promise;
            }
            
            
            // If user has a business permission, check if the requested target is a child of business
            // console.log("PS:checkPermission:info:2");
            if (userPerm.destType == 'businesses') {

                // console.log("PS:checkPermission:info:3");
                promises.push(BusinessService.getById(userPerm.destId, {complete:true}).then(function(business) {
                    if (business) {
                        if (permObj.destType == "locations" && Object.keys(business.locations).indexOf(permObj.destId) != 1) {
                            grant = true;
                        }
                        if (permObj.destType == "positions" && Object.keys(business.positions).indexOf(permObj.destId) != 1) {
                            grant = true;
                        }
                    }
                }))
            }

            // If user has a location permission, check if the requested target is a child of location
            // console.log("PS:checkPermission:info:4");
            if (userPerm.destType == 'locations') {
                promises.push(BusinessService.getByLocationId(userPerm.destId, {complete:true}).then(function(business) {
                    if (business) {
                        if (permObj.destType == "positions" && Object.keys(business.positions).indexOf(permObj.destId) != 1) {
                            grant = true;
                        }
                    }
                }))
            }
            // console.log("PS:checkPermission:info:5");
            
        };
        return q.all(promises).then(
            function () {
                // console.log("PS:checkPermission:info:6");
                return grant;
            },
            function (err) {
                console.error("PS:checkPermission:error:7 " + err);
                return null;
            }
        )

    },

    checkPermissions: function(userPermissions, permObjs) {
        var promises = [];

        permObjs.forEach(function(permObj) {
            promises.push(permissionService.checkPermission(userPermissions, permObj));
        });

        return q.all(promises).then(
            function (grants) {
                // console.log("PS:checkPermission:info:6");
                var grant = true;

                // If any grants fail, then fail overall
                grants.forEach(function(grant2) {
                    if (!grant2) {
                        grant = false;
                    }
                });
                return grant;
            },
            function (err) {
                console.error("PS:checkPermission:error:7 " + err);
                return null;
            }
        )
    },

    isBusinessUser: function(userPermissions) {
        var isBusinessUser = false;
        userPermissions.forEach(function(userPerm) {
            if (['business', 'location', 'position'].indexOf(userPerm.destType) !== -1) {
                isBusinessUser = true;
            }
        });
        return isBusinessUser;
    }
}/// users object

module.exports = permissionService;
