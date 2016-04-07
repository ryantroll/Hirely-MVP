/**
 * Created by Iyad Bitar
 *
 * Traitify Personality Analysis - more info: https://developer.traitify.com
 *
 */
(function () {

    'use strict';

    angular.module('hirelyApp.core')
        .factory('JobApplicationService', ['$q', 'HirelyApiService', JobApplicationService]);

    function JobApplicationService($q, HirelyApiService) {

        var viewStatusLabels = ['New', 'Viewed', 'Aging'];
        var statusLabels = ['Dismiss', 'Applied', 'Contacted', 'Hired', 'Shortlisted'];
        var educationPrograms = ['High School', 'Certificate', 'Associate\'s Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'Professional Degree', 'Doctoral Degree', 'Post-Doctoral Training'];

        /**
         * [service object that define angular service to be returned by factory function at the end of this code]
         * @type {Object}
         */
        var service = {
            create: create,
            update: update,
            isApplicationExists: isApplicationExists,
            getByPositionId: getByPositionId,
            getByUserId: getByUserId,
            getById: getById,
            getStatistics: getStatistics,
            viewStatusLabels: viewStatusLabels,
            statusLabels: statusLabels,
            educationPrograms: educationPrograms
        };


        /**
         * [addNewApplication this will create a new job application object in DB]
         * @param {[type]} jobApp [Job Application obj see models/applications.js for more]
         * @param {[type]} userId [User id to associate this job application with]
         * @param {[type]} jobID  [ID of the Job applicant is applying to]
         */
        function create(jobApp) {
            return HirelyApiService.applications().post(jobApp);
        }//// fun. create

        function update(appId, app){
            return HirelyApiService.applications(appId).patch(app);
        }

        /**
         * [isApplicationExists used to check and retrive job applicaiton object]
         * @param  {[string]}  userID [id of user]
         * @param  {[string]}  jobID  [id of job]
         * @return {promise}        [usually promise will returned]
         */
        function isApplicationExists(userId, positionId) {
            var deferred = $q.defer();

            HirelyApiService.applications({userId: userId, positionId: positionId}).get()
                .then(
                    function (foundedApp) {
                        if (angular.isArray(foundedApp) && foundedApp.length > 0) {
                            deferred.resolve(foundedApp[0]);
                        }
                        else {
                            deferred.reject();
                        }
                    },
                    function (err) {
                        deferred.reject(err);
                    }
                )//// .get().then()

            return deferred.promise;
        }

        function getById(applicationId) {
            var deferred = $q.defer();

            HirelyApiService.applications(applicationId).get()
                .then(
                    function (foundedApp) {
                        deferred.resolve(foundedApp);
                    },
                    function (err) {
                        deferred.reject(err);
                    }
                );//// .get().then()

            return deferred.promise;
        }

        function getByPositionId(posId) {
            var deferred = $q.defer();
            HirelyApiService.applications('byPositionId', posId).get()
                .then(
                    function (found) {

                        if (
                            angular.isDefined(found.applications)
                            && angular.isArray(found.applications)
                            && angular.isDefined(found.users)
                            && angular.isArray(found.users)
                        ) {
                            found.users = applicantsArrayToObject(found.users);
                            found.careerMatchScoress = scoreArrayToObject(found.careerMatchScoress)
                            deferred.resolve(found);
                        }
                        else {
                            deferred.reject('No application found');
                        }
                    },
                    function (err) {
                        deferred.reject(err);
                    }
                )//// .get().then()
            return deferred.promise;
        }//// getPositionById

        function getByUserId(userId) {
            var deferred = $q.defer();
            HirelyApiService.applications('byUserId', userId).get()
                .then(
                    function (found) {
                        deferred.resolve(found);
                    },
                    function (err) {
                        deferred.reject(err);
                    }
                )//// .get().then()
            return deferred.promise;
        }//// getPositionById

        function getStatistics(list) {
            var ret = {};
            ret.total = list.length;
            ret.applied = 0;
            ret.contacted = 0;
            ret.hired = 0;
            ret.declined = 0;
            ret.shortlisted = 0;

            for (var x = 0; x < ret.total; x++) {

                switch (list[x].status) {
                    case 1:
                        ++ret.applied;
                        break;
                    case 0:
                        ++ret.declined;
                        break;
                    case 2:
                        ++ret.contacted;
                        break;
                    case 3:
                        ++ret.hired;
                        break;
                    case 4:
                        ++ret.shortlisted;
                        break;
                }
            }/// for
            return ret;
        }//// fun. getStatistics

        function applicantsArrayToObject(app) {
            var ret = {};
            if (Array.isArray(app) && app.length > 0) {
                for (var x = 0; x < app.length; x++) {
                    ret[app[x]._id] = app[x];
                }
            }

            return ret;
        }//// fun. applicantsArrayToObject

        function scoreArrayToObject(score) {
            var ret = {};
            if (Array.isArray(score) && score.length > 0) {
                for (var x = 0; x < score.length; x++) {
                    ret[score[x].userId] = score[x];
                }
            }
            return ret;
        }


        /**
         * Return server object
         * this way we can have private functions that we don't want to expose
         */
        return service;
    }
})();
