
// set the dimensions and margins of the graph
var margin = {top: 75, right: 150, bottom: 60, left: 100},
    width1 =1000 - margin.left - margin.right,
    width = window.innerWidth * 0.6,
    height = window.innerHeight * 0.6,
    //height = 560 - margin.top - margin.bottom;
    width2 = width1 + 0.5*margin.right,
    currentWave = wave1,
    currentX, //= "gdpcapita",
    currentY; //= "happiness";


var allVar = ["country", "code", "Continent_Name", "work", "family", 
"leisure", "politics", "friends", "religion", "happiness", "health",
"confidence", "interest", "demogood", "leadergood", "population",
"lifeexpectancy", "medianage", "cleanelection", "democracyscore", 
"education", "gdpcapita", "internetusers" ];

var allDesc = ["Country", "Code", "Continent", "Work is important", "Family is important",
"Leisure time is important", "Politics is important", "Friends are important", "Religion is important",
"Happiness", "State of health", "Confidence in the government", "Interest in politics", "Democracy is good",
"Having a strong leader is good", "Population", "Life expectancy", "Median age", "Clean election index", "Democracy score",
"Education", "GDP per capita", "Internet users"];

var allgroups = ["Asia", "Europe", "Americas", "Africa", "Oceania"];
var size = 20;
var myColor = d3.scaleOrdinal()
    .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
    //.range(d3.schemeDark2); // I like this one
    .range(d3.schemeTableau10);
var highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("."+d).style("opacity", 1)
  };

  // And when it is not hovered anymore
var noHighlight = function(d){
    d3.selectAll(".bubbles").style("opacity", 1)
  };

var z = d3.scaleSqrt()
    .domain([200000, 1500000000])
    //.domain(d3.extent(data, function(d) { return d.population; }))
    .range([ 2, 30]);

var tooltip = d3.select("#dataviz2")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "grey")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(600)
    tooltip
      .style("opacity", 1)
      .html(d.country + ", " + formatNumber((d.population/1000000).toFixed(1)) + "M") 
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(600)
      .style("opacity", 0)
  }








// append the svg object to the body of the page
var svg = d3.select("#dataviz2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + height*0.3 + "," + margin.top + ")");

