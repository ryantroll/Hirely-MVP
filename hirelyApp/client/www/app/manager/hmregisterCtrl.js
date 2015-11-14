/**
 * Created by mike.baker on 9/29/2015.
 */
(function () {
    'use strict';

    angular.module('hirelyApp.manager').controller('HMRegisterCtrl', ['$scope', '$state', '$firebaseObject', '$firebaseArray', 'FIREBASE_URL', 'AuthService', 'UserService', 'BusinessService',  HMRegisterCtrl ]);
   

    function HMRegisterCtrl($scope, $state, $firebaseObject, $firebaseArray, FIREBASE_URL, AuthService, UserService, BusinessService) {

        var vm = this;
        var authService = AuthService;
        var userService = UserService;
        var businessService = BusinessService;
        var managerId = '';
        var businessRef = new Firebase(FIREBASE_URL + '/businessSite');
        var photoRef = new Firebase(FIREBASE_URL + '/businessPhotos');
       
        $scope.companies = $firebaseArray(businessRef);
        $scope.picturesRef = $firebaseArray(photoRef);
        $scope.split_jobs = [['job1', 'job2', 'job3'], ['job5', 'job6', 'job7']];
    
        $scope.street_number = '';
        $scope.route = '';
        $scope.locality = '';
        $scope.administrative_area_level_1 = '';
        $scope.postal_code = '';
        $scope.country = '';
        $scope.latitude = '';
        $scope.longitude = '';
        $scope.open_store_hours0 = '';
        $scope.closed_store_hours0 = '';
        $scope.open_store_hours1 = '';
        $scope.closed_store_hours1 = '';
        $scope.open_store_hours2 = '';
        $scope.closed_store_hours2 = '';
        $scope.open_store_hours3 = '';
        $scope.closed_store_hours3 = '';
        $scope.open_store_hours4 = '';
        $scope.closed_store_hours4 = '';
        $scope.open_store_hours5 = '';
        $scope.closed_store_hours5 = '';
        $scope.open_store_hours6 = '';
        $scope.closed_store_hours6 = '';
        $scope.error = '';

        $scope.manager = {email: '', password: '', firstName: '', lastName: ''}
        $scope.business = {name: '', description: '', status: '', street_number: $scope.street_number, route: $scope.route, locality: $scope.locality, administrative_area_level_1: $scope.administrative_area_level_1, 
        postal_code: '', country: '', latitude: '', longitude: '', webaddress: '', open_store_hours0: '', 
        closed_store_hours0: '', open_store_hours1: '', closed_store_hours1: '', open_store_hours2: '', closed_store_hours2: '', 
        open_store_hours3: '', closed_store_hours3: '', open_store_hours4: '', closed_store_hours4: '', open_store_hours5: '', 
        closed_store_hours5: '', open_store_hours6: '', closed_store_hours6: ''}




       $scope.options = {
          types: '(regions)'
       };

       $scope.results = '';
       $scope.details = '';
    
        vm.registerNewHMBUS = function() {
            registerPasswordHM($scope.manager, $scope.business)
        }
       
        vm.CloseModal = function (){
            $modalInstance.close();
        }

        function registerPasswordHM(registeredUser, newbusinessObj){
            //register new hiring manager
            authService.registerNewUser(registeredUser.email, registeredUser.password)
                .then(function(manager) {
                    userService.createRegisteredNewUser(registeredUser, manager.uid)
                        .then(function(newUser){
                            authService.passwordLogin(registeredUser.email, registeredUser.password)
                                .then(function(auth){
                                    managerId = manager.uid;
                                    userService.setCurrentUser(newUser, manager.uid);
                                    businessService.createNewBusiness(newbusinessObj, manager.uid);
                                    $modalInstance.close();
                                }, function(err) {
                                    alert(err)
                                });
                        }, function(err) {
                            alert(err)
                        });
                }, function(err) {
                    alert(err)
                })
      $state.go('app.busDashboard');
        }


}


})();
