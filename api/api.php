<?php
//header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
require_once("pusher.php");


$servername = "allewis08.ipagemysql.com";
$username = "bingoadmin";
$password = "bingo777*";
$dbname = "bingo";
$conn = new mysqli($servername, $username, $password, $dbname);


/*
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bingo";
$conn = new mysqli($servername, $username, $password, $dbname);
*/

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}




$options = array(
    'encrypted' => true
);
$pusher = new Pusher(
    'f3d39d29be1568bb8a86',
    'b45abe3db393f2afdfd9',
    '423800',
    $options
);

/*

*/

$json=[];

if($_POST['action']=="addUser")
{
    $stmt = $mysqli->prepare("INSERT INTO users VALUES (?,?)");
    $stmt->bind_param($_POST['name'],$_POST['type']);

    /* execute prepared statement */
    $stmt->execute();

    die();
}

if($_POST['action']=="newGame")
{
    $uid=mysqli_real_escape_string($conn,$_POST['user']);

    $sql = "insert into game(creator) values('$uid')";

    $result = $conn->query($sql);

    $game_id = mysqli_insert_id($conn);
    //echo "Game ID : " . $game_id;
    $pass= uniquePass($conn);
    //echo "########";
    //$nid=$conn->mysqli_insert_id($conn);
    


    $sql = "insert into users(name,type,password,assigned_game) values('caller',2,'$pass','$game_id')";

    $conn->query($sql);

    $sql = "select * from  game where creator='$uid'";

    $result = $conn->query($sql);



    $i=1;
    while($r = $result->fetch_assoc()){
        games($i,$r,$conn);
        $i++;
    }

    die();
}



if($_POST['action']=="listGames")
{
    $uid=mysqli_real_escape_string($conn,$_POST['user']);

    //echo('User ID: ' . $uid);
    //$result = $conn->query($sql);


    $sql = "select * from  game where creator='$uid'";

    $result = $conn->query($sql);
    $i=1;
    while($r = $result->fetch_assoc()){
        //print_r($r);
        games($i,$r,$conn);
        $i++;
    }

    die();
}



if($_POST['action']=="setCurrentNumber")
{
    $game=mysqli_real_escape_string($conn,$_POST['game']);

    $num=mysqli_real_escape_string($conn,$_POST['num']);

    $result = $conn->query($sql);


    $sql = "update game  set current_number='$num',numbers= CONCAT(numbers, ',', '$num')  where id='$game'";


    $result = $conn->query($sql);





    $data['message'] = $num;
    $data['game'] = $game;

    $pusher->trigger('my-channel', 'my-event', $data);

    die();
}


if($_POST['action']=="joinGame")
{
    $serial=mysqli_real_escape_string($conn,$_POST['serial']);
    //echo($serial);

    //$result = $conn->query($sql);

    $sql = "select * from  players  where serial='$serial'";


    $result = $conn->query($sql);
    $json=$result->fetch_assoc();
    if($result->num_rows==1)
    {

        //$player=$json['id'];
        //$sql = "select * from  cards where player_id='$player'";
        //$result1 = $conn->query($sql);
        //$json['cards']=[];
        //$json['cards']=  $result1->fetch_assoc();

        $json['success']=1;

    }
    else
    {
        $json['success']=0;

    }
    echo json_encode( $json);

    die();
}



if($_POST['action']=="deleteGame")
{
    $id=mysqli_real_escape_string($conn,$_POST['id']);
    $uid=mysqli_real_escape_string($conn,$_POST['user']);

    $sql = "delete from game where id='$id'";

    $result = $conn->query($sql);
echo $conn->error;

    $sql = "delete from users where type=2 and assigned_game='$id'";

    $result = $conn->query($sql);


    $sql = "select * from  game where creator='$uid'";

    $result = $conn->query($sql);
    $i=1;
    while($r = $result->fetch_assoc()){

        games($i,$r,$conn);
        $i++;
    }




    die();
}



if($_POST['action']=="deletePlayer")
{
    $id=mysqli_real_escape_string($conn,$_POST['id']);
    $uid=mysqli_real_escape_string($conn,$_POST['user']);

    $sql = "delete from players where id='$id'";

    $result = $conn->query($sql);


    $sql = "select * from  game where creator='$uid'";

    $result = $conn->query($sql);
    $i=1;
    while($r = $result->fetch_assoc()){

        games($i,$r,$conn);
        $i++;
    }




    die();
}






if($_POST['action']=="addCard")
{
    $game=mysqli_real_escape_string($conn,$_POST['gameId']);
    $pid=mysqli_real_escape_string($conn,$_POST['playerId']);

    $serial=uniqueCardSerial($conn);

    $sql = "insert into cards(player_id,game_id,serial) values('$pid','$game','$serial')";

    $conn->query($sql);

    echo $serial;




    die();
}



