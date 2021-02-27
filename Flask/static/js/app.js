// set svg dimensions to be used later
var svgWidth = 960;
var svgHeight = 700;

// set borders for the SVG
var margin = {
    top: 20,
    right: 40,
    bottom: 220,
    left: 120
};

// create the width and height using the margins and parameters
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

//append a div classed chart to the scatter element
var chart = d3.select("#chart").append("div").classed("chart", true);


// append an svg element to the chart with appropriate height and width
var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

let animation = anime.timeline({
    duration: 1000, 
    easing: 'easeInOutSine',  
    loop: true
      });           
        
    animation.add({
        targets: '.one',
        keyframes: [
        {translateY: -70, backgroundColor: 'rgb(0, 255, 0)' },
        {translateY: 0, backgroundColor: 'rgb(128, 128, 128)'}   
        ]
    }).add({
        targets: '.two',
        keyframes: [
            {translateY: -70, backgroundColor: 'rgb(0, 0, 255)' },
            {translateY: 0, backgroundColor: 'rgb(128, 128, 128)'}
        ]
    }, '-=900').add({
        targets: '.three',
        keyframes: [
        {translateY: -70, backgroundColor: 'rgb(255, 0, 0)' },
        {translateY: 0, backgroundColor: 'rgb(128, 128, 128)'}
          
        ]
      }, '-=800');

// append an svg group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// initial Parameters
var chosenXAxis = "health";
var chosenYAxis = "m_in";

// function used for updating x-scale var upon clicking on axis label
function xScale(timesData, chosenXAxis) {

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(timesData, d => d[chosenXAxis]) * 0.8,
            d3.max(timesData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}

// function used for updating y-scale var upon clicking on axis label
function yScale(timesData, chosenYAxis) {

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(timesData, d => d[chosenYAxis]) * 0.8,
            d3.max(timesData, d => d[chosenYAxis]) * 1.2])
        .range([height, 0]);
    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to new circles for change in x axis or y axis
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", data => newXScale(data[chosenXAxis]))
        .attr("cy", data => newYScale(data[chosenYAxis]));

    return circlesGroup;
}

