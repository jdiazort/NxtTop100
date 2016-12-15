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



if ($_GET['song']) {
	//echo 'deleted entry with track_id='+$_GET['id'];
	$id = $_GET['song'];
	$id = mysqli_real_escape_string($link, $id);
	$query = "SELECT * FROM ranking where track_id=$id;";
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