//window.onload = initAll;
var usedNums = new Array(76);
var totalCard;


var config={};
//config.url="http://localhost:5800/bingo_ver2_api/api.php";
//config.url="http://www.a7labs.us/bingo/api.php";
config.url="../api/api.php";


Pusher.logToConsole = true;

var pusher = new Pusher('f3d39d29be1568bb8a86', {
	encrypted: true
});

var channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
	console.log('***** Channel Bind');
	console.log(localStorage.game)
	if(data.game==localStorage.game)
	{

		$val=data.message;
		$("#bingo_flashboardPlayers td").filter(function() {
			return $(this).text() == $val;
		}).css({background:"red",color:"white"});

		$("#current_game_number").html(data.game);

		$("#current_number").html(data.message);

	}
});

var winningOption = 0;
var winningCard = ['bingo_card', 'bingo_card1', 'bingo_card2', 'bingo_card3'];

var winnersArray = [
  new Array(31, 99, 792, 924, 992, 15360, 507904, 541729, 557328, 1083458, 2162820, 4329736),
  new Array(8912913, 12976128, 3784704, 231, 15138816),
  new Array(8519745, 8659472, 16252928, 1622016, )
];
var currentWinnerIndex = 0;
var isDoubleBingoCard = false;
var $bingoPanel = 'bingo_div';
var $bingoCard = 'bingo_card';


//Check state or page
config.checkState= function(){
	console.log('***** checkCstate');
	if(localStorage.isloggedin==1)	{
		$("#login").hide();
		//$("#game").show();
		if(localStorage.type==1)
		{
			$("#admin").show();

			$.post(config.url,{action:'listGames',user:localStorage.userID},function(e){
				$("#listGames").html(e)
			});
		}

		if(localStorage.type==2){
			$("#flash").show().load("flashboard.html");
			$("#enter").hide();

			$.post(config.url,{action:'getCallerNumbers',userID:localStorage.userID, gameID:localStorage.game},function(callerNumbers){	
			 	$.each(JSON.parse(callerNumbers), function( key, val ) {
				    console.log('Caller Numbers : ' + key, val);
				    $("#" + val.called_number).addClass('colorYellow').removeClass('colorRed');
		 	    });
			})
		}

		if(localStorage.type=='player')		{
			$("#game").show();
		}
	}else{
		$("#login").show();
		$("#admin,#game,#flash").hide();
	}
}
config.checkState();


//Start of the function
/*
function initAll() {
	if (document.getElementById) {
		//document.getElementById("reload").onclick = anotherCard;
		newCard('');
	}
	else {
		alert("Sorry, your browser doesn't support this script");
	}

	console.log('initAll');
}
*/

//Functions when New Card button is clicked
/*
$(document).on("click",".reload",function()
{


	$id=$(this).closest("table").attr("id");
	newCard($id);

	console.log('.reload');
})
*/

//Function when playCard class is clicked
/*
$(document).on("click",".playCard",function()
{

	$(this).hide();
	$(this).prev().hide();

	var nums={};

	$p= $(this).closest("table");

	nums["num"+$p.data("serial")]=[];

	$p.find("td").each(function()
	{
		n=$(this).text();
		nums["num"+$p.data("serial")].push(n);
	})

	setTimeout(function()
	{
		$.post(config.url,{action:'saveCards',gameId:localStorage.game,playerId:localStorage.playerID,numbers:nums},function(e)
		{

		});
	},500)

	console.log('.playCard');

	//$(".reload").remove();

})
*/

/*
function setNumbers(card,nums,played)
{

	var $c=0;



	$("#enter,.reload").hide();
	$(card).find(".playCard").hide();

	$(card).find("td").each(function()
	{
		$(this).text(nums[$c]);

		if(jQuery.inArray(nums[$c], played) !== -1)
		{
			$(this).addClass("pickedBG");

		}

			$c++;
	})
	console.log('setNumbers');
}
*/

