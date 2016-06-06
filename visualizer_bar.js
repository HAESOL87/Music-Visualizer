$(document).ready(function () {

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(200);

  //Set svg container size
  var svgHeight = '300';
  var svgWidth = '1000';
  var barPadding = '2';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  //Create svg container
  var svg = createSvg('body', svgHeight, svgWidth);



  //Needed for gradients
  var defs = svg.append("defs");

  /////////////////////////////////////////////////////////////////////////
  //////////// Get continuous color scale for the Rainbow ///////////////////
  ///////////////////////////////////////////////////////////////////////////

  var somData2 = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  var chartdata = [410, 370, 330, 270, 240, 220, 200, 180, 165, 150, 135, 130,
    135, 150, 165, 180, 200, 220, 240, 270, 300, 330, 370, 410];

  var coloursRainbow = ["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"];
  var colourRangeRainbow = d3.range(0, 1, 1.0 / (coloursRainbow.length - 1));
  colourRangeRainbow.push(1);

  // //Create color gradient
  // var colorScaleRainbow = d3.scale.linear()
  //   .domain(colourRangeRainbow)
  //   .range(coloursRainbow)
  //   .interpolate(d3.interpolateHcl);

     //Create color gradient
  var colorScaleRainbow = d3.scale.linear()
    .domain([0, chartdata.length*.33, chartdata.length*.66, chartdata.length])
    .range(coloursRainbow)
    .interpolate(d3.interpolateHcl);

     //Create color gradient
  var colorScaleRainbow = d3.scale.category20()

  //Needed to map the values of the dataset to the color scale
  var colorInterpolateRainbow = d3.scale.linear()
    .domain(d3.extent(somData2))
    .range([0,1]);

  //Calculate the gradient
  defs.append("linearGradient")
    .attr("id", "gradient-rainbow-colors")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%")
    .selectAll("stop")
    .data(coloursRainbow)
    .enter().append("stop")
    .attr("offset", function(d,i) { return i/(coloursRainbow.length-1); })
    .attr("stop-color", function(d) { return d; });

  //Color Legend container
  var legendsvg = svg.append("g")
    .attr("class", "legendWrapper")

  // Create our initial D3 chart.
  legendsvg.selectAll('rect')
     .data(frequencyData)
     .enter()
     .append('rect')
     .attr("class", "legendRect")
     .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr('width', svgWidth / frequencyData.length - barPadding)
     // .attr('height', 200)
     // .attr("fill", "url(#gradient-rainbow-colors)");
     // .attr("fill", 'rgb(0, 0, 255)')


  // Continuously loop and update chart with frequency data.
  function renderChart() {
     requestAnimationFrame(renderChart);

     // Copy frequency data to frequencyData array.
     analyser.getByteFrequencyData(frequencyData);


     // Update d3 chart with new data.
     legendsvg.selectAll('rect')
        .data(frequencyData)
        .attr('y', function(d) {
           return svgHeight - d;
        })
        .attr('height', function(d) {
           return d;
        })
        .attr('fill', function(d, i) {
           return colorScaleRainbow(i);
        //    return 'rgb(0,' + d + ', 0)';
        })

// svg.selectAll(".legendRect")
//       .style("fill", function(d) {
//         return 'rgb(0, 0, ' + d + ')';
//       });

      // legendsvg.select(".legendRect")
      // // .attr('fill', function(d) {
      // //   return 'rgb(0, 0, ' + d + ')';
      // //   // //    return 'rgb(0,' + d + ', 0)';
      // // })
      // .attr("fill", "url(#gradient-rainbow-colors)")


    // svg.select(".legendRect")
    //   .style("fill", "url(#gradient-rainbow-colors)");

  }

  //   //Transition the colors to a rainbow
  // function updateRainbow() {
  //   //Fill the legend rectangle
  //   svg.select(".legendRect")
  //     .style("fill", "url(#gradient-rainbow-colors)");
  //   //Transition the hexagon colors
  //   // svg.selectAll(".hexagon")
  //   //   .transition().duration(1000)
  //   //   .style("fill", function (d,i) { return colorScaleRainbow(colorInterpolateRainbow(somData[i])); })
  // }//updateRainbow


  // Run the loop
  renderChart();

});
