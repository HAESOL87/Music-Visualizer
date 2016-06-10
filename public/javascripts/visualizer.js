$(document).ready(function () {

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  var menu = 1;
  var animationToggle;
  var colorToggle = 1;
  var svgHeight = '520';
  var svgWidth = '1160';

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);


  // Bar Visualizer
  function bar() {

    $("#visualizer").children().remove();

    var frequencyData = new Uint8Array(60);

    var barPadding = '2.5';

    // Create svg container
    var svg = d3.select('#visualizer').append('svg').attr('height', svgHeight).attr('width', svgWidth);

    // Create color gradient
    var colorScaleRainbow = d3.scale.category20();

    // Create initial d3 chart.
    svg.selectAll('rect')
       .data(frequencyData)
       .enter()
       .append('rect')
       .attr('x', function (d, i) {
          return i * (svgWidth / frequencyData.length);
       })
       .attr('width', svgWidth / frequencyData.length - barPadding)


    // Render frequency data into chart
    function renderChart() {
       requestAnimationFrame(renderChart);

       analyser.getByteFrequencyData(frequencyData);

       // Update d3 chart with new data.
       svg.selectAll('rect')
          .data(frequencyData)
          .attr('y', function(d) {
             return svgHeight - d * 2.2 ;
          })
          .attr('height', function(d) {
             return 620;
          })
          // .attr("transform", "translate(" + 8 + "," + 0 + ")");

        if(colorToggle == 1){
          svg.selectAll('rect')
            .data(frequencyData)
            .attr('fill', function(d, i) {
               return colorScaleRainbow(i);
            })
        }
        if(colorToggle == 2){
          svg.selectAll('rect')
            .data(frequencyData)
            .attr('fill', '#FFF')
        }
    }

    animationToggle = requestAnimationFrame(renderChart);

  }

  // Circle Visualizer
  function circle() {

    $("#visualizer").children().remove();

      var frequencyData = new Uint8Array(200);

      //Create svg container
      var svg = d3.select('#visualizer').append('svg').attr('height', svgHeight).attr('width', svgWidth);

      // Render frequency data into chart
      function renderChart() {
          requestAnimationFrame(renderChart);

          analyser.getByteFrequencyData(frequencyData);

          //Scale radius and hue scale
          var radiusScale = d3.scale.linear()
            .domain([75, d3.max(frequencyData)])
            .range([0, svgHeight/1.2]);

          var hueScale = d3.scale.linear()
            .domain([0, d3.max(frequencyData)])
            .range([0, 360]);

          // Update d3 chart with new data
          var circle = svg.selectAll('circle')
            .data(frequencyData)

            circle.enter().append('circle');

            circle.attr({
                  r: function(d) {
                    if (radiusScale(d) < 0){
                      var radius = radiusScale(d) * -1;
                      return radius;
                    }
                    else {
                      return radiusScale(d);
                    }
                  },
                  cx: svgWidth / 2,
                  cy: svgHeight / 2
            });

            if(colorToggle == 1){
              circle.attr({
                  fill: 'none',
                  'stroke-width': 3,
                  'stroke-opacity': 0.5,
                  stroke: function(d) { return d3.hsl(hueScale(d), 1, 0.5); }
              });
            }

            if(colorToggle == 2){
              circle.attr({
                  fill: 'none',
                  'stroke-width': 3,
                  'stroke-opacity': 0.5,
                  stroke: function(d) { return d3.hsl("white"); }
              });
            }

            circle.exit().remove();

      }

      animationToggle = requestAnimationFrame(renderChart);

  }

  // Radial visualizer
  function radial() {

    $("#visualizer").children().remove();

    var frequencyData = new Uint8Array(180);

    //Create SVG container
    var svg = d3.select("#visualizer")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", "translate(" + (svgWidth/2) + "," + (svgHeight/2) + ")");

    //Set minimum inner radius and max outer radius
    var outerRadius = Math.min(svgWidth, svgHeight, 500)/2,
        innerRadius = outerRadius * 0.3;

    var colorScale = d3.scale.category10();

    // Scale for the heights of the bar
    var barScale = d3.scale.linear()
      .range([innerRadius, outerRadius])
      .domain([-45,150]);

    // Scale to turn data into 360 degree
    var angle = d3.scale.linear()
      .range([-180, 178])
      .domain(d3.extent(frequencyData, function(d,i) { return i; }));

    // Wrapper for the bars
    var barWrapper = svg.append("g")
      .attr("transform", "translate(" + 0 + "," + 0 + ")");

    // Draw initial bars
    barWrapper.selectAll(".bar")
      .data(frequencyData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("transform", function(d,i) { return "rotate(" + (angle(i)) + ")"; })
      .attr("width", 3)
      .attr("x", 0)
      .style("fill", function(d,i) { return colorScale(i); });

    // Render frequency data into chart
    function renderChart() {

      if(colorToggle == 1){
        var fps = 30;

        setTimeout(function() {
          requestAnimationFrame(renderChart);

          analyser.getByteFrequencyData(frequencyData);

          // Update d3 chart with new data.
          barWrapper.selectAll('.bar')
            .data(frequencyData)
            .attr("height", function(d) { return d * 1.7; })
            .attr("y", function(d,i) {return barScale((Math.floor(Math.random() * -100) + 60)); })
            .style("fill", function(d,i) { return colorScale(i); })
          }, 1000 / fps);
      }

      if(colorToggle == 2){
        var fps = 30;

        setTimeout(function() {
          requestAnimationFrame(renderChart);

          analyser.getByteFrequencyData(frequencyData);

          // Update d3 chart with new data.
          barWrapper.selectAll('.bar')
            .data(frequencyData)
            .attr("height", function(d) { return d * 1.7; })
            .attr("y", function(d,i) {return barScale((Math.floor(Math.random() * -100) + 60)); })
            .style("fill", "#FFF")
          }, 1000 / fps);
      }
    }

    animationToggle = requestAnimationFrame(renderChart);

  }

  // Hexagon visualizer
  function hexagon() {

    $("#visualizer").children().remove();

    var frequencyData = new Uint8Array(760);

    var MapColumns = 38,
        MapRows = 20;

    // The maximum radius the hexagons can have to still fit the screen
    var hexRadius = d3.min([svgWidth/(1.9 * MapColumns), svgHeight/(MapRows * 1.6)]);

    // Create svg container
    var svg = d3.select('#visualizer')
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth)
      .append("g")
      .attr("transform", "translate(" + 70 + "," + 35 + ")");

    // Calculate hexagon centers and put it into an array
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
        }
        points.push({x: a, y: b});
      }
    }

    // Get continuous color scale for the rainbow
    var colorsRainbow = ["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"];
    var colorRangeRainbow = d3.range(0, 1, 1.0 / (colorsRainbow.length - 1));
    colorRangeRainbow.push(1);

    // Create rainbow color gradient
    var colorScaleRainbow = d3.scale.linear()
      .domain(colorRangeRainbow)
      .range(colorsRainbow)
      .interpolate(d3.interpolateHcl);

    var colorInterpolateRainbow = d3.scale.linear()
      .domain([0,255])
      .range([0,1]);


    // Get continuous color scale for the gray
    var colorsGray = ["#191919", "#333333","#4C4C4C","#666666","#7F7F7F","#999999","#B2B2B2","#CCCCCC","#E5E5E5"];
    var colorRangeGray = d3.range(0, 1, 1.0 / (colorsGray.length - 1));
    colorRangeGray.push(1);

    // Create gray color gradient
    var colorScaleGray = d3.scale.linear()
      .domain(colorRangeGray)
      .range(colorsGray)
      .interpolate(d3.interpolateHcl);


    var colorInterpolateGray = d3.scale.linear()
      .domain([0,255])
      .range([0,1]);


    // Draw heatmap
    svg.append("g")
      .selectAll(".hexagon")
      .data(points)
      .enter().append("path")
      .attr("class", "hexagon")
      .attr("d", function (d) { return "M" + d.x + "," + d.y + hexagonPath; })
      .style("stroke", "#fff")
      .style("stroke-width", "1px")

    // Transition the colors, Render frequency data into chart
    function renderChart() {
        requestAnimationFrame(renderChart);

        analyser.getByteFrequencyData(frequencyData);

        if(colorToggle == 1){
        //Transition the hexagon colors
        svg.selectAll(".hexagon")
        .style("fill", function (d,i) { return colorScaleRainbow(colorInterpolateRainbow(frequencyData[i])); })
        }

        if(colorToggle == 2){
        //Transition the hexagon colors
        svg.selectAll(".hexagon")
        .style("fill", function (d,i) { return colorScaleGray(colorInterpolateGray(frequencyData[i])); })
        }
    }

   animationToggle = requestAnimationFrame(renderChart);

}

  // Play Music
  $('#play').on("click", function() {
    if(menu == 1) {
      bar();
    }
    if(menu == 2) {
      circle();
    }
    if(menu == 3) {
      radial();
    }
    if(menu == 4) {
      hexagon();
    }
  });

  // Pause Music
  $('#pause').on("click", function(){
    cancelAnimationFrame(animationToggle);
  });

  // Load bar visualizer
  $('#bar').on("click", function(){
    bar();
    menu = 1;
  });
  // Load circle visualizer
  $('#circle').on("click", function(){
    circle();
    menu = 2;
  });
  // Load radial visualizer
  $('#radial').on("click", function(){
    radial();
    menu = 3;
  });
  // Load hexagon visualizer
  $('#hexagon').on("click", function(){
    hexagon();
    menu = 4;
  });

  // Change theme to color
  $('#color').on("click", function(){
    $('body').css("background", "#FFF");
    $('#title').css("color", "#222");
    $('#songLoaded').css("color", "#222");
    $('.divide').css("color", "#222");
    colorToggle = 1;
  });

  // Change theme to black
  $('#black').on("click", function(){
    $('body').css("background", "#222");
    $('#title').css("color", "#FFF");
    $('#songLoaded').css("color", "#FFF");
    $('.divide').css("color", "#FFF");
    colorToggle = 2;
  });

});
