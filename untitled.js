
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
		show_top();

		
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




/*
	function swap(items, firstIndex, secondIndex){
	    var temp = items[firstIndex];
	    items[firstIndex] = items[secondIndex];
	    items[secondIndex] = temp;
	}
	function partition(items, left, right) {

	    var pivot   = items[Math.floor((right + left) / 2)],
	        i       = left,
	        j       = right;
	     pivot = new Date(pivot);


	    while (i <= j) {
	    	var i_date = new Date(items[i]);
	        while (i_date.getUTCSeconds() < pivot.getUTCSeconds()) {
	            i++;
	        }
	        var j_date = new Date(items[j]);
	        while (j_date.getUTCSeconds()  > pivot.getUTCSeconds()) {
	            j--;
	        }

	        if (i <= j) {
	            swap(items, i, j);
	            i++;
	            j--;
	        }
	    }

	    return i;
	}

	function quickSort(items, left, right) {

	    var index;

	    if (items.length > 1) {

	        index = partition(items, left, right);

	        if (left < index - 1) {
	            quickSort(items, left, index - 1);
	        }

	        if (index < right) {
	            quickSort(items, index, right);
	        }

	    }

	    return items;
	}

*/
