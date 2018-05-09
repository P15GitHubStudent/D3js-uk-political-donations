var width = 1000, height = 900; //1000-800 
var circlePackChartId = "#circlePackChart";

var t2 = 
{"name": "The-publics purse","children":[ 
{"name": "pub", "children": []},
{"name": "private", "children": []}
]
};
// ALL-MONEY
var t1 ={"name": "all-donations", "children": [ 
{"name": "25k", "children": []}, 
{"name": "50k", "children": []}, 
{"name": "100k", "children": []}, 
{"name": "700k", "children": []} , 
{"name": "1m", "children": []} 
]
};


var t3 =  
{"name": "","children":[ 
{"name": "con", "children": []},
{"name": "lab", "children": []},
{"name": "lib", "children": []}
 ]
};


var t4 =  
{"name": "group-by-donor-type","children":[ 
{"name": "Society", "children": []},
{"name": "Company", "children": []},
{"name": "Other", "children": []},
{"name": "Public Funds", "children": []}
]
};

var t5 =  
{"name": "group-by-amount-donation","children":[ 
{"name": "small", "children": []},
{"name": "medium", "children": []},
{"name": "large", "children": []}
 ]
};

var svg3 = d3.select(circlePackChartId).append("svg")
  .attr("id", "circlePackChartSvg")
  .attr("width", width)
  .attr("height", height);

//objects 
var blObjects = {"all-donations": t1 , "group-by-money-source": t2, "group-by-party": t3,"group-by-donor-type": t4, "group-by-donation-amount": t5};
 

function blGrp4(dstObj, data){

   data.forEach(function(d, i){

    if (d.entityname === "Society"){
      dstObj.children[0].children.push(d);
    }
    else if(d.entityname === "Company"){
      dstObj.children[1].children.push(d);
    }
    else if(d.entityname === "Other"){
      dstObj.children[2].children.push(d);
    }else if(d.entityname === "Public Funds"){
      dstObj.children[3].children.push(d);
    }  
  }); 
}

  function grp5(dstObj, data){

    data.forEach(function(d,i){
          if(d.amount<=300001){
            dstObj.children[0].children.push(d);
          }
          else if(d.amount<=550001){
             dstObj.children[1].children.push(d);
          }
          else{
             dstObj.children[2].children.push(d);
          }
  });
}

function blGrp3(dstObj, data){

  data.forEach(function(d, i){

    if (d.party === "con"){
      dstObj.children[0].children.push(d);
    }
    else if(d.party === "lab"){
      dstObj.children[1].children.push(d);
    }
    else if(d.party === "lib"){
      dstObj.children[2].children.push(d);
    }
  }); 
}

function blGrp5(dstObj, data){
      data.forEach(function(d,i){
          if(d.amount<=300001){
            dstObj.children[0].children.push(d);
          }
          else if(d.amount<=550001){
             dstObj.children[1].children.push(d);
          }
          else{
             dstObj.children[2].children.push(d);
          }
  });

}

//bubble layout group 1
function blGrp2(dstObj, data){
  data.forEach(function(d, i){
    if (d.entity === 'pub'){
      dstObj.children[0].children.push(d);
    }
    else{
      dstObj.children[1].children.push(d);
    }
  });
}

function blGrp1(dstObj, data){

  data.forEach(function(d, i){
    if(d.amount<=25000){
      (dstObj.children[0].children).push(d);
    }        
    else if(d.amount<=50000){
      (dstObj.children[1].children).push(d);
    }
    else if(d.amount <=100000){
      (dstObj.children[2].children).push(d);
    }
    else if(d.amount<=500000){
      (dstObj.children[3].children).push(d);
    }
    else if(d.amount >= 1000000){
      (dstObj.children[4].children).push(d);
    }
});
}


function initBl(filename){
  d3.csv(filename, function(error, data){

  if (error)throw error;

  blGrp1(t1, data);

  blGrp3(t3, data);
  
  blGrp2(t2, data);

  blGrp4(t4, data);

  blGrp5(t5, data);
  
});}

function circlePackMouseOver(d, i){

var className = d3.select(this).attr("class");

if(className === 'parent')return;

var donor = d.donor;
var amount = d.amount;
var entity = d.entity;
var party = d.party;

responsiveVoice.speak(":" + donor + ":" + amount);

  // image url that want to check
  var imageFile = "https://raw.githubusercontent.com/ioniodi/D3js-uk-political-donations/master/photos/" + donor + ".ico";

  // πληροφορίες που θα εμφανίσουμε στο tooltip - τον κώδικα HTML
  var infoBox = "<p> Source: <b>" + donor + "</b> " +  "<span><img src='" + imageFile + "' height='42' width='42' onError='this.src=\"https://github.com/favicon.ico\";'></span></p>"     
                + "<p> Recipient: <b>" + party + "</b></p>"
                + "<p> Type of donor: <b>" + entity + "</b></p>"
                + "<p> Total value: <b>&#163;" + comma(amount) + "</b></p>";

  /* tooltip για οταν τοποθετήσουμε το κουμπί μας πάνω σε μια μπάλα */
  tooltipCPC
    .style("left", (parseInt(d.x - 80)) + "px")
    .style("top", (parseInt(d.y)) + "px")
  .html(infoBox)
  .style("display","block");
  d3.select(this).style("fill","black");

  addImageHistory(imageFile, donor, infoBox);

}

function circlePackMouseOut(){
  console.log("circlePackMouseOut");
  tooltipCPC.style("display", "none");
  var className = d3.select(this).attr("class");
  if(className === 'child'){
    responsiveVoice.cancel();
    tooltipCPC.style("display", "none");
    d3.select(this).style("fill", "red");

  }
}

function bubblePackLayout(name){

  d3.select("#circlePackChart svg").selectAll("*").remove();

  pack1 = d3.layout.pack()
                .size([width, height - 50])
                .padding(3000)
                .value(function(d){
                  return d.amount;
                });

  radius = d3.scale.sqrt().range([5,20]);

  var data = blObjects[name];

  var nodes = pack1.nodes(data);

  var node = svg3.selectAll(".node")
    .data(nodes).enter()
    .append("g")
    .attr("class", "node")
     .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .on("mouseover", circlePackMouseOver)
      .on("mouseout", circlePackMouseOut)
      .attr("r",function(d) { return d.children ? d.r: radius(d.r); })
      .on("click", function(d){
          var className = d3.select(this).attr("class");
          if(className === 'child'){
            window.open('http://google.com/search?q=' + d.donor);
          }
        })
      .attr("class",function(d){
        if(d.children){
          return "parent";
        }
        else{
          return "child";
        }
      })
      .attr("fill", function(d){
        if(d.children){
          return "steelblue";
        }
        else{
          return "red";
        }
      })
      .attr("opacity", 0.25)
      .attr("stroke", "#ADADAD")
      .attr("stroke-width", 2);
   node.append("text")
       .text(function(d) { return d.children && d.depth > 0 ? d.name : ""; });
}


