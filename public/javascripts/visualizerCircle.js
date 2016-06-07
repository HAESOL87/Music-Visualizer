$(document).ready(function () {

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(50);


///////////////////////////////////////////////////////////////////////////
//////////////////// Set up and initiate svg containers ///////////////////
///////////////////////////////////////////////////////////////////////////

var margin = {
  top: 70,
  right: 20,
  bottom: 120,
  left: 20
};
var width = window.innerWidth - margin.left - margin.right - 20;
var height = window.innerHeight - margin.top - margin.bottom - 20;


var data = [172, 195, 218, 225, 207, 193, 176, 152, 158, 170, 167, 183, 207, 219, 205, 165, 158, 157, 153, 161, 163, 153, 138, 136, 126, 127, 158, 178, 171, 139, 116, 107, 102, 102, 104, 104, 116, 129, 131, 125, 121, 137, 144, 129, 109, 110, 106, 102, 99, 99];


//SVG container
var svg = d3.select("#visualizer")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")");

///////////////////////////////////////////////////////////////////////////
//////////////////////////// Create scales ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// //Parses a string into a date
// var parseDate = d3.time.format("%Y-%m-%d").parse;

// //Turn strings into actual numbers/dates
// weatherBoston.forEach(function(d) {
//   d.date = parseDate(d.date);
// });

//Set the minimum inner radius and max outer radius of the chart
var outerRadius = Math.min(width, height, 500)/2,
  innerRadius = outerRadius * 0.4;

//Base the color scale on average temperature extremes
// var colorScale = d3.scale.linear()
//   .domain([-45, 210, 255])
//   .range(["#2c7bb6", "#ffff8c", "#d7191c"])
//   .interpolate(d3.interpolateHcl);

var colorScale = d3.scale.category20();

//Scale for the heights of the bar, not starting at zero to give the bars an initial offset outward
var barScale = d3.scale.linear()
  .range([innerRadius, outerRadius])
  .domain([-45,255]);

//Scale to turn the date into an angle of 360 degrees in total
//With the first datapoint (Jan 1st) on top
var angle = d3.scale.linear()
  .range([-180, 180])
  .domain(d3.extent(data, function(d,i) { return i; }));


///////////////////////////////////////////////////////////////////////////
///////////////////////////// Create Axes /////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Wrapper for the bars and to position it downward
var barWrapper = svg.append("g")
  .attr("transform", "translate(" + 0 + "," + 0 + ")");

//Draw gridlines below the bars
var axes = barWrapper.selectAll(".gridCircles")
  .data([-60,0,60,120,180,240])
  .enter().append("g");
//Draw the circles
axes.append("circle")
  .attr("class", "axisCircles")
  .attr("r", function(d) { return barScale(d); });
//Draw the axis labels
axes.append("text")
  .attr("class", "axisText")
  .attr("y", function(d) { return barScale(d); })
  .attr("dy", "0.3em")
  .text(function(d) { return d + "°C"});


///////////////////////////////////////////////////////////////////////////
////////////////////////////// Draw bars //////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Draw a bar per day were the height is the difference between the minimum and maximum temperature
//And the color is based on the mean temperature
barWrapper.selectAll(".tempBar")
  .data(data)
  .enter().append("rect")
  .attr("class", "tempBar")
  .attr("transform", function(d,i) { return "rotate(" + (angle(i)) + ")"; })
  .attr("width", 1.5)
  // .attr("height", function(d) {
  //   return barScale(d);
  // })
  .attr("x", 0.75)
  // .attr("y", function(d,i) {return barScale(-60); })
  .style("fill", function(d,i) { return colorScale(i); })



  function renderChart() {
     requestAnimationFrame(renderChart);

     // Copy frequency data to frequencyData array.
     analyser.getByteFrequencyData(frequencyData);

     // Update d3 chart with new data.
     barWrapper.selectAll('.tempBar')
        .data(frequencyData)
        // .attr("transform", function(d,i) { return "rotate(" + (angle(i)) + ")"; })
        // .attr("width", 1.5)
        .attr("height", function(d) {
          return barScale(d);
        })
        // .attr("x", 0.75)
        .attr("y", function(d,i) {return barScale(-60); })
        .style("fill", function(d,i) { return colorScale(i); })


  console.log(frequencyData);

  // //       //console.log("Enter here?");
  // //       // .attr('y', function(d) {
  // //       //    return svgHeight - d;
  // //       // })
  // //       // .attr('height', function(d) {
  // //       //    return d;
  // //       // })
  // //       // .attr('fill', function(d, i) {
  // //       //    return colorScaleRainbow(i);
  // //       // })

  // //       // console.log(frequencyData);

  }

  // Run the loop
  renderChart();














});


//   //Set svg container size
//   var svgHeight = '350';
//   var svgWidth = '800';
//   var barPadding = '2';

//   //  //Set svg container size
//   // var svgHeight = $(document).height();
//   // var svgWidth = $(document).width();
//   // var barPadding = '2';

//   function createSvg(parent, height, width) {
//     return d3.select(parent).append('svg').attr('height', height).attr('width', width);
//   }

//   //Create svg container
//   var svg = createSvg('#visualizer', svgHeight, svgWidth);

//   //Create color gradient
//   var colorScaleRainbow = d3.scale.category20()

//   // Create our initial D3 chart.
//   svg.selectAll('rect')
//      .data(frequencyData)
//      .enter()
//      .append('rect')
//      .attr('x', function (d, i) {
//         return i * (svgWidth / frequencyData.length);
//      })
//      .attr('width', svgWidth / frequencyData.length - barPadding)


//   // Continuously loop and update chart with frequency data.
//   function renderChart() {
//      requestAnimationFrame(renderChart);

//      // Copy frequency data to frequencyData array.
//      analyser.getByteFrequencyData(frequencyData);

//      // Update d3 chart with new data.
//      svg.selectAll('rect')
//         .data(frequencyData)
//         .attr('y', function(d) {
//            return svgHeight - d;
//         })
//         .attr('height', function(d) {
//            return d;
//         })
//         .attr('fill', function(d, i) {
//            return colorScaleRainbow(i);
//         })

//         console.log(frequencyData);

//   }




//   // Run the loop
//   renderChart();

// });
