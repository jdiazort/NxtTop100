

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


if ($_GET['date']) {
	//echo 'deleted entry with track_id='+$_GET['id'];
	$date= $_GET['date'];
	//echo (gettype($date));
	//echo ($date);
	$date = mysqli_real_escape_string($link, $date);

	$query = "SELECT * FROM ranking, singles, (select rank_date from ranking where rank_date>'$date' order by rank_date, rank limit 1) as q1  WHERE ranking.track_id = singles.track_id and ranking.rank_date = q1.rank_date ORDER BY rank";



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



