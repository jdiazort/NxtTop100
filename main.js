var app = angular.module('WebApp', [
	'ngRoute', 
	'controllers.ArtistsController',
	'controllers.AlbumsController', 
	'controllers.RankingsController',
	'controllers.ChartsController',
	'controllers.oldHomeController',
	'controllers.projectionController'
	]);

app.config( function ($routeProvider) {
	$routeProvider
		.when("/", {templateUrl: "partials/landingpage.html", controller: "MainController"})
		.when("/home", {templateUrl: "partials/home1.html", controller: "MainController"})
		.when("/landingpage", {templateUrl: "partials/landingpage.html", controller: "MainController"})
		.when("/stage01", {templateUrl: "partials/deliverable01.html"})
		.when("/stage02", {templateUrl: "partials/deliverable02.html"})
		.when("/artist", {templateUrl: "partials/artists.html", controller: "ArtistsController"})
		.when("/albums", {templateUrl: "partials/albums.html", controller: "AlbumsController"})
		.when("/rankings",{templateUrl: "partials/rankings.html", controller: "RankingsController"})
		.when("/charts",{templateUrl: "partials/charts.html", controller: "ChartsController"})
		.when("/charts",{templateUrl: "partials/charts.html", controller: "ChartsController"})
		.when("/oldHome", {templateUrl: "partials/oldHome.html", controller: "oldHomeController"})
		.when("/projections",  {templateUrl: "partials/projections.html", controller: "projectionController"})
		.when("/about", {templateUrl: "partials/about.html"})
		.otherwise("404", {templateUrl: "partials/home.html"}) 
});