/*
function loadCards()
{

	$c=0;
	$.post(config.url,{action:'loadCards',gameId:localStorage.game,playerId:localStorage.playerID},function(e) {
	$(e).each(function(a,b)
	{
		if($c<4)
		{

			if($c==0)
			{
				newCard('');
				$("#bingo_card .cardSerial").text(b.serial);

			}
			else
			{
				$("#bingo_div").append($("<table id='bingo_card"+($c)+"'>").append($("#bingo_card").clone().html())).ready(function () {

					newCard('bingo_card'+$c);
					$("#bingo_card"+$c+" .cardSerial").text(b.serial);
				});

			}

			if($c>2)
			{
				$("#add_more").hide()

			}
			else
			{
				$("#add_more").show()
			}


		}
		$c++
	})

	},"json")



	winningOption = 0;
	//winningCard['bingo_card'] = 0;
	//winningCard['bingo_card1'] = 0;
	//winningCard['bingo_card2'] = 0;
	//winningCard['bingo_card3'] = 0;
	$(".alert").hide();
	$("#lineModalLabel").text('Receipt Number : ' + localStorage.serialNumber);
	resetClass();
	console.log('loadCards');
}
*/

function resetClass(){
	console.log('***** resetClass Function');
	$('#bingo_card').removeClass('borderWinningCard');	
	$('#bingo_card1').removeClass('borderWinningCard');	
	$('#bingo_card2').removeClass('borderWinningCard');	
	$('#bingo_card3').removeClass('borderWinningCard');	
	$('.alert').hide();
	console.log('resetClass');
}

function anotherCard() {
	console.log('***** anotherCard Function');
	for (var i=1; i<usedNums.length; i++) {
		usedNums[i] = false;
	}
	newCard('');
	return false;
	console.log('anotherCard');
}



