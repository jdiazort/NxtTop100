angular.module('controllers.ArtistsController', [] )
.controller('ArtistsController', ['$scope', '$http', function($scope, $http){

	$scope.HomeTitle = "Artists";

	$http.get('tables.php?name=artists').then(function(resoponse){
		$scope.data = resoponse.data;
	});

}]); 