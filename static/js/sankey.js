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
format = {
    const format = d3.format(",.0f");
    return Data.units ? d => `${format(d)} ${data.units}` : format;
  }

sankey = {
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
}

var svg = d3.select("key")
.attr("viewBox", [0, 0, width, height]);


chart = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

       const {nodes, links} = sankey(Data);
      
        svg.append("g")
            .attr("stroke", "#000")
          .selectAll("rect")
          .data(nodes)
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
          .data(links)
          .join("g")
            .style("mix-blend-mode", "multiply");
      
        if (edgeColor === "path") {
          const gradient = link.append("linearGradient")
              .attr("id", d => (d.uid = DOM.uid("link")).id)
              .attr("gradientUnits", "userSpaceOnUse")
              .attr("x1", d => d.source.x1)
              .attr("x2", d => d.destination.x0);
      
          gradient.append("stop")
              .attr("offset", "0%")
              .attr("stop-color", d => color(d.source));
      
          gradient.append("stop")
              .attr("offset", "100%")
              .attr("stop-color", d => color(d.destination));
        }
      
        link.append("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke", d => edgeColor === "none" ? "#aaa"
                : edgeColor === "path" ? d.uid 
                : edgeColor === "input" ? color(d.source) 
                : color(d.destination))
            .attr("stroke-width", d => Math.max(1, d.width));
      
        link.append("title")
            .text(d => `${d.source.name} → ${d.destination.name}\n${format(d.value)}`);
      
        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
          .selectAll("text")
          .data(nodes)
          .join("text")
            .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
            .text(d => d.name);
      
        return svg.node();
      }
}





    

    