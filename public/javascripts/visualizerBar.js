$(document).ready(function () {

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  var toggle;

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  //var frequency = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(50);

  var initialData = [88, 64, 134, 143, 123, 109, 101, 63, 62, 98, 116, 105, 106, 134, 151, 145, 122, 113, 113, 118, 94, 84, 33, 89, 116, 120, 116, 120, 125, 121, 124, 136, 155, 183, 194, 185, 158, 132, 105, 107, 111, 85, 72, 91, 73, 90, 71, 62, 86, 94];

  //Set svg container size
  var svgHeight = '350';
  var svgWidth = '800';
  var barPadding = '2';

  //  //Set svg container size
  // var svgHeight = $(document).height();
  // var svgWidth = $(document).width();
  // var barPadding = '2';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  //Create svg container
  var svg = createSvg('#visualizer', svgHeight, svgWidth);

  //Create color gradient
  var colorScaleRainbow = d3.scale.category20();

  // var coloursRainbow = ["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"];
  // var colourRangeRainbow = d3.range(0, 1, 1.0 / (coloursRainbow.length - 1));
  // colourRangeRainbow.push(1);

  // //Create color gradient
  // var colorScaleRainbow = d3.scale.linear()
  //   .domain(colourRangeRainbow)
  //   .range(coloursRainbow)
  //   .interpolate(d3.interpolateHcl);

  // var colorInterpolateRainbow = d3.scale.linear()
  //   .domain([0,255])
  //   .range([0,1]);


  // Create our initial D3 chart.
  svg.selectAll('rect')
     .data(frequencyData)
     .enter()
     .append('rect')
     .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr('width', svgWidth / frequencyData.length - barPadding)


  // Continuously loop and update chart with frequency data.
  function renderChart() {
     requestAnimationFrame(renderChart);

     // Copy frequency data to frequencyData array.
     analyser.getByteFrequencyData(frequencyData);

     // Update d3 chart with new data.
     svg.selectAll('rect')
        .data(frequencyData)
        .attr('y', function(d) {
           return svgHeight - d;
        })
        .attr('height', function(d) {
           return d;
        })
        .attr('fill', function(d, i) {
           // return colorScaleRainbow(colorInterpolateRainbow(frequencyData[i]));
           return colorScaleRainbow(i);
        })

        console.log(frequencyData);
  }

  //Start set-up
  $('#play').on("click", function(){
    toggle = requestAnimationFrame(renderChart);
  });

  $('#pause').on("click", function(){
    cancelAnimationFrame(toggle);
  });


});
