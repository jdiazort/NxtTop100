angular.module('controllers.ChartsController', [])
.controller('ChartsController', ['$scope', '$http', function($scope, $http){

	$scope.HomeTitle = "Charts";
	$scope.chart_data = {};
	$scope.chart_data2 = new Map();
	$scope.data_arr = [];
	$scope.top_songs = [];
	$scope.loaded_dates = [];

	$scope.songs = [];

	$scope.curr_song;

	$scope.sidebarToggle = true;
	$scope.changeSidebarToogle = function() {
		$scope.sidebarToggle = !$scope.sidebarToggle;
	};

	var chart;
	var new_chart;
	var song = 2;
	var new_graphs= [];

	$http.get('tables.php?name=singles').then(function(response){
		$scope.songs = response.data;
	})

	$scope.load_top_data = function() {
		//console.log(value);
		//console.log('top.php?num='+value);
		$http.get('top.php?num=15').then(function(response1){
			$scope.top_songs = response1.data;
			//console.log("Response1 Length" + response1.data.length);
			angular.forEach(response1.data || [], function(song1){
				$http.get('charts.php?song='+song1.track_id).then(function(response2){
					angular.forEach(response2.data || [], function(song2) {	
						var date = new Date (song2.rank_date);
						var dateNum = date.getTime();
						console.log(date.getTime());
						if ($scope.chart_data2.has(dateNum) ) {
							$scope.chart_data2.get(dateNum)[song1.track_id] = song2.rank;
							//-$scope.chart_data2[song2.rank_date][song1.track_id] = song2.rank;
						}
						else {
							//-$scope.chart_data2[song2.rank_date] = {};
							//-$scope.chart_data2[song2.rank_date][song1.track_id] = song2.rank;
							//-$scope.chart_data2[song2.rank_date].date = song2.rank_date;
							$scope.chart_data2.set(dateNum, {});
							//console.log($scope.chart_data2);
							$scope.chart_data2.get(dateNum)[song1.track_id] = song2.rank;
							$scope.chart_data2.get(dateNum).date = song2.rank_date;
							$scope.chart_data2.get(dateNum).time = dateNum;
						}
						//console.log("value " + $scope.chart_data2[song2.rank_date][song1.track_id]);
						//console.log($scope.chart_data2);
					});
				});	
				var g = new AmCharts.AmGraph();
				g.id = "g"+song1.track_id;
				g.title = song1.track_id;
				g.balloonText = "[[value]]";
				g.bullet = "round";
				g.bulletBorderAlpha = 1;
				g.bulletColor = "#FFFFFF";
				g.hideBulletsCount = 50;
				g.valueField = song1.track_id;
				g.useLineColorForBulletBorder = true;
				balloon = {"drop": true};
				new_graphs.push(g);
				//new_chart.addGraph(g);	
				
			});
		});
	};
	$scope.load_top_data();

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

	$scope.load_top_chart = function (){
		//alert("load_top_data called");
		//while (req2_ended === false || req1_ended === false) {
			//console.log($scope.chart_data2);
			//console.log($scope.chart_data2.values());
			//console.log("Size " + $scope.chart_data2.size);


			for (const value of $scope.chart_data2.values() ) {
				$scope.data_arr.push(value);
			};

			//console.log($scope.data_arr);
			sort($scope.data_arr);
			//console.log($scope.data_arr);
			//console.log($scope.data_arr);

		//}

		new_chart =  new AmCharts.makeChart("chartdiv_2", {
		    "type": "serial",
		    "theme": "light",
		    "dataDateFormat": "YYYY-MM-DD",
		    "marginRight": 80,
    		"autoMarginOffset": 20,
    		"marginTop": 7,
		    "dataProvider": $scope.data_arr,
		    "valueAxes": [{
		    	"id": "a1",
		    	"integersOnly": true,
		        "reversed": true,
		        "axisAlpha": 0.2,
		        "dashLength": 1,
		        "position": "left",
		    }],
		    "graphs": new_graphs,
			"mouseWheelZoomEnabled": true,
		    "chartScrollbar": {
		        "autoGridCount": false,
		        "graph": "g1",
		        "scrollbarHeight": 40
		    },
		    "chartCursor": {
		       "limitToGraph": "g1",
		       "valueText": "[[value]]"
		    },
		    "categoryField": "date",
		    "categoryAxis": {
			    "gridPosition": "start",
			    "labelRotation": 45
		    },
		    "export": {
		        "enabled": true
		    }
		});
		//console.log(new_chart);
		new_chart.write("chartdiv_2");

	};



	$http.get('charts.php?song='+song).then(function(resoponse){
		/*
		for (var i=0; i<resoponse.data.length; i++){
			$scope.chart_data.push({
				"rank": resoponse.data[i].rank,
				"rank_date": resoponse.data[i].rank_date
			});
		};
		*/
		$scope.chart_data = resoponse.data;
		$scope.chart_data[$scope.chart_data.length-1].prediction = $scope.chart_data[$scope.chart_data.length-1].rank;

		var next_date = new Date($scope.chart_data[$scope.chart_data.length-1].rank_date);

		//alert(typeof(next_date));
		//alert($scope.chart_data[$scope.chart_data.length-1].rank_date.toString());
		next_date.setDate(next_date.getDate()+7);

		$scope.chart_data.push({
			"prediction": $scope.chart_data[$scope.chart_data.length-1].rank,
			"rank_date": next_date.toISOString().split('T')[0]
		});

		$scope.load_top_data();

		
		//chart.write("chartdiv");
		//chart.invalidateSize();		
	});


}]); 

