'use strict';
var q = require('q');
var businessService = require('./business.service');

var permissionService = {
    checkPermission: function(permissions, destType, destId) {
        var grant = false;
        var promises = [];

        // console.log("PS:checkPermission:info:0");
        permissions.forEach(function(permission) {
            // console.log("PS:checkPermission:info:1");
            if (permission.destType == '*' || (permission.destType == destType && permission.destId == destId)) {
                grant = true;
            }
            
            
            // If user has a business permission, check if the requested target is a child of business
            // console.log("PS:checkPermission:info:2");
            if (permission.destType == 'businesses') {
                // console.log("PS:checkPermission:info:3");
                promises.push(businessService.getById(permission.destId, {complete:true}).then(function(business) {
                    if (business) {
                        if (destType == "locations" && Object.keys(business.locations).indexOf(destId) != 1) {
                            grant = true;
                        }
                        if (destType == "positions" && Object.keys(business.positions).indexOf(destId) != 1) {
                            grant = true;
                        }
                    }
                }))
            }

            // If user has a location permission, check if the requested target is a child of location
            // console.log("PS:checkPermission:info:4");
            if (permission.destType == 'locations') {
                promises.push(businessService.getByLocationId(permission.destId, {complete:true}).then(function(business) {
                    if (business) {
                        if (destType == "positions" && Object.keys(business.positions).indexOf(destId) != 1) {
                            grant = true;
                        }
                    }
                }))
            }
            // console.log("PS:checkPermission:info:5");
            
        });
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

    isBusinessUser: function(permissions) {
        var isBusinessUser = false;
        permissions.forEach(function(permission) {
            if (['business', 'location', 'position'].indexOf(permission.destType) !== -1) {
                isBusinessUser = true;
            }
        });
        return isBusinessUser;
    }
}/// users object

module.exports = permissionService;
