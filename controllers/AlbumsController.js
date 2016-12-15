angular.module('controllers.AlbumsController', [] )
.controller('AlbumsController', ['$scope', '$http', function($scope, $http){

	$scope.HomeTitle = "Albums";

	$http.get('tables.php?name=album').then(function(resoponse){
		$scope.data = resoponse.data;
	});

}]); 
