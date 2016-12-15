angular.module('controllers.projectionController', [] )
.controller('projectionController', ['$scope', '$http', function($scope, $http){


	$scope.song = {};
	$scope.curr_song  = {};

	$scope.chart_data 

	$scope.songs_list = [];


	$scope.sidebarToggle = true;
	$scope.changeSidebarToogle = function() {
		$scope.sidebarToggle = !$scope.sidebarToggle;
	};


	$scope.load_chart = function(song) {
		//alert(typeof(song));
		//alert("HEY");
		$scope.curr_song = song;
		$http.get('charts.php?song='+song.track_id).then(function(resoponse){
			$scope.chart_data = resoponse.data;
			show_top();
			//chart.write("chartdiv");
			//chart.invalidateSize();	
		});
	}


	$http.get('top.php?num=50').then(function(resoponse){
		/*
		for (var i=0; i<resoponse.data.length; i++){
			$scope.chart_data.push({
				"rank": resoponse.data[i].rank,
				"rank_date": resoponse.data[i].rank_date
			});
		};
		*/
		$scope.songs_list = resoponse.data;
		$scope.song = resoponse.data[0];
		/*
		$scope.chart_data[$scope.chart_data.length-1].prediction = $scope.chart_data[$scope.chart_data.length-1].rank;

		var next_date = new Date($scope.chart_data[$scope.chart_data.length-1].rank_date);

		alert(typeof(next_date));
		alert($scope.chart_data[$scope.chart_data.length-1].rank_date.toString());
		next_date.setDate(next_date.getDate()+7);

		$scope.chart_data.push({
			"prediction": $scope.chart_data[$scope.chart_data.length-1].rank,
			"rank_date": next_date.toISOString().split('T')[0]
		});

		*/

		$scope.load_chart($scope.song );
		
		//chart.write("chartdiv");
		//chart.invalidateSize();		
	});



	show_top = function (){		
		chart =  new AmCharts.makeChart("chartdiv", {
		    "type": "serial",
		    "theme": "light",
		    "dataDateFormat": "YYYY-MM-DD",
		    "marginRight": 80,
    		"autoMarginOffset": 20,
    		"marginTop": 7,
		    "dataProvider": $scope.chart_data,
		    "valueAxes": [{
		    	"id": "a1",
		    	"integersOnly": true,
		        "reversed": true,
		        "axisAlpha": 0.2,
		        "dashLength": 1,
		        "position": "left",
		    }],
			"mouseWheelZoomEnabled": true,
		    "graphs": [{
		        "id": "g1",
		        "title": "ranking",
		        "balloonText": "[[value]]",
		        "bullet": "round",
		        "bulletBorderAlpha": 1,
		        "bulletColor": "#FFFFFF",
		        "hideBulletsCount": 50,
		        "valueField": "rank",
		        "useLineColorForBulletBorder": true,
		        "balloon":{
		            "drop":true
		        },
		    }, {
		    	"id": "g2",
		    	"title": "trend",
		    	"balloonText": "[[value]]",
		    	"valueField": "prediction",
		    	"type": "line",
		    	"valueAxis": "a1",
		    	"lineColor": "#786c56",
		    	"lineThickness": 1,
		        "bullet": "round",
		        "bulletBorderAlpha": 1,
		        "bulletBorderThickness": 2,
		        "bulletColor": "#786c56",
		        "bulletColor": "#000000",
		        "showBalloon": true,
		        "animationPlayed": true
		    }],
		    "chartScrollbar": {
		        "autoGridCount": false,
		        "graph": "g1",
		        "scrollbarHeight": 40
		    },

		    "chartCursor": {
		       "limitToGraph": "g1",
		       "valueText": "[[value]]"
		    },
		    "legend" : {
		    	"divId": "legenddiv"
		    },
		    "categoryField": "rank_date",
		    "categoryAxis": {
			    "gridPosition": "start",
			    "labelRotation": 45
		    },
		    "export": {
		        "enabled": true
		    }
		});
	}


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
		/*
		var i = 0;
		var result = 0;
		var date_int = date.getTime();
		console.log(myRegression.equation);
		myRegression.equation.forEach(function(coef){
			result += coef*Math.pow(date_int,i);
			//console.log("i  = " + i + "\ncoef = " + coef + "\nresult = " + result);

			i++;
		});

		*/


		return myRegression.equation;
	};



	function sort(values) {
		var length = values.length;
	 	for(var i = 1; i < length; ++i) {
	 		var temp = values[i];
	 		var j = i - 1;
			for(; j >= 0 && values[j].time > temp.time; --j) {
	    		values[j+1] = values[j];
	    	}
	    	values[j+1] = temp;
	 	}
	};


	$scope.projectCurrent = function () {
		console.log($scope.chart_data);
		var curr_date_str = $scope.curr_song.rank_date;
		var curr_date = new Date (curr_date_str);
		var current_ranking = $scope.curr_song.rank;

		var original_data = $scope.chart_data;
		var count = 0;

		var equation = $scope.getPolynomialAndRank(original_data);


		while (current_ranking <= 100 &&  count < 50) {
			var new_date = new Date();
			new_date.setDate(curr_date.getDate()+7);
			console.log($scope.getPolynomialAndRank(original_data,new_date));


			var i = 0;
			var result = 0;
			var date_int = new_date.getTime();
			console.log(equation);
			equation.forEach(function(coef){
				result += coef*Math.pow(date_int,i);
				//console.log("i  = " + i + "\ncoef = " + coef + "\nresult = " + result);
				i++;
			});

			if (result) {
				console.log(result);
				if (result < 0){
					current_ranking = 0;
				}
				else{
					current_ranking = result;
				}
			}
			else {
				current_ranking = current_ranking;
			}

			$scope.chart_data.push({
				"prediction": current_ranking,
				"time": new_date.getTime(),
				"rank_date": new_date.toISOString().split('T')[0]
			});

			curr_date = new_date;
			count++;
		}

		console.log("After");
		console.log($scope.chart_data);


		sort($scope.chart_data);

		console.log($scope.chart_data);

		show_top();

	};


}]); 