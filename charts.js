var currentChart = "bubbleChart"; 	// για να μην προσπαθήσουμε να ξαναδημιουργήσουμε το ίδιο διάγραμμα ,΄χρήσιμο για τα callbacks
var currentGrouping = "all-donations"; 	// Χρήσιμο για το transition ! μάλλον περιττό για την ώρα
var transitionCallbacks = {"bubbleChart": BubbleChartTransition, "circlePackChart": bubblePackLayout, "barChart": drawBarChart}; 
var allChartsArray = ["bubbleChart", "circlePackChart", "barChart"];

var tooltipBC = d3.select("#bubbleChart")
 	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip1");

var tooltipCPC = d3.select("#circlePackChart")
 	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip2");

var tooltipBarC = d3.select("#barChart")
 	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip3");

var tooltipDict = {"bubbleChart": tooltipBC, "circlePackChart": tooltipCPC, "barChart": tooltipBarC };

function ifElementNotNull(element){
	return element != null ? true : false;
}

function hideByid(id){
	var element = document.getElementById(id);
	if(ifElementNotNull(element)){
		element.style.display = "none";
	}
}

function displayById(id){
	var element = document.getElementById(id);
	if(ifElementNotNull(element)){
		element.style.display = "block";
	}
}

function hideAllByIds(){
	var options = ["bubbleChart", "barChart", "circlePackChart", "annotations" , "imageTest"];
	for(var c=0;c<options.length;c++){
		hideByid((options[c]));
	}
}

//na ftakso edo ola ta tooltips mou o kodikas einai poli xalia
function tooltipConstruction(id){

   d3.select(id)
 	.append("div")
	.attr("class", "tooltip")
	.attr("id", id);
	
	return tooltip;
}

function initToolTips(){
	for (let c=0;c<allChartsArray.length;c++){
		id = allChartsArray[c];
		console.log("construcing tooltips");
		console.log("id", id);
		tooltipDict[id] = tooltipConstruction("#" + id);
	}
}

// TO-DO CREATE AN OBJECT FOR MY HISTORY INSTEAD OF HAVING A LOT GLOBAL VARIABLES
var imagesCounter = 0;
var arrayOfImgNames = []; // this hold the name of our images !
var arrayOfImgInfo =[]; // plirofires gia to tooltip !!
const MAX_IMAGES_HISTORY_PAGE = 9; // mexri posa stoixeia mporei na einai se mia grammi istorikou!
var curHistPos=0; // se poia selida tou istorikou mas briskomaste !
var curHistId = 0;


function createImg(donor,id,infoBox){
			var path="https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + donor + ".ico";
			var img = $(document.createElement('img'));
				img.attr('src',path);
				img.attr("id", id);
				img.attr("class", "deletable");
				img.appendTo('#imageTest');
				var tooltipString = infoBox;
				img.on("click", function(){
			  		window.open('http://google.com/search?q=' + donor);
				})

				img.on('mouseover',function(d,i){
					 responsiveVoice.speak(donor);
					 var id = d3.select(this).attr("id");
					 console.log("id", id);
					 tooltipDict[currentChart]
					   .style("left",(parseInt(105 + (id % MAX_IMAGES_HISTORY_PAGE) * 100 + 31)+"px"))
					   .style("top",(parseInt(910) + "px"))
					   .html(tooltipString)
					   .style("display", "block");

				});

				img.on('mouseout',function(d,i){
					console.log("mouseOut Event for the love of god!!");
					responsiveVoice.cancel();
					tooltipDict[currentChart]
						.style("display", "none");
				});
}


function addImageHistory(imgUrl, donor, infoBox){
//prosthese eikones sto istoriko efoson akoma den exeis sumplirosei to istoriko !
	if(arrayOfImgNames.length<45){
		console.log("addedImageHistory", infoBox);
		arrayOfImgNames.push(donor);
		arrayOfImgInfo.push(infoBox);
		if(arrayOfImgNames.length < (MAX_IMAGES_HISTORY_PAGE * (curHistPos+1)))
		{
			createImg(donor, imagesCounter , arrayOfImgInfo[imagesCounter]);
		}

			imagesCounter++;
	}
}
