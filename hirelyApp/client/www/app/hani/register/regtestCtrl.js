(function() {

    angular.module('hirelyApp').controller('regtestCtrl', ['$scope', regtestCtrl ]);


function regtestCtrl($scope)
{
	$scope.user =  {firstname:'', lastname:'', email:'', password:''};

	$scope.print_registeriaion_info = function () {
		console.log("firstname = " + $scope.user.firstname);
		console.log("lastname = " + $scope.user.lastname);
		console.log("email = " + $scope.user.email);
		console.log("password = " + $scope.user.password);
}

}


})();