$(function() {
	console.log('***** Initial Function');
    var bingo = {
        selectedNumbers: [],
        generateRandom: function() {
            var min = 1;
            var max = 89;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            return random;
            console.log('generateRandom')
        },
        generateNextRandom: function() {
            if (bingo.selectedNumbers.length > 88) {
                alert("All numbers Exhausted");
                return 0;
            }
            var random = bingo.generateRandom();
            while ($.inArray(random, bingo.selectedNumbers) > -1) {
                random = bingo.generateRandom();
            }
            bingo.selectedNumbers.push(random);
            return random;
            console.log('generateNextRandom')
        }

        
    }
    $('td').not("#bingo_flashboardPlayers td").each(function() {
        var concatClass = this.cellIndex + "" + this.parentNode.rowIndex;
        var numberString = parseInt(concatClass, 10).toString();
        $(this).addClass("cell" + numberString).text(numberString);
    });
    $('#btnGenerate').click(function() {
        var random = bingo.generateNextRandom().toString();
        $('.bigNumberDisplay span').text(random);
        $('td.cell' + random).addClass('selected');
    });


	/*
    window.onbeforeunload = function(e) {
        e = e || window.event;
        var returnString = 'Are you sure?';
        if (e) {
            e.returnValue = returnString;
        }
        return returnString;
    };
	*/

	//Login - Check login credentials
    $("#formLogin").submit(function()
	{
		$data=$( this ).serialize();
		$.post(config.url,$data,function(e)
		{

			if(e.success==1)
			{				
				localStorage.isloggedin=1;
				localStorage.user=e.name;
				localStorage.userID=e.id;
				localStorage.game=e.assigned_game;
				localStorage.type=e.type;	
				localStorage.type=e.type;				
				config.checkState(); 

			}
			else
			{
				alert("User not found")
			}


		},"JSON");
		resetClass();
		return false;

	})


    //Check Serial - Check serial if valid
	$("#formSerial").submit(function()
	{
		//console.log('Serial : ' + $( this ).serialize());
		$data=$( this ).serialize();

		$.post(config.url,$data,function(e)
		{	
			var apiRes = jQuery.parseJSON(e);

			//alert('Response : ' +  JSON.stringify(apiRes)); 
			if(apiRes.success==1)
			{
				
				localStorage.isloggedin=1;
				//localStorage.user=e.name;
				//localStorage.userID=e.id;
				localStorage.serialNumber = apiRes.serial;
				localStorage.playerID=apiRes.id;
				localStorage.game=apiRes.game;
				localStorage.dabber="colorBlue";
				localStorage.type='player';
				localStorage.sound='on';
		
				config.checkState();
				//$(e.cards).each(function(a,b)
				//{
					//$(".cardSerial").text(b.serial);
				//})

				totalCard = 1;
				localStorage.cardNum = 1;					
				
				$("#bingo_div table").not("#bingo_card").remove();
				loadCards();

			}
			else
			{
				alert("Invalid serial");
			}


		});
		return false;
	});



	//Cashier - Add Game
	$("#addGame").click(function()
	{
		$.post(config.url,{action:'newGame',user:localStorage.userID},function(e)
		{

			$("#listGames").html(e)

		});
	});


	////Cashier - Delete Game
	$(document).on("click",".btnDeleteGame",function()
	{
		$id=$(this).data("id");
		$.post(config.url,{action:'deleteGame',id:$id,user:localStorage.userID},function(e)
		{
			$("#listGames").html(e)
		});
	});

	//Cashier - Add player	
	$(document).on("click",".btnAddPlayer",function()
	{
		$id=$(this).data("id");
		$.post(config.url,{action:'addPlayer',id:$id,user:localStorage.userID},function(e)			
		{
			alert('Finished Adding Player.');
			$("#listGames").html(e)
		});
	});

	//Cashier - Delete player
	$(document).on("click",".btnDeletePlayer",function()
	{
		$id=$(this).data("id");
		$.post(config.url,{action:'deletePlayer',id:$id,user:localStorage.userID},function(e)
		{
			$("#listGames").html(e)
		});
	});


	//Logout
	$(document).on("click",".logout",function()
	{
		localStorage.clear();
		config.checkState();
	});

	
	/********flashboard****/
	/*
	$(document).on("click","#bingo_flashboard td",function()
	{
		$num=($(this).text());
		$(this).css({background:"red",color:"white"})
		$.post(config.url,{action:'setCurrentNumber',num:$num,game:localStorage.game},function(e)
		{
			//$("#listGames").html(e)
		});
	})
	*/


	//Add more card
	var views = 2;
	var steps = [1,2,4,6]; 
	var stepsCtr = 1;
	
	$(document).on("click","#add_more",function()
	{
		//alert('add more')
		for(i=views; i < views + steps[stepsCtr]; i++){
			$(".bingo_card" + i).show();
			totalCard++;
 	    }

 	    if(stepsCtr ==3)
 	    	stepsCtr = 0;
 	   	else
 	    	stepsCtr++;
 	    views = i;
 	    //alert('Total Card : ' + totalCard);
 	    localStorage.cardNum = totalCard;

		//$c=parseInt($("#bingo_div table").length);

		/*
		if($c==2)
		{
			$.post(config.url,{action:'addCard',gameId:localStorage.game,playerId:localStorage.playerID},function(e) {

				$("#bingo_div").append($("<table id='bingo_card2'>").append($("#bingo_card").clone().html())).ready(function () {
					$("#add_more").hide();
					newCard("bingo_card2");
					$("#bingo_card"+$c+" .cardSerial").text(e);


					setTimeout(function () {

						$.post(config.url,{action:'addCard',gameId:localStorage.game,playerId:localStorage.playerID},function(e) {

							$("#bingo_div").append($("<table id='bingo_card3'>").append($("#bingo_card").clone().html())).ready(function () {
							newCard("bingo_card3");

						});
						});

					}, 500)


				})
			});
			//$c=parseInt($("#bingo_div table").length);
		}else{
			$.post(config.url,{action:'addCard',gameId:localStorage.game,playerId:localStorage.playerID},function(e){

				$("#bingo_div").append($("<table id='bingo_card"+($c)+"'>").append($("#bingo_card").clone().html())).ready(function () {

					newCard("bingo_card"+$c);
					$("#bingo_card"+$c+" .cardSerial").text(e);

				});
			});
		}
		*/
	})
	


	// Initialize objects for single card to be use in determining winner combination and card
	var winners = {		    
	    "combinations": [
	        { 
	        	"card": [
	        		{"bingo_card" : 0},
	        		{"bingo_card1" : 0},
	        		{"bingo_card2" : 0},
	        		{"bingo_card3" : 0}
	        	],
	        	"combination":[ 'square0', 'square1', 'square2', 'square3', 'square4'] 
	        },
	        { 
	        	"card": [
	        		{"bingo_card" : 0},
	        		{"bingo_card1" : 0},
	        		{"bingo_card2" : 0},
	        		{"bingo_card3" : 0}
	        	],
	        	"combination":[ 'square5', 'square6', 'square7', 'square8', 'square9'] 
	        },
	        { 
	        	"card": [
	        		{"bingo_card" : 0},
	        		{"bingo_card1" : 0},
	        		{"bingo_card2" : 0},
	        		{"bingo_card3" : 0}
	        	],
	        	"combination":[ 'square10', 'square11', 'square12', 'square13'] 
	        },
	        { 
	        	"card": [
	        		{"bingo_card" : 0},
	        		{"bingo_card1" : 0},
	        		{"bingo_card2" : 0},
	        		{"bingo_card3" : 0}
	        	],
	        	"combination":[ 'square14', 'square15', 'square16', 'square17', 'square18'] 
	        },
	        { 
	        	"card": [
	        		{"bingo_card" : 0},
	        		{"bingo_card1" : 0},
	        		{"bingo_card2" : 0},
	        		{"bingo_card3" : 0}
	        	],
	        	"combination":[ 'square19', 'square20', 'square21', 'square22', 'square23'] 
	        },
	        { 
	        	"card": [
	        		{"bingo_card" : 0},
	        		{"bingo_card1" : 0},
	        		{"bingo_card2" : 0},
	        		{"bingo_card3" : 0}
	        	],
	        	"combination":[ 'square0', 'square6', 'square17', 'square23'] 
	        },
	    ]
	}

	// Check winner on single card for all bingo card(s) presentated (Max of 4)
	function checkWin(id, card_array, card) {
		console.log('***** checkWin');
		var setSquares = 0;
		console.log('checkWin');
		console.log('Square ID : ' + id + ' ---- Card : ' + card);

		for (i in winners.combinations) {		    
		    for (j in winners.combinations[i].combination) {

		        if (id == winners.combinations[i].combination[j]) {
		        	if($( '#' + id ).hasClass( "pickedBG" )){
		        		switch(card_array){
							case 0 : winners.combinations[i].card[card_array].bingo_card--; break; 
							case 1 : winners.combinations[i].card[card_array].bingo_card1--; break; 
							case 2 : winners.combinations[i].card[card_array].bingo_card2--; break; 
							case 3 : winners.combinations[i].card[card_array].bingo_card3--; break; 
						}
		        	}else{
		        		switch(card_array){
							case 0 : winners.combinations[i].card[card_array].bingo_card++; break; 
							case 1 : winners.combinations[i].card[card_array].bingo_card1++; break; 
							case 2 : winners.combinations[i].card[card_array].bingo_card2++; break; 
							case 3 : winners.combinations[i].card[card_array].bingo_card3++; break; 
						}
		        	}
					

					if(winners.combinations[i].combination.length == (winners.combinations[i].card[card_array].bingo_card || winners.combinations[i].card[card_array].bingo_card1 || winners.combinations[i].card[card_array].bingo_card2 || winners.combinations[i].card[card_array].bingo_card3)){
						console.log('Its a win on Card Board ' + (card_array + 1) + ' Combination : ' + i )

						$('#' + card).toggleClass("borderWinningCard");
						$(".alert").show();						

						if(localStorage.sound == 'on'){
							$('#bingo').get(0).play();

							var audioPromise = document.querySelector('audio').play();
						
							if (audioPromise !== undefined) {
							  audioPromise.then(function() {
							   
							  }).catch(function(error) {
							    
							  });
							}	
						}
					}
				}
		    }
		}
	};

	// Initialize objects for winner on the following combinations
	var winnerDoubleCard = {		    
	    "combinations": [
	        { 
	        	"bingo_card" : 0,
	        	"combination":[ 'square0', 'square1', 'square2', 'square3', 'square4', 'square5', 'square6', 'square7', 'square8', 'square9'] 
	        },
	        { 
	        	"bingo_card" : 0,
	        	"combination":[ 'square10', 'square11', 'square12', 'square13', 'square14', 'square15', 'square16', 'square17', 'square18', 'square19'] 
	        },
	        { 
	        	"bingo_card" : 0,
	        	"combination":[ 'square20', 'square21', 'square23', 'square24', 'square25', 'square26', 'square28', 'square29'] 
	        },
	        { 
	        	"bingo_card" : 0,
	        	"combination":[ 'square30', 'square31', 'square32', 'square33', 'square34', 'square35', 'square36', 'square37', 'square38', 'square39'] 
	        },
	        { 
	        	"bingo_card" : 0,
	        	"combination":[ 'square40', 'square41', 'square42', 'square43', 'square44', 'square45', 'square46', 'square47', 'square48', 'square49'] 
	        }	        
	    ]
	} 

	// Check win for a double card
	function checkWinDouble(id) {
		console.log('***** checkWinDouble Function');
		var setSquares = 0;
		
		console.log('checkWinDouble');
		console.log('Square ID : ' + id);

		for (i in winnerDoubleCard.combinations) {		    
		    for (j in winnerDoubleCard.combinations[i].combination) {

		        if (id == winnerDoubleCard.combinations[i].combination[j]) {
		        	if($( '.doubles_card > tbody > tr > #' + id ).hasClass( "pickedBG" )){
		        		winnerDoubleCard.combinations[i].bingo_card--;
		        	}else{
		        		winnerDoubleCard.combinations[i].bingo_card++;
		        	}
					console.log('Bingo Card Value : ' + JSON.stringify(winnerDoubleCard.combinations[i].bingo_card))
					if(winnerDoubleCard.combinations[i].combination.length == winnerDoubleCard.combinations[i].bingo_card){
						console.log('Its a win on Combination : ' + i )

						$('.doubles_card').toggleClass("borderWinningCard");
						$(".alert").show();						

						if(localStorage.sound == 'on'){
							$('#bingo').get(0).play();

							var audioPromise = document.querySelector('audio').play();
						
							if (audioPromise !== undefined) {
							  audioPromise.then(function() {
							   
							  }).catch(function(error) {
							    
							  });
							}	
						}
					}
				}
		    }
		}
	};

	$(document).on("click","#bingo_card td",function()
	{	
		
		if(!isDoubleBingoCard){
			//console.log('Click a number bingo_card: ' + this)
			checkWin(this.id, 0, 'bingo_card');		
		}else{
			console.log('Click a number on Double bingo_card: ' + this)
			checkWinDouble(this.id)
		}
		$(this.id).removeClass(localStorage.dabber);			
		$(this).toggleClass("pickedBG");		
		$(this).toggleClass(localStorage.dabber);	
	});
	


	$(document).on("click","#bingo_card1 td",function()
	{	
		if(!isDoubleBingoCard){
			//console.log(this)	
			$(this.id).removeClass(localStorage.dabber);			
			$(this).toggleClass("pickedBG");		
			$(this).toggleClass(localStorage.dabber);	
			checkWin(this.id, 1, 'bingo_card1');	
		}	
	});



	$(document).on("click","#bingo_card2 td",function()
	{	
		if(!isDoubleBingoCard){	
			//console.log(this)	
			$(this.id).removeClass(localStorage.dabber);			
			$(this).toggleClass("pickedBG");		
			$(this).toggleClass(localStorage.dabber);	
			checkWin(this.id, 2, 'bingo_card2');		
		}
	});



	$(document).on("click","#bingo_card3 td",function()
	{	
		if(!isDoubleBingoCard){
			//console.log(this)	
			$(this.id).removeClass(localStorage.dabber);			
			$(this).toggleClass("pickedBG");		
			$(this).toggleClass(localStorage.dabber);	
			checkWin(this.id, 3, 'bingo_card3');	
		}	
	});


	
	$(document).on("click","#dabber li",function()
	{			
		//alert('Change Dabber');
		localStorage.dabber = this.id;		
		$("#show_dabber").removeClass();
		$('#show_dabber').toggleClass(localStorage.dabber);
		$(".borderDabber").removeClass("borderDabber");
		$(this).toggleClass("borderDabber");				
	});
 
	// Check if sound is enabled
	if ($('#enableSound').is(":checked"))
	{
	  alert('is check');
	}

	//Toggle sound on menu
	$('#enableSound').click(function() {
		console.log('***** Enable Sound');
		if (localStorage.sound == 'on' || localStorage.sound == 'null')
			localStorage.sound = 'off';
		else
			localStorage.sound = 'on';

	});

	//Check if playerID does exist on localStorage
	if(localStorage.playerID){
		console.log('***** Check if playerID exist on localStorage');
		setTimeout(function()
		{
			loadCards();
		},500)
	}

	//Click Previous Game Button on menu
	$(document).on("click", "#previous_game", function () {
		console.log('***** Previous Game Button');
	    if (currentWinnerIndex !== 0) {
	      currentWinnerIndex--;
	    } else {
	      alert('No more previous games!');
	    }
	    checkCardType();
	});

	//Click Next Game Button on menu
  	$(document).on("click", "#next_game", function () {
  		console.log('***** Next Game Button');
  		$('.box_bingo_card').remove();
  		loadCards();
	});


  	function checkCardType() {
  		console.log('***** checkCardType');
	    isDoubleBingoCard = (currentWinnerIndex >= 1);
	    if (isDoubleBingoCard) {
	      $bingoPanel = 'doubles_bingo_card';
	      $bingoCard = 'bingo_card';
	      $('#bingo_div').hide();
	      $('#doubles_bingo_card').show();      
	    } else {
	      $bingoPanel = 'bingo_div';
	      $bingoCard = 'bingo_card';
	      $('#bingo_div').show();
	      $('#doubles_bingo_card').hide();
	    }

	    var cardId = $bingoCard;
	    var cardId1 = $bingoCard+'1';
	    var cardId2 = $bingoCard+'2';
	    var cardId3 = $bingoCard+'3';
	    if ($("#"+cardId).length && !$("#"+cardId1).length && !$("#"+cardId2).length && !$("#"+cardId3).length) {
	      loadCards();
	    } else {
	    	if (isDoubleBingoCard) {
	      		newCard(cardId);
	      	}else{
	      		newCard(cardId);
			    newCard(cardId1);
			    newCard(cardId2);
			    newCard(cardId3);
			}
	    }
	    console.log('checkCardType');
	}

  	// *********** v2 functions ************
   
    //Function to get new random number
    function getNewNum() {
    	console.log('***** getNewNum Function');		
		return Math.floor(Math.random() * 15);		
	}


	
	//Getting new number for the cell
	function setSquare(thisSquare, parent, serialID) {
		console.log('***** Set Square Function');
		var currSquare = "square" + thisSquare;
		var colPlace; 
		  	colPlace = new Array(0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4)
		
		console.log('* colPlace : ' + colPlace[thisSquare])
		var colBasis = colPlace[thisSquare] * 15;
		var newNum;


		do {
		  	//console.log('** colBasis : ' + colBasis)
		  	//console.log('*** currSquare : ' + currSquare	)
		    newNum = colBasis + getNewNum() + 1;
		    console.log('**** New Numbersss : ' + newNum)
		}
		while (usedNums[newNum]);
		usedNums[newNum] = true;
		

		if (parent.length > 0) {

			//$.post(config.url,{action:'addBingoCardNumber',serialID:serialID, numberCalled:newNum},function(e){			    	
			//	console.log('Success Insert Number : ' +  JSON.stringify(e)); 
			//});

		    console.log("***** Write the square tag");
		    $("#" + parent + " #" + currSquare).html(newNum);
		    $("#" + parent + " #" + currSquare).attr("class", "");

				
				$(document).on("click","#"+parent+ " #"+currSquare,function()
				{
					$(this).toggleClass("pickedBG");
				});
				
		    //$("#"+parent+ "#currSquare").onmousedown = toggleColor;
		}
		else {
		  	console.log('Parent is less than 0');
		    //document.getElementById(currSquare).innerHTML = newNum;
			//	document.getElementById(currSquare).className = "";
			//	document.getElementById(currSquare).onmousedown = toggleColor;
		}
		
		//if($("#" + parent).find("td#free")){
			//console.log('############# Free');
			$("td#free").addClass(localStorage.dabber);	
			$("td#free").html("FREE");
		//}

		

			//console.log('setSquare');

	}	

	//Store a random number for a new card
	function newCard(parent, squareValue) {

		
		console.log('***** newCard Function');
		console.log('Parent : ' + 	parent)
		//usedNums = new Array(76);
		var numCol = 24;

	    //console.log('numCol : ' + numCol)

	    //$.post(config.url,{action:'getCardsNumber',playerID:localStorage.playerID, gameID:localStorage.game},function(e){
	    //	var serial_id = e;
			//console.log('Response : ' +  JSON.stringify(serial_id)); 

			for (var i=0; i<numCol; i++) {
				//console.log('>>>>> Column # : ' + i)
				//setSquare(i,parent,serial_id);
				$("#" + parent + " #" + currSquare).html(squareValue);
		    	$("#" + parent + " #" + currSquare).attr("class", "");

			}
		//	console.log('newCard');
		//});
		
		
		
		/*
		if($( '.doubles_card > tbody > tr > #free' ).hasClass("freeDB")){	

			$(".freeDB").addClass(localStorage.dabber);	
			$(".freeDB").html("FREE");
		}
		*/

		
	}

	function generateTableCard(cardNumbers){
		//for(var ctr=1; ctr<cardCount; ctr++){
			$("#bingo_div").append($("<table id='bingo_card"+(ctr)+"' class='box_bingo_card'><tr><th>B</th>				<th>I</th><th>N</th><th>G</th><th>O</th></tr><tr><td id='square0'>&nbsp;</td><td id='square5'>&nbsp;</td><td id='square10'>&nbsp;</td><td id='square14'>&nbsp;</td><td id='square19'>&nbsp;</td></tr><tr><td id='square1'>&nbsp;</td><td id='square6'>&nbsp;</td><td id='square11'>&nbsp;</td><td id='square15'>&nbsp;</td><td id='square20'>&nbsp;</td></tr><tr><td id='square2'>&nbsp;</td><td id='square7'>&nbsp;</td><td id='free'>Free</td><td id='square16'>&nbsp;</td><td id='square21'>&nbsp;</td></tr><tr><td id='square3'>&nbsp;</td><td id='square8'>&nbsp;</td><td id='square12'>&nbsp;</td><td id='square17'>&nbsp;</td><td id='square22'>&nbsp;</td></tr><tr><td id='square4'>&nbsp;</td><td id='square9'>&nbsp;</td><td id='square13'>&nbsp;</td><td id='square18'>&nbsp;</td><td id='square23'>&nbsp;</td></tr><tfoot><tr><th colspan='5'>Serial: 	<span class='cardSerial'></span></th></tr></tfoot></table>")).ready(function () {

				newCard('bingo_card'+ctr, cardNumbers);

				//$("#bingo_card"+ctr+" .cardSerial").text(b.serial);

			});
		//}
	}

	//Load the card and set serial number of card
	function loadCards(){
		console.log('*****### Load Card Function');

		$.post(config.url,{action:'getCardsNumber',playerID:localStorage.playerID, gameID:localStorage.game},function(resCard){
		 	
		 	$.each(JSON.parse(resCard), function( key, val ) {
			    //console.log(key, val);

			    var cardNumber = val.numbers.split(',');			  

			    $("#bingo_div").append($("<table id='"+ val.id +"' class='box_bingo_card bingo_card"+(key+1)+"'><tr><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></tr><tr><td id='square0'>" + cardNumber[0] +"</td><td id='square5'>" + cardNumber[5] +"</td><td id='square10'>" + cardNumber[10] +"</td><td id='square14'>" + cardNumber[14] +"</td><td id='square19'>" + cardNumber[19] +"</td></tr><tr><td id='square1'>" + cardNumber[1] +"</td><td id='square6'>" + cardNumber[6] +"</td><td id='square11'>" + cardNumber[11] +"</td><td id='square15'>" + cardNumber[15] +"</td><td id='square20'>" + cardNumber[20] +"</td></tr><tr><td id='square2'>" + cardNumber[2] +"</td><td id='square7'>" + cardNumber[7] +"</td><td id='free'>Free</td><td id='square16'>" + cardNumber[16] +"</td><td id='square21'>" + cardNumber[21] +"</td></tr><tr><td id='square3'>" + cardNumber[3] +"</td><td id='square8'>" + cardNumber[8] +"</td><td id='square12'>" + cardNumber[12] +"</td><td id='square17'>" + cardNumber[17] +"</td><td id='square22'>" + cardNumber[22] +"</td></tr><tr><td id='square4'>" + cardNumber[4] +"</td><td id='square9'>" + cardNumber[9] +"</td><td id='square13'>" + cardNumber[13] +"</td><td id='square18'>" + cardNumber[18] +"</td><td id='square23'>" + cardNumber[23] +"</td></tr><tfoot><tr><th colspan='5'>Serial: 	<span class='cardSerial'>"+ val.id +"</span></th></tr></tfoot></table>")).ready(function () {

					});

     	    });
		 	
     	    for(i=2; i <= 200; i++){     	    	
     	    	$(".bingo_card" + i).hide()
     	    }
     	    
     	    
			totalCard = localStorage.cardNum;	
			for(i=2; i <= parseInt(localStorage.cardNum); i++){     	    	
     	    	$(".bingo_card" + i).show()
     	    }				
			
			showDabber();

     	    $('#show_dabber').toggleClass(localStorage.dabber);	

		})

		winningOption = 0;
		$("#lineModalLabel").text('Receipt Number : ' + localStorage.serialNumber);
		resetClass();
		
	}



});

