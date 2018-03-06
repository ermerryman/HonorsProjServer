var app = angular.module('app', []);

function resolutionController($scope, $http, $location, $window) {
	$scope.Resolution = {};
	var ticketId = $location.absUrl().slice(-1);
	console.log(ticketId);
	
	$http.get('/api/resolutionForm/'+ticketId).success(function(data) {
		$scope.ticket = data;
	}).error(function(data) {
		console.log('Error: ' + data);
	})
	
	$scope.submitResolution = function() {
		$scope.Resolution.ticketId = ticketId;
		console.log($scope.Resolution);
		var data = $scope.Resolution;
		$http.post('/api/submitResolution/'+ticketId, data).success(function(data) {
			console.log("Success");
			$window.alert("Ticket successfully closed.");
			$window.location.href = '/tickets';
		}).error(function(err) {
			console.log(err);
		})
	}
}