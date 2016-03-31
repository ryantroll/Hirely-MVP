'use strict';

var permissionService = {
    checkPermission: function(permissions, destType, destId) {
        var grant = false;
        permissions.forEach(function(permission) {
            if (permission.destType == '*' || (permission.destType == destType && permission.destId == destId)) {
                grant = true;
            }
        });
        return grant;
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