// Show called numbers from caller to all bingo cards
$(document).on("click","#show_dabber",function(){			
	//alert('Change Dabber : ' + localStorage.game);
	console.log('*****### Show Dabber on Bingo Cards');
	$.post(config.url,{action:'getCallerNumbersLength',gameID:localStorage.game},function(calledNumber){			
	 	console.log('Called Number ' + calledNumber)
	 	if(calledNumber > 0)
	 		showDabber();
	 	else
	 		alert("Caller did not yet started.")
	})
	
});

// Function to show dabber on all bingo cards
function showDabber(){
	$.post(config.url,{action:'getCalledNumbers',gameID:localStorage.game},function(calledNumber){	
		//alert(calledNumber)
	 	$.each(JSON.parse(calledNumber), function( key, val ) {
		    //console.log(key, val);	
		    //console.log('Value ID : ' + val.id);	
		    //console.log('Square ID : ' + val.square_index);	
		    //console.log('Check class : ' + "."+val.id+" #square" +val.square_index);	
		    $("#"+val.id+" #square"  +val.square_index).addClass(localStorage.dabber)    	    
 		    
 	    });

	})
}

/*
// Function to check bingo card numbers to called numbers by caller
function dabSquares(calledNumbers){
	console.log('*****### Check Called Numbers to Dabber');
	
	$.post(config.url,{action:'getCardsNumber',playerID:localStorage.playerID, gameID:localStorage.game},function(resCard){
	 	
	 	$.each(JSON.parse(resCard), function( key, val ) {
		    console.log('Check Dabber : ' + key, val);
		    console.log('Called Numbers : ' + JSON.stringify(calledNumbers))
		    var cardNumber = val.numbers.split(',');			  	   
		    console.log('CardNumber Array : ' + cardNumber)

		    for (var i = 0; i < cardNumber.length; ++i) {
			    console.log('Individual Array : ' + cardNumber[i])

			   // if(cardNumber[i] = )
			}

 	    });

	})
}
*/

	// ****** Flashboard Functions ******** //
	
	var idCalled;
	
    // Add dabber on clicked table cell
    $(document).on("click","#bingo_flashboard td",function(){	
    	//alert('click')
		console.log('Table Cell : ' + $(this).text().substring(1))	
		
		localStorage.setItem("number_called", $(this).text().substring(1))

		idCalled = this.id;

		if($("#" + idCalled).hasClass("colorYellow")){
			$("#enter").hide();
			alert("You can't choose already dab number");
		}else{
			$(this).toggleClass("colorRed");	
			$("#enter").show();
		}

		

		//Check if more 1 number is clicked
		if($("#bingo_flashboard").find('td.colorRed').length > 1){
			alert('You can choose only 1 number')
			$('#bingo_flashboard td').removeClass("colorRed");
			$("#enter").hide();
		}

	});


    // Store called number on the pool of called numbers
    var calledNumbers = [ ] 		
	
	$(document).on("click","#enter",function(){	
    	
		calledNumbers.push(localStorage.getItem("number_called"))
		localStorage.setItem("caller_numbers", JSON.stringify(calledNumbers))	
		//console.log('Stored Called Numbers : ' + JSON.parse(localStorage.getItem("caller_numbers")))

		$.post(config.url,{action:'addCalledNumber',userID:localStorage.userID, game:localStorage.game, called_number:localStorage.number_called},function(e){
			console.log('Response addCalledNumber : ' + e)
		});

		//console.log('TD ID : ' + idCalled)
		$('#' + idCalled).addClass('colorYellow').removeClass('colorRed');
		$("#enter").hide();


	});

	// ****** End -  Flashboard Functions ******** //
