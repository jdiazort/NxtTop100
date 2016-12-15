angular.module('services.homeService', [])
	.factory('homeService', ['$http', function($http){
		var self;
		self.entries_size = 100;
		return self;
	}]);