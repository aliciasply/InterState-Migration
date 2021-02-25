var svgWidth = 1000;
var svgHeight = 600;

const linklist = []
const nodelist = []
const Data = {
    nodes:  nodelist,
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

var svg = d3.select("key")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


var chart = svg.append("g")
.attr("viewBox", [0, 0, width, height]);
var nodelist2 = [];
d3.csv("../static/data/sankey.csv").then(function(migrantData) {
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

    