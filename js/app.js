function makeResponsive() {
    // Setting up the SVG area dimensions
    var svgWidth = 960;
    var svgHeight = 500;

    // Setting up the Chart's margin
    var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;


    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
    .select("#scatter") //the div name is scatter
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Read CSV using d3.csv
    d3.csv("../assets/data/data.csv").then(function(journalData) {
        console.log(journalData);
        // step 1: Parse Data/Cast as numbers
        journalData.forEach(function(data){
            data.age = +data.age;
            data.smokes = +data.smokes;
            console.log(data);
        });
        // step 2: create scale functions
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(journalData, d => d.age), d3.max(journalData, d => d.age)]) //spacing of the circle
            .range([0, width])
            .nice();  // making the intersection of axes looks nice
        
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(journalData, d => d.smokes), d3.max(journalData, d => d.smokes)])
            .range([height, 0])
            .nice();

        // step 3: create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);  //xAxis
        var leftAxis = d3.axisLeft(yLinearScale); //yAxis

        // step 4: append Axes to the chart
        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        chartGroup.append("g") //xAxis
        .call(leftAxis);  //yAxis

        // step 5: create circles
        var circlesGroup = chartGroup.selectAll("circle")
        .data(journalData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "15")
        .attr("fill", "black")
        .classed("stateCircle", true)
        .attr("opacity", 0.75);

        // adding the State Name to the individual circle
        chartGroup.selectAll()
        .data(journalData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.age))
        .attr("y", d => yLinearScale(d.smokes))
        .text(d => d.abbr)
        .attr("font-size", "12")
        .style("fill", "black") //instead of attr, use style
        .classed("stateText", true)
        .attr("opacity", 0.75);

        // Step 6: Initialize tool tip
        // ==============================
        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Age: ${d.age}<br>Smokes: ${d.smokes}`);
        });

        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

        // Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "16px")
        .attr("class", "axisText")
        .classed("active", true)
        .text("Smokes (%)");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .classed("active", true)
        .text("Age (Median)");
    }).catch(function(error) {
        console.log(error);
    });
}
makeResponsive();


  