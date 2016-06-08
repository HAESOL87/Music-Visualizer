$(document).ready(function () {

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  var toggle;

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(600);

  var MapColumns = 30,
    MapRows = 20;

  var margin = {
    top: 140,
    right: 30,
    bottom: 120,
    left: 30
  };

  //First try for width
  var width = Math.max(Math.min(window.innerWidth, 1000), 500) - margin.left - margin.right - 20;
  var height = window.innerHeight - margin.top - margin.bottom - 20;

  //The maximum radius the hexagons can have to still fit the screen
  var hexRadius = d3.min([width/(Math.sqrt(3)*MapColumns), height/(MapRows*1.5)]);

  //Set the new height and width based on the max possible
  var width = MapColumns*hexRadius*Math.sqrt(3);
  var height = MapRows*1.5*hexRadius+0.5*hexRadius;

  //SVG container
  var svg = d3.select('#visualizer')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Reset the overall font size
  var newFontSize = width * 62.5 / 800;
  d3.select("html").style("font-size", newFontSize + "%");

  //Format to display numbers
  var formatPercent = d3.format("%");

  //Needed for gradients
  var defs = svg.append("defs");

  ///////////////////////////////////////////////////////////////////////////
  //////////////// Calculate hexagon centers and put into array /////////////
  ///////////////////////////////////////////////////////////////////////////

  var SQRT3 = Math.sqrt(3),
      hexWidth = SQRT3 * hexRadius,
      hexHeight = 2 * hexRadius;
  var hexagonPoly = [[0,-1],[SQRT3/2,0.5],[0,1],[-SQRT3/2,0.5],[-SQRT3/2,-0.5],[0,-1],[SQRT3/2,-0.5]];
  var hexagonPath = "m" + hexagonPoly.map(function(p){ return [p[0]*hexRadius, p[1]*hexRadius].join(','); }).join('l') + "z";

  var points = [];
  for (var i = 0; i < MapRows; i++) {
    for (var j = 0; j < MapColumns; j++) {
      var a;
      var b = (3 * i) * hexRadius / 2;
      if (i % 2 === 0) {
        a = SQRT3 * j * hexRadius;
      } else {
        a = SQRT3 * (j - 0.5) * hexRadius;
      }//else
      points.push({x: a, y: b});
    }//for j
  }//for i

  ///////////////////////////////////////////////////////////////////////////
  //////// Get continuous color scale for the Yellow-Green-Blue fill ////////
  ///////////////////////////////////////////////////////////////////////////

  // var coloursYGB = ["#FFFFDD","#AAF191","#80D385","#61B385","#3E9583","#217681","#285285","#1F2D86","#000086"];
  // var colourRangeYGB = d3.range(0, 1, 1.0 / (coloursYGB.length - 1));
  // colourRangeYGB.push(1);

  // //Create color gradient
  // var colorScaleYGB = d3.scale.linear()
  //   .domain(colourRangeYGB)
  //   .range(coloursYGB)
  //   .interpolate(d3.interpolateHcl);

  // //Needed to map the values of the dataset to the color scale
  // var colorInterpolateYGB = d3.scale.linear()
  //   .domain(d3.extent(somData))
  //   .range([0,1]);

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////// Create the YGB color gradient ///////////////////////
  ///////////////////////////////////////////////////////////////////////////

  // //Calculate the gradient
  // defs.append("linearGradient")
  //   .attr("id", "gradient-ygb-colors")
  //   .attr("x1", "0%").attr("y1", "0%")
  //   .attr("x2", "100%").attr("y2", "0%")
  //   .selectAll("stop")
  //   .data(coloursYGB)
  //   .enter().append("stop")
  //   .attr("offset", function(d,i) { return i/(coloursYGB.length-1); })
  //   .attr("stop-color", function(d) { return d; });

  ///////////////////////////////////////////////////////////////////////////
  //////////// Get continuous color scale for the Rainbow ///////////////////
  ///////////////////////////////////////////////////////////////////////////

  var coloursRainbow = ["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"];
  var colourRangeRainbow = d3.range(0, 1, 1.0 / (coloursRainbow.length - 1));
  colourRangeRainbow.push(1);

  //Create color gradient
  var colorScaleRainbow = d3.scale.linear()
    .domain(colourRangeRainbow)
    .range(coloursRainbow)
    .interpolate(d3.interpolateHcl);

  // var colorScaleRainbow = d3.scale.category20();

  //Needed to map the values of the dataset to the color scale
  // var colorInterpolateRainbow = d3.scale.linear()
  //   .domain(d3.extent(data))
  //   .range([0,1]);

  var colorInterpolateRainbow = d3.scale.linear()
    .domain([0,255])
    .range([0,1]);

  ///////////////////////////////////////////////////////////////////////////
  //////////////////// Create the Rainbow color gradient ////////////////////
  ///////////////////////////////////////////////////////////////////////////

  //Calculate the gradient
  defs.append("linearGradient")
    .attr("id", "gradient-rainbow-colors")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "100%").attr("y2", "0%")
    .selectAll("stop")
    .data(coloursRainbow)
    .enter().append("stop")
    .attr("offset", function(d,i) { return i/(coloursRainbow.length-1); })
    .attr("stop-color", function(d) { return d; });

  ///////////////////////////////////////////////////////////////////////////
  //////////////////////////// Draw Heatmap /////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  svg.append("g")
    .selectAll(".hexagon")
    .data(points)
    .enter().append("path")
    .attr("class", "hexagon")
    .attr("d", function (d) { return "M" + d.x + "," + d.y + hexagonPath; })
    .style("stroke", "#fff")
    .style("stroke-width", "1px")
    .style("fill", "white")
    // .on("mouseover", mover)
    // .on("mouseout", mout);

  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////// Draw the legend ////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  var legendWidth = width * 0.6,
    legendHeight = 10;

  //Color Legend container
  var legendsvg = svg.append("g")
    .attr("class", "legendWrapper")
    .attr("transform", "translate(" + (width/2 - 10) + "," + (height+50) + ")");

  //Draw the Rectangle
  legendsvg.append("rect")
    .attr("class", "legendRect")
    .attr("x", -legendWidth/2)
    .attr("y", 10)
    //.attr("rx", legendHeight/2)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "none");

  //Append title
  legendsvg.append("text")
    .attr("class", "legendTitle")
    .attr("x", 0)
    .attr("y", -2)
    .text("Store Competition Index");

  //Set scale for x-axis
  var xScale = d3.scale.linear()
     .range([0, legendWidth])
     .domain([0,100]);
     //.domain([d3.min(pt.legendSOM.colorData)/100, d3.max(pt.legendSOM.colorData)/100]);

  //Define x-axis
  var xAxis = d3.svg.axis()
      .orient("bottom")
      .ticks(5)  //Set rough # of ticks
      //.tickFormat(formatPercent)
      .scale(xScale);

  //Set up X axis
  legendsvg.append("g")
    .attr("class", "axis")  //Assign "axis" class
    .attr("transform", "translate(" + (-legendWidth/2) + "," + (10 + legendHeight) + ")")
    .call(xAxis);

  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////// Mouse Interactions /////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  // //Function to call when you mouseover a node
  // function mover(d) {
  //   var el = d3.select(this)
  //     .transition()
  //     .duration(10)
  //     .style("fill-opacity", 0.3);
  // }

  // //Mouseout function
  // function mout(d) {
  //   var el = d3.select(this)
  //      .transition()
  //      .duration(1000)
  //      .style("fill-opacity", 1);
  // };

  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////// Color Interactions /////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  // //On click transition
  // d3.select("body").on("click", function() {
  //     if(currentFill === "rainbow") {
  //       updateYGB();
  //       currentFill = "YGB";
  //     } else {
  //       updateRainbow();
  //       currentFill = "rainbow";
  //     }//else
  //   });

  // //Update the colors to a more light yellow-green-dark blue
  // function updateYGB() {
  //   //Fill the legend rectangle
  //   svg.select(".legendRect")
  //     .style("fill", "url(#gradient-ygb-colors)");
  //   //Transition the hexagon colors
  //   svg.selectAll(".hexagon")
  //     .transition().duration(1000)
  //     .style("fill", function (d,i) { return colorScaleYGB(colorInterpolateYGB(somData[i])); });
  // }//updateYGB

  // //Transition the colors to a rainbow
  // function renderChart() {
  //        requestAnimationFrame(renderChart);

  //      // Copy frequency data to frequencyData array.
  //      analyser.getByteFrequencyData(frequencyData);

  //      Needed to map the values of the dataset to the color scale
  // var colorInterpolateRainbow = d3.scale.linear()
  //   .domain(d3.extent(frequencyData))
  //   .range([0,1]);


  //   //Fill the legend rectangle
  //   svg.select(".legendRect")
  //     .style("fill", "url(#gradient-rainbow-colors)");
  //   //Transition the hexagon colors
  //   svg.selectAll(".hexagon")
  //     .transition().duration(1000)
  //     .style("fill", function (d,i) { return colorScaleRainbow(colorInterpolateRainbow(frequencyData[i])); })

  //     console.log("Hello");
  // }//updateRainbow


  //Transition the colors to a rainbow
  function renderChart() {
      requestAnimationFrame(renderChart);

      // copy frequency data to frequencyData array.
      analyser.getByteFrequencyData(frequencyData);

      console.log(frequencyData)

      //Fill the legend rectangle
      svg.select(".legendRect")
      .style("fill", "url(#gradient-rainbow-colors)");

      //Transition the hexagon colors
      svg.selectAll(".hexagon")
      // .transition().duration(1000)
      .style("fill", function (d,i) { return colorScaleRainbow(colorInterpolateRainbow(frequencyData[i])); })
  }

  //Start set-up
  $('#play').on("click", function(){
    toggle = requestAnimationFrame(renderChart);
  });

  $('#pause').on("click", function(){
    cancelAnimationFrame(toggle);
  });

});
