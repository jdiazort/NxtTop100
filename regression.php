<?php

$servername = 'localhost';
$username	= 'jdiazort';
$password	= 'JorOrt1102P';
$database	= "hot100";

$link = mysqli_connect($servername, $username, $password) 
	or die('Could not connect: ' . mysql_error());

mysqli_set_charset($link, 'utf8');

mysqli_select_db($link, $database) or die('Could not select database');

//echo 'before query';



if ($_GET['track_id'] && $_GET['rank_date']) {
	//echo 'deleted entry with track_id='+$_GET['id'];
	$track_id = $_GET['track_id'];
	$rank_date_str = $_GET['rank_date'];

	$track_id = mysqli_real_escape_string($link, $track_id);
	$rank_date_str = mysqli_real_escape_string($link, $rank_date_str);


	$query = "SELECT * FROM ranking where track_id = $track_id ORDER BY rank_date";
	//echo $query;
	$result = mysqli_query($link, $query) or die('Query failed: ' . mysql_error());
}

$temp_array = array();
while($row = mysqli_fetch_assoc($result)){
	$temp_array[] = $row;
}


$json_table =  json_encode($temp_array);

echo $json_table;


?>