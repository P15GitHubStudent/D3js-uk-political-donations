// GLOBALS
var w = 1000,h = 900;
var padding = 2;
var nodes = [];
var force, node, data, maxVal;
var brake = 0.2;
var radius = d3.scale.sqrt().range([10, 20]);

var populationCenter = {
	small: {x: w / 3.65, y: h / 2.3},
	medium: {x: w / 3.65, y: h / 1.8},
	large: {x: w / 1.15, y: h / 1.9}
};


var fill = d3.scale.ordinal().range(["#F02233", "#087FBD", "#FDBB30"]);

var svgCentre = { 
    x: w / 3.6, y: h / 2
  };

var svg = d3.select("#chart").append("svg")
	.attr("id", "svg")
	.attr("width", w)
	.attr("height", h);

var nodeGroup = svg.append("g");

var tooltip = d3.select("#chart")
 	.append("div")
	.attr("class", "tooltip")
	.attr("id", "tooltip");

var comma = d3.format(",.0f");


function start() {

	node = nodeGroup.selectAll("circle")
		.data(nodes)
	.enter().append("circle")
		.attr("class", function(d) { return "node " + d.party; })
		.attr("amount", function(d) { return d.value; })
		.attr("country", function(d){console.log("country :", d.country); return d.country;})
		.attr("time", function(d){ return d.time})
		.attr("r", 0)
		 .style("fill", function(d) {
		 	if(d.time === '2017'){
		 		return "red";
		 	}
		 	else if(d.time === '2016'){
		 		return "green";
		 	}
		 	else{
		 		return "blue";
		 	}

		 })
		.on("mouseover", mouseover)
		.on("mouseout", mouseout);

		force.gravity(0)
			.friction(0.75)
			.charge(function(d) { return -Math.pow(d.radius, 2) / 3; })
			.on("tick", all)
			.start();

		node.transition()
			.duration(2500)
			.attr("r", function(d) { return d.radius; });
}

function total() {

	force.gravity(0)
		.friction(0.9)
		.charge(function(d) { return -Math.pow(d.radius, 2) / 2.8; })
		.on("tick", all)
		.start();
}

function amounts(e){
	node.each(moveToAmountofDono(e.alpha));
	node.attr("cx",function(d){return d.x;})
		.attr("cy",function(d){return d.y;})
}

function all(e) {
	node.each(moveToAmountofDono(e.alpha))
		.each(collide(0.001));
		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function allgroup(){
}

function total(){
	force.gravity(0)
		.friction(0.9)
		.charge(function(d) { return -Math.pow(d.radius, 2) / 2.8; })
		.on("tick", all)
		.start();
}

// Collision detection function by m bostock
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + radius.domain()[1] + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2
          || x2 < nx1
          || y1 > ny2
          || y2 < ny1;
    });
  };
}

function display(data){

	data.forEach(function(d, i){
		d.Value = d.Value.replace(/[^\d\.\-]/g, "");
	});

	maxVal = d3.max(data, function(d) { return d.Value; });

	var radiusScale = d3.scale.sqrt()
		.domain([0, maxVal])
			.range([0, 30]);

	data.forEach(function(d, i) {
		var y = radiusScale(d.amount);
		var node = {
				radius: radiusScale(d.Value) / 5,
				value: d.Value,
				country: d.GEO,
				time: d.TIME,
				age: d.AGE,
				x: Math.random() * w,
				y: -y
 
      };
			
      nodes.push(node)
	});

	force = d3.layout.force()
		.nodes(nodes)
		.size([w, h]);

	return start();
}


function transition(name){

	console.log("name= " + name);

	if (name === "GroupingBtn1"){
		$("#grp1").fadeIn(250);
		$("#grp2").fadeOut(250);
		$("#grp3").fadeOut(250);
		$("#grp4").fadeOut(250);
		return total();
	}
	if (name === "GroupingBtn2"){
		$("#grp1").fadeOut(250);
		$("#grp2").fadeIn(250);
		$("#grp3").fadeOut(250);
		$("#grp4").fadeOut(250);
		return yearGroup();
	}
	if (name === "GroupingBtn3"){
		$("#grp1").fadeOut(250);
		$("#grp2").fadeOut(250);
		$("#grp3").fadeIn(250);
		$("#grp4").fadeOut(250);
		return ageGroup();
	}

	if(name === "GroupingBtn4"){
		$("#grp1").fadeOut(250);
		$("#grp2").fadeOut(250);
		$("#grp3").fadeOut(250);
		$("#grp4").fadeIn(250);
		return ageGroup2();
	}
}

