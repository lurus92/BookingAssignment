// you can enter your JS here!


var i;						// A generic counter for all the script

//------------------------SECTION FOR CAROUSEL------------------------------//

var img = [];				//images array
var th = [];				//thumbs array
var currImg;				//index of the current image displayed
var maxIMG = 50;			//Maximum number of images
var numImg = null;			//Real number of images
var interval;				//Slideshow Interval


//The following function reads up to maxIMG images from the folder and prefetch them
//Note: JavaScript is not able to read filesystem. To have arbitrary long
//number of images, I'm using their onerror event, that fires when 
//an invalid source is assigned to an image.
//When this happens, the imgFin function is called, and the real number
//of images is assigned to the length of the array
//Note that this approch is not the best: in the console an error will be displayed per
//each missing image. In a real world scenario I would strongly suggest
//to put these images on a server and use a PHP script

function readImgs(){
		for(i=0; i<maxIMG; i++){
			img[i] = new Image();
			th[i] = new Image();
			img[i].idx = th[i].idx = i; 
			img[i].src = "img/"+(i+1)+"_large.jpg";
			img[i].alt = "description of photo "+(i+1)+"";
			th[i].src="img/"+(i+1)+"_thumb.jpg";
			img[i].onerror = th[i].onerror = imgFin;
		}
}

//The following function is called whenever the source path of an image/thumb is not valid, so
//the image doesn't exist in the directory. Only the first image to have an error is able to
//set the length of the images array. Please note that we use the same function both for
//the big images and for thumbs: an image is added to the carousel only and only if a pair
//image-thumb is found in the directory. Moreover, to be displayed, the pair should be correctly
//numbered

function imgFin(){
		if (numImg==null){					//if the real length has already been set, the function doesn't need to do anything
			numImg = this.idx;				//if not, we set the real length to the first image that had an error.
			th.length = img.length = numImg;
			if (numImg==0) $("#carousel").html("<h2>No images provided<h2>");	//Case of no images
			else{ 	
				if(numImg!=1){				//If we have only one image, there is no need to display the thubnail strip
					tumbs();				//nor to start the slideshow
					startShow();
				}
				jumpTo(0);
				navBtns();
			}
		}
}


//The next function builds the thubnails strip that follows the main image
function tumbs(){
		for(i in th){
			$(th[i]).click(function(){			//The event that must fire when clicking a thumb
				jumpTo(this.idx);				//Zoom of the thumb in the main image
				stopShow(); 					//Slideshow is stopped
			});
			$(th[i]).addClass("thumbs-img");
			$("#thumbs-container").append(th[i]);	//The thumb are added to the strip
		}
}

//The next function binds to the next/prev buttons the events of image switching
function navBtns(){
	if (numImg==1){								//We don't need navigation button if we have only 1 image
		$(".nav-button").remove();
		return;
	}
	$(".nav-button").click(function(){
		stopShow();								//When one of these buttons are clicked, the slideshow is stopped
		if($(this).attr("id")=="next-button") nextImg();
		else prevImg();
	});
}

//The next function is able to zoom the #i image of the array
function jumpTo(i) {				
		currImg=i;									//The index is the current big image is updated
		$("#big-img")[0].src = img[i].src;			//The image is displayed in the main container 
		$("#img-description").html(img[i].alt);		//The description of the image is also displayed
		//The relative thubnail must be marked as selected (and the others not)
		for(var j in th){
			if(j!=i) $(th[j]).removeClass("thumb-selected");
			else $(th[j]).addClass("thumb-selected");
		}
	}

//The following two functions are wrappers for the above jumpTo. 
//They provide a circular navigation in the gallery
function nextImg(){
		if (currImg!=numImg-1) currImg++;
			else currImg=0;
		jumpTo(currImg);
}

function prevImg(){
		if (currImg!=0) currImg--;
			else currImg=numImg-1;
		jumpTo(currImg);
}

//The following functions manage the slide show interval
function startShow (){
	if(!interval) interval = setInterval(nextImg, 3000);		// Interval of 3 seconds
}

function stopShow (){
		clearInterval(interval);
		interval=null;
}



/*--------------------------SECTION FOR TABLE-----------------------------*/


var mtx = [];						//The table is rapresented with a <num_rooms>x2 matrix (see after for details)
var tbl = $("#table");				//JQuery element that contains the HTML table 

//The "mtx" attribute will be composed by a column with the indexes of the rows in the table,
//and with another column that will be the projection of the column that we need to sort