if($_POST['action']=="loadCards")
{
    $game=mysqli_real_escape_string($conn,$_POST['gameId']);
    $pid=mysqli_real_escape_string($conn,$_POST['playerId']);


    $sql = "select serial,numbers,played from cards where player_id='$pid' and game_id='$game'";

    $result=$conn->query($sql);

    $arr=[];

    while($y = $result->fetch_assoc()) {
        $y['numbers']=explode(",",unserialize( $y['numbers']));
        $y['played']=explode(",",( $y['played']));

        $arr[]=$y;

    }
    echo json_encode($arr);





    die();
}




if($_POST['action']=="loadFlash")
{
    $game=mysqli_real_escape_string($conn,$_POST['gameId']);


    $sql = "select numbers from game where id='$game'";

    $result=$conn->query($sql);

    $arr=[];

    while($y = $result->fetch_assoc()) {
        $y['numbers']=explode(",",( $y['numbers']));

        $arr[]=$y;

    }
    echo json_encode($arr);





    die();
}



if($_POST['action']=="saveCards")
{
    $game=mysqli_real_escape_string($conn,$_POST['gameId']);
    $pid=mysqli_real_escape_string($conn,$_POST['playerId']);


    //print_r($_POST['numbers']);

    foreach($_POST['numbers'] as $a=>$b)
    {

        echo $a;

        $serial=str_replace("num","",$a);
      $nums= serialize( implode(",",$b));

        $sql = "update  cards set numbers='$nums' where serial='$serial'";

        $result=$conn->query($sql);

    }
    /*
    $sql = "select serial from cards where player_id='$pid' and game_id='$game'";

    $result=$conn->query($sql);

    $arr=[];

    while($y = $result->fetch_assoc()) {
        $arr[]=$y;

    }


    echo json_encode($arr);

*/



    die();
}

if($_POST['action']=="saveNumber")
{
    $serial=mysqli_real_escape_string($conn,$_POST['serial']);
    $number=mysqli_real_escape_string($conn,$_POST['number']);


    //print_r($_POST['numbers']);
    $sql = "update  cards set played= CONCAT(played, ',', '$number') where serial='$serial'";

    $result=$conn->query($sql);







    die();
}



function games($i,$r,$conn)
{

    $sql = "select password from users   where type=2 and assigned_game=".$r['id'];
    $result = $conn->query($sql);
    //echo('*********');
    
    $y = $result->fetch_assoc();
    //print_r($y);
    ?>

    <div style="border: solid 1px;padding:15px;margin-top:15px;">
        <div>Session <?=$i?>  <button class="btn btn-sm btn-info btnAddPlayer"  data-id="<?=$r['id']?>">Add Player</button>
            <button class="btn btn-sm btn-danger btnDeleteGame" data-id="<?=$r['id']?>">Delete Game</button></div>
        <hr/>
        <p>Caller password: <?=$y['password']?></p>

        <table class="table table-striped">
            <thead>
            <tr><th>Player</th><th>Serial</th><th>Action</th></tr>
            </thead>
            <?php
            $sql = "select * from players  where game=".$r['id'];
            $x=1;
            $result = $conn->query($sql);
            $i=1;
            while($y = $result->fetch_assoc()){

                ?>
<tr><td>Player <?=$x?></td><td><?=$y['serial']?></td>

    <td>            <button class="btn btn-sm btn-danger btnDeletePlayer" data-id="<?=$y['id']?>">Delete</button>
</td>


</tr>

                <?php
                $x++;
            }

            ?>
        </table>




    </div>
<?php
}


//$stmt = $conn->prepare("select * from users where name=? and password=? ");
//$stmt->bind_param("superadmin","123");

    /* free results */

if($_POST['action']=="login")
{

    $name=mysqli_real_escape_string($conn,$_POST['name']);
    $p=mysqli_real_escape_string($conn,$_POST['password']);

    $sql = "select * from users where name='$name' and password='$p'";

    $result = $conn->query($sql);
$json=$result->fetch_assoc();
if($result->num_rows==1)
{
    $json['success']=1;

}
else
{
    $json['success']=0;

}
    echo json_encode( $json);

    die();
}


function uniquePass($db)
{
    $ran = mt_rand(100000, 999999);
    $sql = "select password from users where password='$ran'";

    $result = $db->query($sql);
    if($result->num_rows==1)
    {
        uniquePass($db);
    }

    return $ran;

}


function uniqueCardSerial($db)
{
    $ran = mt_rand(100000, 999999);
    $sql = "select id from cards where serial='$ran'";

    $result = $db->query($sql);
    if($result->num_rows==1)
    {
        uniqueCardSerial($db);
    }

    return $ran;

}