// function used for updating state labels with a transition to new 
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return textGroup;
}
// function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

    // stylize based on variable chosen
    if (chosenXAxis === 'health') {
        return `${value}`;
    }
    else if (chosenXAxis === 'commute') {
        return `${value}`;
    }
    else if (chosenXAxis === 'ownership') {
        return `${value}`;
    }
    else if (chosenXAxis === 'm_home') {
        return `${value}`;
    }
    else if (chosenXAxis === 'm_income') {
        return `${value}`;
    }
    else if (chosenXAxis === 'poverty') {
        return `${value}`;
    }
    else if (chosenXAxis === 'temp') {
        return `${value}`;
    }
    else {
        return `${value}`;
    }
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    // select x label
    if (chosenXAxis === 'health') {
        var xLabel = "Health Score:";
    }
    else if (chosenXAxis === 'commute') {
        var xLabel = "Average Commute Time (min):";
    }
    else if (chosenXAxis === 'ownership') {
        var xLabel = "Home Ownership (%):";
    }
    else if (chosenXAxis === 'm_home') {
        var xLabel = "Median Home Price:";
    }
    else if (chosenXAxis === 'm_income') {
        var xLabel = "Median Income:";
    }
    else if (chosenXAxis === 'poverty') {
        var xLabel = "Poverty (%):";
    }
    else if (chosenXAxis === 'temp') {
        var xLabel = "Average Temperature (F):";
    }
    else {
        var xLabel = "Precipitation (Inches):";
    }

    // select y label
    if (chosenYAxis === 'm_in') {
        var yLabel = "Migration In:";
    }
    else {
        var yLabel = "Migration Out:";
    }

    // create tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0, -80])
        .html(function(d) {
            return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    // add events
    circlesGroup.on("mouseover", toolTip.show)
        .on("mouseout", toolTip.hide);

    return circlesGroup;
}

// retrieve csv data and execute
d3.csv("../static/data/data.csv").then(function(timesData) {

    console.log(timesData);

    // parse data
    timesData.forEach(function(data) {
        data.m_in = +data.m_in;
        data.m_out = +data.m_out;
        data.health = +data.health;
        data.commute = +data.commute;
        data.ownership = +data.ownership;
        data.m_home = +data.m_home;
        data.m_income = +data.m_income;
        data.poverty = +data.poverty;
        data.temp = +data.temp;
        data.precip = +data.precip;
    });

    // create first linear scales
    var xLinearScale = xScale(timesData, chosenXAxis);
    var yLinearScale = yScale(timesData, chosenYAxis);

    // create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(timesData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 12)
        .attr("opacity", ".6");

    // append initial text
    var textGroup = chartGroup.selectAll(".stateText")
        .data(timesData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d) { return d.abbr });

    // create group for 3 x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

    var healthLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "health")
        .text("Health Score");

    var commuteLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "commute")
        .text("Commute (min)");

    var ownershipLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "ownership")
        .text("Home Ownership (%)");

    var m_homeLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "m_home")
        .text("Median Home Price");
        
    var m_incomeLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 100)
        .attr("value", "m_income")
        .text("Median Income");

    var povertyLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 120)
        .attr("value", "poverty")
        .text("Poverty (%)");

    var tempLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 140)
        .attr("value", "temp")
        .text("Temperature (F)");

    var precipLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 160)
        .attr("value", "precip")
        .text("Precipitation (Inches)");

    // create group for 3 y-axis labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.right}, ${(height/2)})`);

    var m_inLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0 - 30)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "m_in")
        .text("Migration In");

    var m_outLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0 - 50)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .attr("value", "m_out")
        .text("Migration Out");

    // updateToolTip function with data
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");

            // check if value is same as current axis
            if (value != chosenXAxis) {

                // replace chosenXAxis with value
                chosenXAxis = value;

                // update x scale for new data
                xLinearScale = xScale(timesData, chosenXAxis);

                // update x axis with transition
                xAxis = renderAxesX(xLinearScale, xAxis);

                // update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // update text with new x values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // change classes to change bold text
                if (chosenXAxis === "health") {
                    healthLabel.classed("active", true).classed("inactive", false);
                    commuteLabel.classed("active", false).classed("inactive", true);
                    ownershipLabel.classed("active", false).classed("inactive", true);
                    m_homeLabel.classed("active", false).classed("inactive", true);
                    m_incomeLabel.classed("active", false).classed("inactive", true);
                    povertyLabel.classed("active", false).classed("inactive", true);
                    tempLabel.classed("active", false).classed("inactive", true);
                    precipLabel.classed("active", false).classed("inactive", true);
                } else if (chosenXAxis === "commute") {
                    healthLabel.classed("active", false).classed("inactive", true);
                    commuteLabel.classed("active", true).classed("inactive", false);
                    ownershipLabel.classed("active", false).classed("inactive", true);
                    m_homeLabel.classed("active", false).classed("inactive", true);
                    m_incomeLabel.classed("active", false).classed("inactive", true);
                    povertyLabel.classed("active", false).classed("inactive", true);
                    tempLabel.classed("active", false).classed("inactive", true);
                    precipLabel.classed("active", false).classed("inactive", true);
                } else if (chosenXAxis === "ownership") {
                    healthLabel.classed("active", false).classed("inactive", true);
                    commuteLabel.classed("active", false).classed("inactive", true);
                    ownershipLabel.classed("active", true).classed("inactive", false);
                    m_homeLabel.classed("active", false).classed("inactive", true);
                    m_incomeLabel.classed("active", false).classed("inactive", true);
                    povertyLabel.classed("active", false).classed("inactive", true);
                    tempLabel.classed("active", false).classed("inactive", true);
                    precipLabel.classed("active", false).classed("inactive", true);
                } else if (chosenXAxis === "m_home") {
                    healthLabel.classed("active", false).classed("inactive", true);
                    commuteLabel.classed("active", false).classed("inactive", true);
                    ownershipLabel.classed("active", false).classed("inactive", true);
                    m_homeLabel.classed("active", true).classed("inactive", false);
                    m_incomeLabel.classed("active", false).classed("inactive", true);
                    povertyLabel.classed("active", false).classed("inactive", true);
                    tempLabel.classed("active", false).classed("inactive", true);
                    precipLabel.classed("active", false).classed("inactive", true);
                } else if (chosenXAxis === "m_income") {
                    healthLabel.classed("active", false).classed("inactive", true);
                    commuteLabel.classed("active", false).classed("inactive", true);
                    ownershipLabel.classed("active", false).classed("inactive", true);
                    m_homeLabel.classed("active", false).classed("inactive", true);
                    m_incomeLabel.classed("active", true).classed("inactive", false);
                    povertyLabel.classed("active", false).classed("inactive", true);
                    tempLabel.classed("active", false).classed("inactive", true);
                    precipLabel.classed("active", false).classed("inactive", true);
                } else if (chosenXAxis === "poverty") {
                    healthLabel.classed("active", false).classed("inactive", true);
                    commuteLabel.classed("active", false).classed("inactive", true);
                    ownershipLabel.classed("active", false).classed("inactive", true);
                    m_homeLabel.classed("active", false).classed("inactive", true);
                    m_incomeLabel.classed("active", false).classed("inactive", true);
                    povertyLabel.classed("active", true).classed("inactive", false);
                    tempLabel.classed("active", false).classed("inactive", true);
                    precipLabel.classed("active", false).classed("inactive", true);
                } else if (chosenXAxis === "temp") {
                    healthLabel.classed("active", false).classed("inactive", true);
                    commuteLabel.classed("active", false).classed("inactive", true);
                    ownershipLabel.classed("active", false).classed("inactive", true);
                    m_homeLabel.classed("active", false).classed("inactive", true);
                    m_incomeLabel.classed("active", false).classed("inactive", true);
                    povertyLabel.classed("active", false).classed("inactive", true);
                    tempLabel.classed("active", true).classed("inactive", false);
                    precipLabel.classed("active", false).classed("inactive", true);
                } else {
                    healthLabel.classed("active", false).classed("inactive", true);
                    commuteLabel.classed("active", false).classed("inactive", true);
                    ownershipLabel.classed("active", false).classed("inactive", true);
                    m_homeLabel.classed("active", false).classed("inactive", true);
                    m_incomeLabel.classed("active", false).classed("inactive", true);
                    povertyLabel.classed("active", false).classed("inactive", true);
                    tempLabel.classed("active", false).classed("inactive", true);
                    precipLabel.classed("active", true).classed("inactive", false);
                }
            }
        });

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");

            // check if value is same as current axis
            if (value != chosenYAxis) {

                // replace chosenYAxis with value
                chosenYAxis = value;

                // update y scale for new data
                yLinearScale = yScale(timesData, chosenYAxis);

                // update x axis with transition
                yAxis = renderAxesY(yLinearScale, yAxis);

                // update circles with new y values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // update text with new y values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

                // update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // change classes to change bold text
                if (chosenYAxis === "m_in") {
                    m_inLabel.classed("active", true).classed("inactive", false);
                    m_outLabel.classed("active", false).classed("inactive", true);
                } else {
                    m_inLabel.classed("active", false).classed("inactive", true);
                    m_outLabel.classed("active", true).classed("inactive", false);
                }   
            }
        });




});