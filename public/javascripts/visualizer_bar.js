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

  var svgHeight = '300';
  var svgWidth = '1000';
  var barPadding = '1';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  var svg = createSvg('body', svgHeight, svgWidth);

  // Create our initial D3 chart.
  svg.selectAll('rect')
     .data(frequencyData)
     .enter()
     .append('rect')
     .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr('width', svgWidth / frequencyData.length - barPadding);

  // Continuously loop and update chart with frequency data.
  function renderChart() {
     requestAnimationFrame(renderChart);

     // Copy frequency data to frequencyData array.
     analyser.getByteFrequencyData(frequencyData);

  //   var colours = ["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB",
  //              "#63FF9B", "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63",
  //              "#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364"];

  // var heatmapColour = d3.scale.linear()
  // .domain(d3.range(0, 1, 1.0 / (colours.length - 1)))
  // .range(colours);

     // Update d3 chart with new data.
     svg.selectAll('rect')
        .data(frequencyData)
        .attr('y', function(d) {
           return svgHeight - d;
        })
        .attr('height', function(d) {
           return d;
        })
        .attr('fill', function(d) {
           return 'rgb(0, 0, ' + d + ')';
        //    return 'rgb(0,' + d + ', 0)';
        })
  }

    //     var colors = d3.scale.linear()
  // .domain([0, frequencydata.length*.33, frequencydata.length*.66, frequencydata.length])
  // .range(['#d6e9c6', '#bce8f1', '#faebcc', '#ebccd1'])

       // .style({'fill': function(data,i){return colors(i);}, 'stroke': '#31708f', 'stroke-width': '5'})

  // var colours = ["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB",
  //              "#63FF9B", "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63",
  //              "#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364"];

  // var heatmapColour = d3.scale.linear()
  // .domain(d3.range(0, 1, 1.0 / (colours.length - 1)))
  // .range(colours);

  // // dynamic bit...
  // var c = d3.scale.linear().domain(d3.extent(frequencydata)).range([0,1]);

       // .style("fill", function(d) {
     //    return heatmapColour(d.value);
     // })


  // Run the loop
  renderChart();

});