//API for adding called number by caller
if($_POST['action']=="addCalledNumber")
{
    $user_id=mysqli_real_escape_string($conn,$_POST['userID']);
    $game_id=mysqli_real_escape_string($conn,$_POST['game']);
    $called_number=mysqli_real_escape_string($conn,$_POST['called_number']);

    $sql = "insert into caller(user_id,game_id,called_number) values('$user_id','$game_id','$called_number')";

    $conn->query($sql);
    
    die();
}

// Add player and generate cards for player
if($_POST['action']=="addPlayer")
{
    $game=mysqli_real_escape_string($conn,$_POST['id']);
    $uid=mysqli_real_escape_string($conn,$_POST['user']);
    $serial=(mt_rand(10000,99999));


    $sql = "insert into players(game,creator,serial) values('$game','$uid','$serial')";

    $result = $conn->query($sql);
    $nid=$conn->insert_id;
    $serial=uniqueCardSerial($conn);

    $sql = "select * from  game where creator='$uid'";

    $result = $conn->query($sql);
    $i=1;
    while($r = $result->fetch_assoc()){

        games($i,$r,$conn);
        $i++;
    }

    
    $numbers = range(1, 20);
    

    shuffle($numbers);
    
    function cardNumber($min, $max, $quantity) {
        $numbers = range($min, $max);
        shuffle($numbers);
        return array_slice($numbers, 0, $quantity);
    }
    
   
    for($cardNum=0; $cardNum < 200; $cardNum++){
        $arrAllNumbers = array();

        for($col=0; $col<5; $col++){
            if($col == 2)
                $quantity = 4;
            else
                $quantity = 5;

            $colBasis = $col;
            $min = 15 * $colBasis + 1;
            $max = 15 * ($colBasis + 1);
            
            $arrColNumbers = cardNumber($min, $max, $quantity);

            $arrAllNumbers = array_merge($arrAllNumbers,$arrColNumbers); 
           
        }
       

        $conAllNumbers = implode(',', $arrAllNumbers);

        $sql = "insert into cards(player_id,game_id,serial, numbers) values('$nid','$game','$serial', '$conAllNumbers')";
        $conn->query($sql);

    }

    die();
}


//Get all card of the player
if($_POST['action']=="getCardsNumber")
{

    $player_id=mysqli_real_escape_string($conn,$_POST['playerID']);
    $game_id=mysqli_real_escape_string($conn,$_POST['gameID']);

    $rows = array();

    $sql = "select * from cards where player_id='$player_id' and game_id='$game_id' ";

    $result = $conn->query($sql);
  
    while($r = $result->fetch_assoc()) {
        $rows[] = $r;
    }
  
    echo json_encode( $rows);

    die();
}

//Get all numbers called from collectors
if($_POST['action']=="getCalledNumbers")
{

    $game_id=mysqli_real_escape_string($conn,$_POST['gameID']);

    $rows = array();

    $sql = "SELECT cards.id, cards.numbers, caller.called_number FROM cards INNER JOIN caller ON cards.game_id=caller.game_id WHERE find_in_set(caller.called_number, cast(cards.numbers as char)) > 0 AND cards.game_id='$game_id' ";

    $result = $conn->query($sql);

  
    while($r = $result->fetch_assoc()) {
        

        //$rows[] = array('MyNumbers' => $r['numbers']);

        $HiddenProducts = explode(',',$r['numbers']);
        
        if (false !== $key = array_search($r['called_number'], $HiddenProducts)) {           
            $r = (object) array_merge( (array)$r, array( 'square_index' => $key ) );
        }
          
        $rows[] = $r;

        //
    }

    //print_r($rows);
    echo json_encode($rows);

    die();
}

if($_POST['action']=="getCallerNumbersLength")
{

    $game_id=mysqli_real_escape_string($conn,$_POST['gameID']);

    $rows = array();

    $sql = "SELECT * FROM caller WHERE game_id='$game_id' ";

    $result = $conn->query($sql);

    $row_cnt = mysqli_num_rows($result);

    echo json_encode($row_cnt);

    die();
}

//Get caller dab numbers
if($_POST['action']=="getCallerNumbers")
{

    $user_id=mysqli_real_escape_string($conn,$_POST['userID']);
    $game_id=mysqli_real_escape_string($conn,$_POST['gameID']);

    $rows = array();

    $sql = "SELECT called_number FROM caller WHERE user_id='$user_id' and game_id='$game_id' ";

    $result = $conn->query($sql);
  
    while($r = $result->fetch_assoc()) {
        $rows[] = $r;
    }
  
    echo json_encode( $rows);

    die();
}