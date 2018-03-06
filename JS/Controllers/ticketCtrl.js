var app = angular.module('app', []);

function ticketController($scope, $http) {
	
	$http.get('/api/tickets').success(function(data) {
		$scope.tickets = data;
	}).error(function(data) {
		console.log('Error: ' + data);
	})
}