//d3.csv(wave4)
//Read the data
d3.json("data/jdata.json", function(data) {
//d3.csv("data/wave1.csv", function(data) {
console.log(allVar[4])
console.log(allVar.indexOf("family"))

console.log(data.wave1)
currentWave = wave1;
currentX = "gdpcapita";
currentY = "happiness";
data = data.wave1

//console.log(data."currentWave")
//console.log(data[4].family)
  // ---------------------------//
  //       AXIS  AND SCALE      //
  // ---------------------------//

  if (currentX=="gdpcapita") {
  domx = [0,60000];
}
else if (currentX=="internetusers") {
  domx = [0,24];
}
else if (currentX=="education") {
  domx = [0,150];
}
else{
  domx = [0,100];
}

if (currentY=="gdpcapita") {
  domy = [0,60000];
}
else if (currentY=="internetusers") {
  domy = [0,24];
}
else if (currentY=="education") {
  domy = [0,150];
}
else{
  domy = [0,100];
}


  // Add X axis
  var x = d3.scaleLinear()
    //.domain([0, 60000])
    //.domain(d3.extent(data, function(d) { return Math.max(d[currentX]); }))
    .domain(domx)
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));//.ticks(5));

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width+30)
      .attr("y", height+50)
      .text(allDesc[allVar.indexOf(currentX)])
      //.text("GDP per Capita"); // how can I add the button from outside?

  //svg.append("button")
  //   .attr()

  // Add Y axis
  var y = d3.scaleLinear()
    //.domain(d3.extent(data, function(d) { return d[currentY]; }))//(Math.max(d[currentY])); }))
    .domain(domy)
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20 )
      .text(allDesc[allVar.indexOf(currentY)])
      .attr("text-anchor", "start")

  // Add a scale for bubble size
  var z = d3.scaleSqrt()
    .domain([200000, 1500000000])
    //.domain(d3.extent(data, function(d) { return d.population; }))
    .range([ 2, 30]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
    //.range(d3.schemeDark2); // I like this one
    .range(d3.schemeTableau10); // Tableau 10 colors lol

  // ---------------------------//
  //      TOOLTIP               //
  // ---------------------------//

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#dataviz2")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "grey")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(600)
    tooltip
      .style("opacity", 1)
      .html(d.country + ", " + formatNumber((d.population/1000000).toFixed(1)) + "M") 
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(600)
      .style("opacity", 0)
  }


  // ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
  var highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("."+d).style("opacity", 1)
  }

  // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".bubbles").style("opacity", 1)
  }


  // ---------------------------//
  //       CIRCLES              //
  // ---------------------------//

  // Add dots
  svg.append('g') //line.defined(function(d) { return d.y!=null; })
    .selectAll("dot")
    .data(data) 
    .enter()
    .append("circle")
      .attr("class", function(d) { return "bubbles " + d.Continent_Name })
      .attr("cx", function (d) { return x(d.gdpcapita); } )
      .attr("cy", function (d) { return y(d.cleanelection); } )
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )
      .transition()
      .duration(1500)
      .attr("r", function (d) { return 1.5*z(d.population); } ) //bubble size
      .style("fill", function (d) { return myColor(d.Continent_Name); } )
      .style("display", function(d) {return d.cleanelection == "null" ? "none" : "null";})
      //.filter(function(d) { return d.education == "null"; }).remove()

    // -3- Trigger the functions for hover
    // .on("mouseover", showTooltip )
    // .on("mousemove", moveTooltip )
    // .on("mouseleave", hideTooltip )



    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

    // Add one dot in the legend for each name.
    svg.selectAll("myrect")
      .data(allgroups)
      .enter()
      .append("circle")
        .attr("cx", (width+40)) //used to be 390
        .attr("cy", function(d,i){ return 8 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 8)
        .style("fill", function(d){ return myColor(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
        //.on("click", highlight)
        //.on("mouseover", noHighlight)

    // Add labels beside legend dots
    svg.selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
        .attr("x", (width+40) + size*.8) // width used to be 390
        .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return myColor(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)


  })


function updateXaxis(newX) {
  d3.json("data/jdata.json", function(data){
    console.log(currentWave);
    console.log(currentX);
    currentX = newX;
    console.log(currentX);
    if(currentWave=="wave1"){
      dat = data.wave1
    }
    else if(currentWave=="wave2"){
      dat = data.wave2
    }
    else if(currentWave=="wave3"){
      dat = data.wave3
    }
    else if(currentWave = "wave4"){
      dat = data.wave4
    }
    var X = currentX;
    var Y = currentY;
    updatePlot(dat, X, Y) 
})}

function updateYaxis(newY) {
  d3.json("data/jdata.json", function(data){
    console.log(currentWave);
    console.log(currentY);
    currentY = newY;
    console.log(currentY);
    if(currentWave=="wave1"){
      dat = data.wave1
    }
    else if(currentWave=="wave2"){
      dat = data.wave2
    }
    else if(currentWave=="wave3"){
      dat = data.wave3
    }
    else if(currentWave = "wave4"){
      dat = data.wave4
    }
    var X = currentX;
    var Y = currentY;
    updatePlot(dat, X, Y) 
})}


function switchWave(wave) {
  d3.json("data/jdata.json", function(data) {
    console.log(wave);
    console.log(currentY);
    console.log(currentX);
    currentWave = wave;
    if(wave=="wave1"){
      dat = data.wave1
    }
    else if(wave=="wave2"){
      dat = data.wave2
    }
    else if(wave=="wave3"){
      dat = data.wave3
    }
    else if(wave = "wave4"){
      dat = data.wave4
    }
    var X = currentX
    var Y = currentY
    updatePlot(dat, X, Y) 
  })}


function updatePlot(data, currentX, currentY){

if (currentX=="gdpcapita") {
  domx = [0,60000];
}
else if (currentX=="internetusers") {
  domx = [0,24];
}
else if (currentX=="education") {
  domx = [0,150];
}
else{
  domx = [0,100];
}

if (currentY=="gdpcapita") {
  domy = [0,60000];
}
else if (currentY=="internetusers") {
  domy = [0,24];
}
else if (currentY=="education") {
  domy = [0,150];
}
else{
  domy = [0,100];
}


  var x = d3.scaleLinear()
    //.domain(d3.extent(data, function(d) { return Math.max(d[currentX]); }))
    .domain(domx)
    .range([ 0, width ]);
  svg.selectAll("g").remove();
  svg.selectAll("text").remove();
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .transition()
    .duration(600)
    .call(d3.axisBottom(x));

  // Add X axis label:
  //svg.selectAll("text").remove();
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width+30)
      .attr("y", height+50)
      .text(allDesc[allVar.indexOf(currentX)])
      

// var x = d3.scaleLinear()
//     //.domain([0, 60000])
//     //.domain(d3.extent(data, function(d) { return Math.max(d[currentX]); }))
//     .domain(domx)
//     .range([ 0, width ]);
//   svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x));//.ticks(5));




  // Add Y axis
  var y = d3.scaleLinear()
    //.domain(d3.extent(data, function(d) { return d[currentY]; }))//(Math.max(d[currentY])); }))
    .domain(domy)
    .range([height, 0]);
  svg.append("g")
    .transition()
    .duration(400)
    .call(d3.axisLeft(y));

  // Add Y axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20 )
      .text(allDesc[allVar.indexOf(currentY)])
      .attr("text-anchor", "start")

  svg.selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
        .attr("x", (width+20) + size*.8) // width used to be 390
        .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return myColor(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)


  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function(d) { return "bubbles " + d.Continent_Name })
      .attr("cx", function (d) { return x(d[currentX]); } )
      .attr("cy", function (d) { return y(d[currentY]); } )
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )
      .transition()
      .duration(400)
      .attr("r", function (d) { return 1.5*z(d.population); } ) //bubble size
      .style("fill", function (d) { return myColor(d.Continent_Name); } )
      .style("display", function(d) {return d[currentX] == "null" ? "none" : "null";})
      .style("display", function(d) {return d[currentY] == "null" ? "none" : "null";})


};
















