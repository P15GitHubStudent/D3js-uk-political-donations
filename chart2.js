
var barChartId = "#barChart";

function grp1(data){
  var money =["25K", "50K", "100K", "700K", "1M"]; // ta euri timon pou xrisimopoiountai gia tin omadopoisi
    var outdata = []; //ta dedomena pou tha epistrepsei i sunartisi auti

    money.forEach(function(d,i){
      outdata.push({name:d, value: 0});
    });

    data.forEach(function(d, i){
         if(d.amount<=25000){
            outdata[0].value+=1;
          }
          else if(d.amount<=50000){
            outdata[1].value+=1;
          }
          else if(d.amount <=100000){
            outdata[2].value+=1;
          }
          else if(d.amount<=700000){
            outdata[3].value+=1;
          }
          else if(d.amount >= 1000000){
            outdata[4].value+=1;
          }
      });
    return outdata;  
}

var svg2 = d3.select(barChartId).append("svg")
  .attr("id", "barChartSvg")
  .attr("width", 1000)
  .attr("height", 900);

var tooltip2 = d3.select(barChartId)
  .append("div")
  .attr("class", "tooltip3")
  .attr("id", "tooltip3");

var tooltp4 = d3.select(barChartId)
.append("div")
.attr("class", "tooltip")
.attr("id", "tooltp4");

function barChartTransition(name){

    barchartCallbacks["current"]=barchartCallbacks[name];
    displayBarChart();
    $("#initial-content").fadeIn(250);
    $("#value-scale").fadeIn(1000);
    $("#view-donor-type").fadeOut(250); 
    $("#view-source-type").fadeOut(250); 
    $("#view-party-type").fadeOut(250); 
    $("#view-amount-donation").fadeOut(250); // ADDITION
}

//var transitionCallbacks = {"BubbleChart": BubbleChartTransition, "CirclePackingChart": null, "BarChart": barChartTransition, "current":"BubbleChart"}; 



 function calcAllMoney(data){
    var money =["25K", "50K", "100K", "700K", "1M"]; // ta euri timon pou xrisimopoiountai gia tin omadopoisi
    var outdata = []; //ta dedomena pou tha epistrepsei i sunartisi auti

    money.forEach(function(d,i){
      outdata.push({name:d, value:0});
    });

    data.forEach(function(d, i){
         if(d.amount<=25000){
            outdata[0].value+=1;
          }
          else if(d.amount<=50000){
            outdata[1].value+=1;
          }
          else if(d.amount <=100000){
            outdata[2].value+=1;
          }
          else if(d.amount<=700000){
            outdata[3].value+=1;
          }
          else if(d.amount >= 1000000){
            outdata[4].value+=1;
          }
      });
    return outdata;
  }

  function grp2(data){

    // console.log('publicVsPrivateCash()')

    var typeDonations=['public', 'private'];
    var outdata=[];

    typeDonations.forEach(function(d,i){
        outdata.push({name:d, value:0});
    });

    data.forEach(function(d,i){

       if(d.entity === "pub"){
          outdata[0].value+=1;
       }
      else{
          outdata[1].value+=1;
      }

    });

    return outdata;
  }

  function grp3(data){

    //console.log('calcSplitByParty called()')

    var parties=['con', 'lab', "lib"];
    var outdata=[];

    parties.forEach(function(d,i){
        outdata.push({name: d,value: 0})
    });

    data.forEach(function(d,i){
        if(d.party === "con"){
          outdata[0].value+=1;
        }
        else if(d.party === "lab"){
          outdata[1].value+=1;
        }
        else if(d.party === "lib"){
          outdata[2].value+=1;
        }
    });
    return outdata;
  }

  function grp4(data){

    var typeDonors=['Individual', 'Society', 'Company', 'Other' , 'Trade Union'];
    var outdata=[];

    typeDonors.forEach(function(d,i){
        outdata.push({name: d,value: 0})
    });
    
    data.forEach(function(d,i){

        if(d.entityname === "Individual"){
          outdata[0].value+=1;
        }
        else if(d.entityname === "Society"){
          outdata[1].value+=1;
        }
        else if(d.entityname === "Company"){
          outdata[2].value+=1;
        }
        else if(d.entityname === "Other"){
          outdata[3].value+=1;
        }
        else if(d.entityname === "Public Funds"){
          outdata[4].value+=1;
        }
    });

    return outdata;
}

  function grp5(data){
     //console.log('splitByTheAmountOfDonation called()')
    //300001,550001
    outdata = [];
    samountd =["small", "medium", "large"];

     samountd.forEach(function(d,i){
        outdata.push({name: d,value: 0})
    });

    // console.log('Outdata' , outdata);

    data.forEach(function(d,i){
          //console.log(d.value);
          if(d.amount<=300001){
              outdata[0].value+=1;
          }
          else if(d.amount<=550001){
            outdata[1].value+=1;
          }
          else{
            outdata[2].value+=1;
          }
  });
    return outdata;
  }

var barchartCallbacks={"all-donations":grp1, "group-by-money-source": grp2, 
"group-by-party": grp3, "group-by-donor-type": grp4, "group-by-donation-amount": grp5, "current": grp1};


function displayBarChart(data){

  // Chart Size Setup
    var margin = { top: 35, right: 0, bottom: 30, left: 40 };

    var width = 500 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var tx = 0, ty = 0;

    var dataset = (barchartCallbacks[currentGrouping])(data);

    d3.select("#barChart svg").selectAll("*").remove();

    var chart = svg2.append("g").attr("transform", "translate(" + (margin.left + 260) + "," + (margin.top) + ")");

    ///// Scales //////////
    var x = d3.scale.ordinal()
        .domain(dataset.map(function(d) { return d['name']; }))
        .rangeRoundBands([0, height], .1); //to .1 gia keno

    var y = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d['value']+100;}) * 4])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    ///////////////////////
    // Title
    chart.append("text")
      .text(d['value'])
      .attr("text-anchor", "middle")
      .attr("class", "graph-title")
      .attr("y", -10)
      .attr("x", width / 2.0);

    ///////////////////////
    // Bars
    var bar = chart.selectAll(".bar")
      .data(dataset)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d){ return x( d['name']); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr("height", 0);

    bar.transition()
        .duration(1200)
        .ease("elastic")
        .attr("y", function(d) { return y(d['value']); })
        .attr("height", function(d) { return height - y(d['value']);});

    ///////////////////////
    // Tooltip

    bar.on("mouseover", function(d) {
      console.log("d", d);
          tooltip2.html(d['value'])
              .style("visibility", "visible")
              .style("left", parseInt(d.x) + "px");
          d3.select(this).style("stroke", "black");
        })
        .on("mouseout", function(d) {
          tooltip2.style("visibility", "hidden");
          d3.select(this).style("stroke", "none");
        });
}

function drawBarChart(name){
  return d3.csv("data/7500up.csv", displayBarChart);
}