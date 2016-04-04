'use strict';
var q = require('q');
var businessService = require('./business.service');

var permissionService = {
    checkPermission: function(permissions, destType, destId) {
        var grant = false;
        var promises = [];
        
        permissions.forEach(function(permission) {
            if (permission.destType == '*' || (permission.destType == destType && permission.destId == destId)) {
                grant = true;
            }
            
            
            // If user has a business permission, check if the requested target is a child of business 
            if (permission.destType == 'businesses') {
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
            if (permission.destType == 'locations') {
                promises.push(businessService.getByLocationId(permission.destId, {complete:true}).then(function(business) {
                    if (business) {
                        if (destType == "positions" && Object.keys(business.positions).indexOf(destId) != 1) {
                            grant = true;
                        }
                    }
                }))
            }
            
        });
        return q.all(promises).then(function() {
            return grant;
        });
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
