var app = angular.module('app', []);

function equipmentController($scope, $http) {
	$http.get('/api/equipment').success(function(data) {
		$scope.equipment = data;
		//console.log(data);
	}).error(function(data) {
		console.log('Error: ' + data);
	})
}