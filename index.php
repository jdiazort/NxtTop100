<?php

$servername = 'localhost';
$username	= 'jdiazort';
$password	= 'JorOrt1102P';
$database	= "cse30246";

$link = mysqli_connect($servername, $username, $password) 
	or die('Could not connect: ' . mysql_error());

mysqli_select_db($link, $username) or die('Could not select database');

$query = 'SELECT * FROM user_age';
$result = mysqli_query($link, $query) or die('Query failed: ' . mysql_error());

// convert rmysql result to a PHP array
$temp_array = array();
while($row = mysqli_fetch_assoc($result)){
	$temp_array[] = $row;
}

// convert PHP array to JSON

$json_table =  json_encode($temp_array);

echo $json_table;
?>


<html ng-app="WebApp">
<head>

<!-- jQuery -->
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>

 <!-- Angular.js-->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
<!-- Angular Route 1.5.7--> 
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-route.js"></script>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>


</head>

<body ng-controller="MainController">

<div ng-include="templates/header.html"></div>
<div ng-view></div>
<div ng-include="templates/footer.html"></div>


<!-- Our apps javascript -->
<script type="text/javascript" src="main.js"></script>

</body>
</html>

