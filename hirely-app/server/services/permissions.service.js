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
    }
}/// users object

module.exports = permissionService;