angular.module('controllers.oldHomeController', [])
.controller('oldHomeController', ['$scope', '$http', function($scope, $http){

	$scope.HomeTitle = "Nxt100";

	$http.get('demo.php').then(function(resoponse){
		$scope.data = resoponse.data;
		console.log($scope.data);
	});
	//console.log($scope.data);

	function findAndRemove(array, property, value){
		array.forEach(function(result,index){
			if (result[property] == value) {
				array.splice(index, 1);
			}
		});
	}

	$scope.deleteEntry = function(entry) {
		var xhttp = new XMLHttpRequest();
		//xhttp.onreadystatechange = funciton()
		console.log(entry);

		xhttp.open('GET','queries.php?id='+entry, true);
		//xhttp.onreadystatechange = funciton(){
		//	console.log(entry
		//)};
		xhttp.send();
		//window.location.href = 'dsg1.crc.nd.edu/cse30246/createdb/NctTop100/queries.php?id=' + entry;
		findAndRemove($scope.data, 'track_id', entry);
	}

	$scope.new_song= {
		name: null,
		artist: null,
		artist: null
	};
	$scope.edit_song= {
		id: null,
		name: null,
		artist: null,
		artist: null
	};

	$scope.search_filter;

	$scope.artist;

	$scope.addSong = function() {	
		var xhttp = new XMLHttpRequest();
		//xhttp.onreadystatechange = funciton()
		//console.log(entry);

		xhttp.open('GET','addSong.php?name='+$scope.new_song.name+'&artist='+$scope.new_song.artist+'&album='+$scope.new_song.album, true);
		//xhttp.onreadystatechange = funciton(){
		//	console.log(entry
		//)};
		xhttp.send();
		$http.get('demo.php').then(function(resoponse){
			$scope.data = resoponse.data;
		});
	}

	$scope.editSong = function(){
		var xhttp = new XMLHttpRequest();
		//xhttp.onreadystatechange = funciton()
		//console.log(entry);

		xhttp.open('GET','editSong.php?id='+$scope.edit_song.id+'&name='+$scope.edit_song.name+'&artist='+$scope.edit_song.artist+'&album='+$scope.edit_song.album, true);
		//xhttp.onreadystatechange = funciton(){
		//	console.log(entry
		//)};
		xhttp.send();
		$http.get('demo.php').then(function(resoponse){
			$scope.data = resoponse.data;
		});
	}

	$scope.queryArtist = function(artist){
		
		var xhttp = new XMLHttpRequest();
		//xhttp.onreadystatechange = funciton()
		console.log('Artist = '+artist);
		console.log(typeof(artist));

		xhttp.open('GET','queryArtist.php?artist='+$scope.artist, true);
		//xhttp.onreadystatechange = funciton(){
		//	console.log(entry
		//)};
		xhttp.send();
		
		var q = 'queryArtist.php?artist='+artist;
		console.log(q);
		console.log(typeof(q));
		$http.get(q).then(function(resoponse){
			$scope.data = resoponse.data;
		});	
	}

	$scope.artist_and_weights_data;

	$scope.queryArtistandWeight = function(){
		
		var xhttp = new XMLHttpRequest();
		//xhttp.onreadystatechange = funciton()
		

		xhttp.open('GET','queryArtistandWeight.php', true);
		//xhttp.onreadystatechange = funciton(){
		//	console.log(entry
		//)};
		xhttp.send();
		
		var q = 'queryArtistandWeight.php';
		console.log(q);
		console.log(typeof(q));
		$http.get(q).then(function(resoponse){
			$scope.artist_and_weights_data = resoponse.data;
		});	
	}
}]); 
