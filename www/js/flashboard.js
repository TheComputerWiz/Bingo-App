	
	var idCalled;
	$("#enter").hide();

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
			$(this.id).toggleClass("colorRed");	
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

