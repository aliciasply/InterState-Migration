//Width and height of map
var width = 960;
var height = 500;

var lowColor = '#f9f9f9'
var highColor = '#bc2a66'

// D3 Projection
var projection = d3.geoAlbersUsa()
  .translate([width / 2, height / 2]) // translate to center of screen
  .scale([1000]); // scale things down so see entire US

// Define path generator
var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
  .projection(projection); // tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Load in my states data!
d3.csv("../static/data/avg_income_df.csv", function (data) {
  console.log(data)
  data.forEach(d => {
    d.AverageIncome = +d["Average_Income"];
  })
  var dataArray = [];
  for (var d = 0; d < data.length; d++) {
    dataArray.push(parseFloat(data[d].Average_Income))
  }
  var minVal = d3.min(dataArray)
  var maxVal = d3.max(dataArray)
  var ramp = d3.scaleLinear().domain([minVal, maxVal]).range([lowColor, highColor])

  // Load GeoJSON data and merge with states data
  d3.json("../static/data/us-states.json", function (json) {

    // Loop through each state data value in the .csv file
    for (var i = 0; i < data.length; i++) {

      // Grab State Name
      var dataState = data[i].State;

      // Grab data value
      var dataValue = data[i].Average_Income;

      // Find the corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.name;

        if (dataState == jsonState) {

          // Copy the data value into the JSON
          json.features[j].properties.Average_Income = dataValue;

          // Stop looking through the JSON
          break;
        }
      }
    }

    // Bind the data to the SVG and create one path per GeoJSON feature
    console.log(json.features)
    var stateLines = svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function (d) {
        console.log(d.properties.name, d.properties.Average_Income, ramp(d.properties.Average_Income));
        return ramp(d.properties.Average_Income)
      });
    var toolTip = d3.select("body").append("div").attr("class", "tooltip");
    // var toolTip = d3.select("#tooltip");
    stateLines.on("mouseover", function (d, i) {
    // stateLines.on("click", function (d, i) {
      console.log(d.properties);
      d3.select("#val").text(`x=${d3.event.pageX}, y=${d3.event.pageY}`)
      toolTip.style("display", "block");
      toolTip.html(`<strong>${d.properties.name}</strong><hr>${d.properties.Average_Income}`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    });
      
    
    //////////////////
    // add a legend
    var w = 140, h = 400;

    var key = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "legend")
      .attr("transform", "translate(900,400)");

    var legend = key.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", highColor)
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", lowColor)
      .attr("stop-opacity", 1);

    key.append("rect")
      .attr("width", w - 100)
      .attr("height", h)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(0,10)");

    var y = d3.scaleLinear()
      .range([h - 10, 10])
      .domain([minVal, maxVal]);

    var yAxis = d3.axisRight(y);

    key.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(50,0)")
      .call(yAxis)
  });
});