function yearGroup(){
	force.gravity(0)
		.friction(0.9)
		.charge(function(d) { return -Math.pow(d.radius, 2) / 2.8; })
		.on("tick", years)
		.start();
}

function years(e){
		node.each(moveToYears(e.alpha));
		//.each(collide(0.001));
		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function ageGroup(){
	force.gravity(0)
		 .friction(0.9)
		 .charge(function(d) { return -Math.pow(d.radius, 2) / 2.8; })
		.on("tick", ages)
		.start();

}

function ages(e){
	node.each(moveToAges(e.alpha));
		//.each(collide(0.001));
		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}

function ageGroup2(){
	force.gravity(0)
		 .friction(0.9)
		 .charge(function(d) { return -Math.pow(d.radius, 2) / 2.8; })
		.on("tick", ages2)
		.start();

}

function ages2(e){
	node.each(moveToAges2(e.alpha))
		.each(collide(0.001));
		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) {return d.y; });
}


function moveToAmountofDono(alpha){
	return function(d){
		var centreX = 0, centreY = 0;
			if (d.value <= 700000){
				centreX = 400;
				centreY = 200;
			} else if (d.value <= 1000000){
				centreX = 550;
				centreY = 200;
			}
			else{
				centreX = 740;
				centreY = 280;
			}
		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;

	};
}

function moveToYears(alpha){
		return function(d){
		var centreX = 0, centreY = 0;
			if (d.time === "2015"){
				centreX = 400;
				centreY = 250;
			} else if (d.time === "2016"){
				centreX = 550;
				centreY = 200;
			}
			else{
				centreX = 740;
				centreY = 200;
			}
		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;
	};
}


function moveToAges(alpha){
	return function(d){
		var centreX = 0, centreY = 0;
			if (d.age === "Less than 15 years"){
				centreX = 400;
				centreY = 200;
			} else{
				centreX = 650;
				centreY = 200;
			}
		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;

	};
}


function moveToAges2(alpha){
	return function(d){
		var centreX = 0, centreY = 0;
		centreX = 550;
		centreY = 250;
		d.x += (centreX - d.x) * (brake + 0.02) * alpha * 1.1;
		d.y += (centreY - d.y) * (brake + 0.02) * alpha * 1.1;

	};
}


function mouseover(d, i) {
	// tooltip popup
	var mosie = d3.select(this);
	var amount = d.value;
	var country = d.country;
	var time = d.time;
	var ageGroup = d.age;
	//var entity = d.entityLabel;
	var offset = $("svg").offset();
	//var imageFile = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + "NOPE" + ".ico";

	var imageFile = "photos/counties/"+ country + ".png"; 

	// *******************************************
	// ebala extra a na min to ksexaso !
	var infoBox = "<p> Age Group: <b>" + ageGroup + "</b> " +  "<span><img src='" + imageFile + "' height='32' width='32' onError='this.src=\"https://github.com/favicon.ico\";'></span></p>" 		
	 							+ "<p> Country: <b>" + country + "</b></p>"
								+ "<p> Time: <b>" + time + "</b></p>"
								+ "<p> Total value: <b>" + comma(amount) + "</b></p>";

	
	mosie.classed("active", true);
	d3.select(".tooltip")
  	.style("left", (parseInt(d3.select(this).attr("cx") - 80) + offset.left) + "px")
    .style("top", (parseInt(d3.select(this).attr("cy") - (d.radius+150)) + offset.top) + "px")
		.html(infoBox)
			.style("display","block");
}

function mouseout(){
		var mosie = d3.select(this);

		mosie.classed("active", false);

		d3.select(".tooltip")
			.style("display", "none");
}

$(document).ready(function() {
	d3.selectAll(".switch").on("click", function(d){
  		var id = d3.select(this).attr("id"); 
  		return transition(id); 
 	});

	return d3.csv("data/data2.csv", display);
});


