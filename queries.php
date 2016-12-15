<?php

$servername = 'localhost';
$username	= 'jdiazort';
$password	= 'JorOrt1102P';
$database	= "hot100";

$link = mysqli_connect($servername, $username, $password) 
	or die('Could not connect: ' . mysql_error());

mysqli_set_charset($link, 'utf8');

mysqli_select_db($link, $database) or die('Could not select database');

if ($_GET['id']) {
	//echo 'deleted entry with track_id='+$_GET['id'];
	$id = $_GET['id'];
	$id = mysqli_real_escape_string($link, $id);
	$query = "DELETE FROM singles_backup WHERE track_id='$id'";
	echo $query;
	$result = mysqli_query($link, $query) or die('Query failed: ' . mysql_error());
}


?>