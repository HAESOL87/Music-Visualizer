$(document).ready(function () {

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  var toggle;
  var menu = 1;
  var svgHeight = '550';
  var svgWidth = '1160';

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);


  // Bar Visualizer
  function bar() {

    $("#visualizer").children().remove();

    var frequencyData = new Uint8Array(50);

    // Set svg container size
    // var svgHeight = '570';
    // var svgWidth = '1160';
    var barPadding = '2';

    // Create svg container
    var svg = d3.select('#visualizer').append('svg').attr('height', svgHeight).attr('width', svgWidth);

    // Create color gradient
    var colorScaleRainbow = d3.scale.category20()
       // .interpolate(d3.interpolateHsl);
    // .interpolate(d3.interpolateLab);
    //.interpolate(d3.interpolateHcl)

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


    // Create initial d3 chart.
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

       analyser.getByteFrequencyData(frequencyData);

       // Update d3 chart with new data.
       svg.selectAll('rect')
          .data(frequencyData)
          .attr('y', function(d) {
             return svgHeight - d * 2.2 ;
          })
          .attr('height', function(d) {
             return 620;
             // return d / 13;
          })
          // .attr('fill', '#FFF')

          //       function(d, i) {
          //    // return colorScaleRainbow(colorInterpolateRainbow(frequencyData[i]));
          //    return colorScaleRainbow(i);
          // })
          .attr('fill', function(d, i) {
             // return colorScaleRainbow(colorInterpolateRainbow(frequencyData[i]));
             return colorScaleRainbow(i);
          })

    }

    toggle = requestAnimationFrame(renderChart);

  }

  // Circle Visualizer
  function circle() {

    $("#visualizer").children().remove();

      var frequencyData = new Uint8Array(200);

      //Set svg container size
      // var svgHeight = '570';
      // var svgWidth = '1160';

      //Create svg container
      var svg = d3.select('#visualizer').append('svg').attr('height', svgHeight).attr('width', svgWidth);

      //Continuously loop and update chart with frequency data.
      function renderChart() {
          requestAnimationFrame(renderChart);

          analyser.getByteFrequencyData(frequencyData);

          //Scale radius and hue scale
          var radiusScale = d3.scale.linear()
              .domain([60, d3.max(frequencyData)])
              .range([0, svgHeight]);

          var hueScale = d3.scale.linear()
              .domain([0, d3.max(frequencyData)])
              .range([0, 320]);

          // Update d3 chart with new data
          var circle = svg.selectAll('circle')
            .data(frequencyData)

            circle.enter().append('circle');

            circle.attr({
                  r: function(d) { return radiusScale(d); },
                  cx: svgWidth / 2,
                  cy: svgHeight / 2,
                  fill: 'none',
                  'stroke-width': 3,
                  'stroke-opacity': 0.5,
                  stroke: function(d) { return d3.hsl(hueScale(d), 1, 0.5); }
            });

            circle.exit().remove();
      }

      toggle = requestAnimationFrame(renderChart);

  }

  // Radial visualizer
  function radial() {

    $("#visualizer").children().remove();

    var frequencyData = new Uint8Array(180);

    // Set svg container size
    // var svgHeight = '570';
    // var svgWidth = '1160';

    //Create SVG container
    var svg = d3.select("#visualizer")
      .append("svg")
      .attr("width", svgWidth)// + margin.left + margin.right)
      .attr("height", svgHeight)// + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + (svgWidth/2) + "," + (svgHeight/2) + ")");

    //Set the minimum inner radius and max outer radius of the chart
    var outerRadius = Math.min(svgWidth, svgHeight, 500)/2,
        innerRadius = outerRadius * 0.3;

    //Base the color scale on average temperature extremes
    // var colorScale = d3.scale.linear()
    //   .domain([-45, 210, 255])
    //   .range(["#2c7bb6", "#ffff8c", "#d7191c"])
    //   .interpolate(d3.interpolateHcl);

    var colorScale = d3.scale.category20();

    //Scale for the heights of the bar, not starting at zero to give the bars an initial offset outward
    var barScale = d3.scale.linear()
      .range([innerRadius, outerRadius])
      .domain([-45,150]);

    //Scale to turn the date into an angle of 360 degrees in total
    //With the first datapoint (Jan 1st) on top
    var angle = d3.scale.linear()
      .range([-180, 178])
      .domain(d3.extent(frequencyData, function(d,i) { return i; }));

    //Wrapper for the bars and to position it downward
    var barWrapper = svg.append("g")
      .attr("transform", "translate(" + 0 + "," + 0 + ")");

    //Draw a bar per day were the height is the difference between the minimum and maximum temperature
    //And the color is based on the mean temperature
    barWrapper.selectAll(".bar")
      .data(frequencyData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("transform", function(d,i) { return "rotate(" + (angle(i)) + ")"; })
      .attr("width", 3)
      .attr("x", 0)
      .style("fill", function(d,i) { return colorScale(i); });

    function renderChart() {
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

    toggle = requestAnimationFrame(renderChart);

  }


  function hexagon() {

    $("#visualizer").children().remove();

    var frequencyData = new Uint8Array(960);

    // Set svg container size
    // var svgHeight = '570';
    // var svgWidth = '1160';

    var MapColumns = 35,
        MapRows = 20;

    // The maximum radius the hexagons can have to still fit the screen
    var hexRadius = d3.min([svgWidth/(1.9 * MapColumns), svgHeight/(MapRows * 1.6)]);

    // Create svg container
    var svg = d3.select('#visualizer')
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth)
      .append("g")
      .attr("transform", "translate(" + 65 + "," + 35 + ")");

    // Needed for gradients
    var defs = svg.append("defs");

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

    var coloursRainbow = ["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"];
    var colourRangeRainbow = d3.range(0, 1, 1.0 / (coloursRainbow.length - 1));
    colourRangeRainbow.push(1);

    // Create color gradient
    var colorScaleRainbow = d3.scale.linear()
      .domain(colourRangeRainbow)
      .range(coloursRainbow)
      .interpolate(d3.interpolateHcl);
      // .interpolate(d3.interpolateHsl);
      // .interpolate(d3.interpolateLab);


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

    // Transition the colors to a rainbow
    function renderChart() {
        requestAnimationFrame(renderChart);

        analyser.getByteFrequencyData(frequencyData);

        //Transition the hexagon colors
        svg.selectAll(".hexagon")
        // .transition().duration(1000)
        .style("fill", function (d,i) { return colorScaleRainbow(colorInterpolateRainbow(frequencyData[i])); })

        // .style("fill", function (d,i) { return colorScaleRainbow(frequencyData[i]); })
    }

   toggle = requestAnimationFrame(renderChart);


}

  // Play button
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

  // Pause button
  $('#pause').on("click", function(){
    cancelAnimationFrame(toggle);
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
  // Load hexagon visualizer
  $('#color').on("click", function(){
    $('body').css("background", "#FFF");
  });

  // Load hexagon visualizer
  $('#black').on("click", function(){
    $('body').css("background", "#222");
  });

});
