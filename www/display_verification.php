<?php
mysql_connect("Host Name", "User Name", "User Password") or die("Connection Failed");
mysql_select_db("DataBase Name")or die("Connection Failed");
$name = $_POST['name'];
$query = "select * from test where name = '$name'";
$result = mysql_query($query);
while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
echo $line['name'];
echo $line['age'];
echo "<br>\n";
}
?>