app.controller('MainController', ['$scope', '$http', function($scope, $http){


	$scope.HomeTitle = "Nxt100";
	$scope.curr_rank_week;
	$scope.data = [];
	$scope.new_data = [];
	$scope.table_data = [];

	var artistMult = {};
	var albumMult = {};
	var totWeeks = {};
	var featMult = {};

	$scope.db_week;

	$http.get('top.php?num=100').then(function(resoponse, callback){
		$scope.data = resoponse.data;
		$scope.curr_rank_week = resoponse.data[0].rank_date;
		$scope.db_week = new Date($scope.curr_rank_week);
	});

	$scope.load_data = function(){

		$http.get("getArtistsMult.php").then(function(response, callback) {
			response.data.forEach( function(obj) {
				artistMult[obj.artist_id] = obj.artist_weight;
			});
			//console.log(artistMult);
		});

		$http.get("getAlbumMult.php").then(function(response, callback) { 
			response.data.forEach( function(obj) {
				albumMult[obj.album_id] = obj.album_weight;
			});
			//console.log(albumMult);
		});
		
 		$http.get("getTotWeeks.php").then(function(response, callback) {
 			response.data.forEach( function(obj) {
				totWeeks[obj.track_id] = obj.weeks;
			});
 		});
		
		
 		$http.get("getFeatMult.php").then(function(response, callback) {
 			response.data.forEach( function(obj) {
				featMult[obj.track_id] = obj.sum;
			});
 		});
 		

	};
	$scope.load_data();
	var test_r_data = [];



	// calculates polynomial and then returns the expected rank value
	$scope.getPolynomialAndRank = function (arr, date) {
		var matrix = [];
		arr.forEach(function(obj){
			var date = new Date(obj.rank_date);
			var rank_int = parseInt(obj.rank);
			var arr = [date.getTime(), rank_int];
			matrix.push(arr);
		});
		var myRegression = regression('polynomial', matrix, 2);
		var i = 0;
		var result = 0;
		var date_int = date.getTime();

		myRegression.equation.forEach(function(coef){
			result += coef*Math.pow(date_int,i);
			//console.log("i  = " + i + "\ncoef = " + coef + "\nresult = " + result);

			i++;
		});
		return result;
	};


	$scope.load_future_week = function (date_str) {

		//alert(date_str);
		var current_date = new Date(date_str);
		var next_week_date = new Date();
		next_week_date = current_date;
		var next_week_str = '';

		//alert(current_date);
		$scope.new_data = [];


		next_week_date.setDate(current_date.getDate()+7);
		next_week_str = next_week_date.toISOString().split('T')[0];
		next_week_date = new Date(next_week_str);

		console.log(next_week_date);
		console.log($scope.db_week);

		//if date is past latest date in db (projecting)
		if (next_week_date > $scope.db_week) {

			//alert(current_date);

			// for all of the songs currently in the board
			//alert("Called load_future_week");
			//console.log($scope.data);
			$scope.data.forEach(function(obj) {
				var new_rank = 0;
				obj.rank;
				obj.rank_date = next_week_str;


				$http.get("regression.php?track_id=" + obj.track_id + "&rank_date="+next_week_str).then(function(resoponse, callback){
					test_r_data  = resoponse.data;

					// The most negative ranking the song has, the better its ranking -- TODO: mapping of all values to values from 1 to 100
					// Ranking starts at the position indicated by the regression
					// if a song is ranked amongst the top 20 will most likely stay in that possition
					new_rank += $scope.getPolynomialAndRank(test_r_data, next_week_date) - 20/Math.abs(obj.rank);
					
					// adding artist weight 
					if (artistMult[obj.artist_id]) {
						new_rank -= artistMult[obj.track_id]*4;
					}
					// adding album weight
					if (albumMult[obj.album_id]) {
						new_rank -= albumMult[obj.track_id]/5;
					}
					// the more weeks a song is in the top, the worst it performs
					if (totWeeks[obj.track_id]){
						new_rank += totWeeks[obj.track_id]/5;
					}
					if (featMult[obj.track_id]){
						new_rank -= featMult;
					}
					//console.log(new_rank);
					obj.rank = new_rank;
					$scope.new_data.push(obj);

					$scope.build_next_week();

				});
				
			});

			//$scope.build_next_week();
			// updating front end variables
			$scope.curr_rank_week = next_week_str;
			$scope.data = [];

		}
		else {
			//alert("date in db");
			console.log("In else");

			$http.get('nextDate.php?date='+date_str).then(function(resoponse, callback){
				$scope.data = resoponse.data;
				$scope.curr_rank_week = next_week_str;
				console.log($scope.data);
			});
		}

	};


	// this function loads the rankings of the previous week
	$scope.load_previous_week = function (date_str) {
		//alert('load');
		var current_date = new Date(date_str);
		current_date.setDate(current_date.getDate()-7);
		var current_date_str = current_date.toISOString().split('T')[0];
		var next_week_date, next_week_str;
		//alert(current_date_str);
		//alert($scope.db_week);
		$scope.new_data = [];
		$scope.curr_rank_week = current_date_str;			

		if (current_date > $scope.db_week) {
			next_week_date = current_date;
			next_week_str = next_week_date.toISOString().split('T')[0];
			//alert("Another future date");

			//alert(current_date);

			// for all of the songs currently in the board
			//alert("Called load_future_week");
			//console.log($scope.data);
			$scope.data.forEach(function(obj) {
				var new_rank = 0;
				obj.rank;
				obj.rank_date = next_week_str;


				$http.get("regression.php?track_id=" + obj.track_id + "&rank_date="+next_week_str).then(function(resoponse, callback){
					test_r_data  = resoponse.data;

					// The most negative ranking the song has, the better its ranking -- TODO: mapping of all values to values from 1 to 100
					// Ranking starts at the position indicated by the regression
					// if a song is ranked amongst the top 20 will most likely stay in that possition
					new_rank += $scope.getPolynomialAndRank(test_r_data, next_week_date) - 20/Math.abs(obj.rank);
					
					// adding artist weight 
					if (artistMult[obj.artist_id]) {
						new_rank -= artistMult[obj.track_id]*4;
					}
					// adding album weight
					if (albumMult[obj.album_id]) {
						new_rank -= albumMult[obj.track_id]/5;
					}
					// the more weeks a song is in the top, the worst it performs
					if (totWeeks[obj.track_id]){
						new_rank += totWeeks[obj.track_id]/5;
					}
					if (featMult[obj.track_id]){
						new_rank -= featMult;
					}
					//console.log(new_rank);
					obj.rank = new_rank;
					$scope.new_data.push(obj);

					$scope.build_next_week();

				});
				
			});

			//$scope.build_next_week();

			// updating front end variables
			$scope.curr_rank_week = next_week_str;
			$scope.data = [];



		} else {
			//alert("ANTONIO: date in db");
			//alert(date_str);
			var next_week_date = new Date();
			var next_week_str = '';

			$http.get('prevDate.php?date='+date_str).then(function(resoponse, callback){
				$scope.data = resoponse.data;
				$scope.curr_rank_week = resoponse.data[0].rank_date;
				console.log($scope.data);
			});
		}

	};


	function sort(values, callback) {
		var length = values.length;
	 	for(var i = 1; i < length; ++i) {
	 		var temp = values[i];
	 		var j = i - 1;
			for(; j >= 0 && values[j].rank > temp.rank; --j) {
	    		values[j+1] = values[j];
	    	}
	    	values[j+1] = temp;
	 	}
	};

	function compareNumbers(a, b) {
	  return a.rank > b.rank;
	}

	$scope.build_next_week = function () {
		console.log($scope.new_data);
		$scope.new_data.sort(compareNumbers);
		console.log($scope.new_data);

		$scope.data = $scope.new_data;
		console.log($scope.new_data);
	};





	$scope.test_regression = function(){
		$http.get("regression.php?track_id=1&rank_date=2016-12-10").then(function(resoponse, callback){
			console.log(resoponse.data);
			test_r_data  = resoponse.data;
			console.log(test_r_data);
			var date = new  Date ('2016-12-09');
			console.log(date.getTime());
		});
	};


	$scope.test_polynomial = function(){
		var matrix = [];
		test_r_data.forEach(function(obj) {
			console.log(obj);
			var date = new Date(obj.rank_date);
			var rank_int = parseInt(obj.rank);
			var arr = [date.getTime(), rank_int];
			matrix.push(arr);
		});
		console.log(matrix);
		var myRegression = regression('polynomial', matrix, 4);
		console.log(myRegression);
		//alert(myRegression.string);
	}

}]); 





