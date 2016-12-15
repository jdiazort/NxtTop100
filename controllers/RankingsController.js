angular.module('controllers.RankingsController', [])
.controller('RankingsController', ['$scope', '$http', function($scope, $http){

	$scope.HomeTitle = "Rankings";

	$http.get('tables.php?name=ranking').then(function(resoponse){
		$scope.data = resoponse.data;
	});

}]); 