var app = angular.module('app', []);

function webglController($scope, $http, $location) {
	var ticketId = $location.absUrl().slice(-1);
	console.log(ticketId);
	
	$scope.id = ticketId;
}