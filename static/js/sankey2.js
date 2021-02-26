var svgWidth = 1000;
var svgHeight = 600;

const linklist = []
const nodelist = []
const nodelist2 = [];
const Data = {
    nodes:  nodelist2,
    links: linklist,
    units: "persons (estimated)",
}

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"), 
format = function(d) { return formatNumber(d) + " " + units; },
color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

var path = sankey.link();
d3.csv("static/data/sankey.csv").then(function(d) {
    graph = {"nodes" : [], "links" : []};

    data.forEach(function (d) {
      graph.nodes.push({ "name": d.Origin });
      graph.links.push({ "source": d.Origin,
                         "target": d.To_State,
                         "value": +d.Total });
    });
       graph.nodes = d3.keys(d3.nest()
        .key(function (d) { return d.name; })
        .object(graph.nodes));


var svg = d3.select("key")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


var chart = svg.append("g")
.attr("viewBox", [0, 0, width, height]);


    console.log (migrantData)
    allnodes = []
    migrantData.forEach(function(data) {
        data.Total = +data.Total;
     var link = {
       Source: data.Origin,
       Destination: data.To_State,
       Value: data.Total,
     }
    linklist.push(link)

    var node = {
        name: data.Origin}
    if (!nodelist.includes(node.name)){ nodelist.push(node.name);}
  
  })
    nodelist.forEach(x => {
      nodelist2.push({"name":x})})
    console.log(Data)})



    

    