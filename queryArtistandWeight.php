<?php

$servername = 'localhost';
$username	= 'jdiazort';
$password	= 'JorOrt1102P';
$database	= "hot100";

$link = mysqli_connect($servername, $username, $password) 
	or die('Could not connect: ' . mysql_error());

mysqli_set_charset($link, 'utf8');

mysqli_select_db($link, $database) or die('Could not select database');

if (true) {
	//$artist = $_GET['artist'];
	//$weight = $_GET['weight'];

	$query = "SELECT q1.track_id, q1.track_name, q1.feat_artist, q2.feat_weight FROM feat as q1, artists as q2 WHERE q1.artist_id=q2.artist_id limit 15";

	$result = mysqli_query($link, $query) or die('Query failed: ' . mysql_error());

	$temp_array = array();

	while($row = mysqli_fetch_assoc($result)){
		$temp_array[] = $row;
	}


	$json_table =  json_encode($temp_array);

	echo $json_table;
	}


?>