//The following function allows the table to be sortable by clicking on its columns
function initTbl(){
		var pColH = $("#price_header");			//The headers of the columns that should be sortable
		var oColH = $("#occupancy_header");	
		pColH.sortS = null;						//The flag that describe the ordering status of the column "price" (null, asc, desc)
		oColH.sortS = null;						//Same as before, but for the column "occupancy"
		pColH.origTxt = pColH.text();			//The original text of that columns
		oColH.origTxt = oColH.text();
		pColH.append("\u25be\u25b4");			//Sorting symbols are appended to the headers
		oColH.append("\u25be\u25b4");
		//The following are listers for the headers, in order to be able to sort the table when clicked
		pColH.add(oColH).click(listener);
		
		function listener(){
			var mainCol, secCol;
			if ($(this).attr("id")=="price_header"){				//This first if-else-block sets the local variables of the 
				mainCol=pColH;										//function, in order to know witch column has to be sorted
				secCol=oColH;
				prjCol("price");
			}
			else {
				mainCol=oColH;
				secCol=pColH;
				prjCol("occupancy");
			}
			if((!mainCol.sortS)||(mainCol.sortS=="desc")){			//If the column has no sorting or descending sorting
				sortTbl(true);										//we'll sort it ascending
				buildTbl();
				mainCol.sortS = "asc";
				mainCol.text(mainCol.origTxt + "\u25be");
			}else{		
				sortTbl(false);										//Otherwise we'll sort it descending
				buildTbl();
				mainCol.sortS = "desc";
				mainCol.text (mainCol.origTxt + "\u25b4");
			}
			secCol.sortS = null;									//The not-clicked columns is set to no sorting
			secCol.text(secCol.origTxt + "\u25be\u25b4");
			$("#total_label").text("Total: 0€");					//The total is cleared.
}
	
		//Now we should menage the update of the total price
		//We have two way to do this: add an event listener for each drop down menu or add only one listener 
		//to the entire form that contains the table. I've chosen the second way:
		tbl.parent().change(function(){
			tot = 0;													//Initialization of the total
			var ddBxs = tbl.find("select");								//Building of the array of drop-down boxes
			$(ddBxs).each(function(){
				var ddVal = this.options[this.selectedIndex].value;		//value of the drop-down box
				if (ddVal!=0){											//I have to do something if the value is not zero 
					var row = $(this).parent().parent();				//I find the row in witch is the dropdown
					var price = Number( $(row.children()[2]).text().replace(/[^0-9\.]+/g,""));	//Find and format the price of the room	
					//Note the above .replace function: we need it to eliminate the currency symbol and have a plain number
					tot += ddVal * price;								//Update of the total
				}
			});
			$("#total_label").text("Total: "+tot.toFixed(2)+"€");		//toFixed will eliminate the unecessary decimals
		});
		
		//Last but not least, we want to display detailed description of the room when the user click on it
		initDesc();		
}

//The following function is able to create a description section that follows the table, with the details of the
//selected room. These details are only some example text.
//When a room name is clicked, the page automatically scrolls to the section where the description is placed
function initDesc(){
		i = 0;
		$(".room_name").each(function(){							//For every room of the table I add a listener
			if (i==0) {i++; return;}								//The first ".room_name" is the rooms' header, we skip it
			$(this).click(function(){								//When clicked, an HTML section following the table is populated with details
				$("#table-details").html("<h2>"+$(this).text()+"</h2><span>Description of room: "+$(this).text()+"</span>");
				var offset = $("#table-details").offset();
			    var top = offset.top;
			    $('html, body').animate({							//And a scrolling animation to that section is performed
			        scrollTop: top
			    }, 800);
			});
			i++
		});
}

//The following is the function that will populate the matrix, doing a projection of a specified
//column (price or occupancy). In the other column (the first), we have the positions of the rows
//where that price/occupancy belongs to
function prjCol (col){
		var idx;
		if(mtx) mtx=[];								//The matrix must be resetted every time a projection is done
		(col=="occupancy") ? idx = 1 : idx = 2;
		i = 0;
		tbl.find("tr").each(function() { 
			if (i!=0){								//i=0 is the row of the headers, we should skip it
			    var rowArr = [];
			    var tblData = $(this).find('td');
				rowArr.push(i);
				var secCell = Number( $(tblData[idx]).text().replace(/[^0-9\.]+/g,"")) //To have an effective sorting, we must have only numbers
		        rowArr.push(secCell);
		        mtx.push(rowArr);
		    }
			i++;
		});
	}

//The following is the function able to sort our matrix by the second column (the price/occupancy
//in the original table). To do this, we'll use the fast Array.sort method a little bit customized
//for 2-dimensional arrays.

function sortTbl(asc){					//The parameter is a flag: true => ascending, false => descending
		function srtFun(a, b) {			//Here there is the customization of the default sort
		    if (a[1] === b[1]) {
		        return 0;
		    }
		    else {
		        if (asc) return (a[1] < b[1]) ? -1 : 1;				//We only look at the second column of the matrix
				else return (a[1] > b[1]) ? -1 : 1;					//And we can sort both ascending and descending
		    }
		}
		mtx.sort(srtFun);				//We perform the sorting		
	}

//The following is the function that, taking the position of the sorted row in the first column
//of the matrix, clones the relative row in the HTML table and append that row to it.
//Then, it deletes the old part of the table: the result is a sorted table
function buildTbl(){
		if (!mtx) return;
		var tblBody = tbl.find("tbody");
		var rows = tblBody.find("tr");
		for(i in mtx){
			var rowToAppend = $(rows[mtx[i][0]-1]).clone();		
			tblBody.append(rowToAppend);
		}
		
		for(i in mtx) $(rows[i]).remove();
		
		//The event listener for the detailed description has been deleted with the last instruction
		//Let's rebuild it:
		initDesc();
	}

//The last thing is to start everything with the windows.onload();
window.onload = function(){
	//For carousel
	readImgs();
	//For table
	initTbl();
}