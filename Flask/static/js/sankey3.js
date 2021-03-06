var svgWidth = 1000;
var svgHeight = 600;

// d3 = require("d3@6", "d3-sankey@0.12")

const linklist = []
const nodelist = []
const nodelist2 = [];
const Data = {
    nodes:  nodelist2,
    links: linklist,
    units: "persons (estimated)",
}

d3.csv("static/data/sankey.csv").then(function(migrantData) {
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

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

const color = (()=>{
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  return d => color(d.category === undefined ? d.name : d.category);
})();

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
const align = "justify";

var svg = d3.select("key")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


var chart = svg.append("g")
.attr("viewBox", [0, 0, width, height])

// const {nodes, links} = sankey(Data)
    .attr("stroke", "#000")
    .selectAll("rect")
    .data(Data.nodes)
    .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", color)
    .append("title")
      .text(d => `${d.name}\n${format(d.value)}`);

    const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(Data.links)
    .join("g")
      .style("mix-blend-mode", "multiply");

      const gradient = link.append("linearGradient")
        .attr("id", d => (d.uid = DOM.uid("link")).id)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0);

        link.append("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => edgeColor === "none" ? "#aaa"
          : edgeColor === "path" ? d.uid 
          : edgeColor === "input" ? color(d.source) 
          : color(d.destination))
      .attr("stroke-width", d => Math.max(1, d.width));

      link.append("title")
      .text(d => `${d.source.name} → ${d.destination}\n${format(d.value)}`);
      svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("text")
    .data(Data.nodes)
    .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name);

  // return svg.node();

  // d3 = require("d3@6", "d3-sankey@0.12")
  sankey = (() => {
    const sankey = d3.sankey()
        .nodeId(d => d.name)
        .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [width - 1, height - 5]]);
    return ({nodes, links}) => sankey({
      nodes: nodes.map(d => Object.assign({}, d)),
      links: links.map(d => Object.assign({}, d))
    });
  })();
  



  // var sankey = d3.sankey()
  //  .update(Data)
  // .nodes([Data])
  // .links([Data.links])
  // .nodeId(d=> d.name)
  // .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
  // .nodeWidth(15)
  // .nodePadding(10)
  // .extent([[1, 5], [width - 1, height - 5]]);

  
  // color = {
  //   color = d3.scaleOrdinal(d3.schemeCategory10);
  //   return d => color(d.category === undefined ? d.name : d.category);
  // }

  // format = {
  //   const format = d3.format(",.0f");
  //   return Data.units ? d => `${format(d)} ${Data.units}` : format;
  // }






    

    