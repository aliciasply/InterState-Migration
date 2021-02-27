var svgWidth = 1000;
var svgHeight = 600;

var units = "migrants";


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

var svg = d3.select("key").append("svg")
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

        graph.links.forEach(function (d, i) {
            graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
            graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
          });
          graph.nodes.forEach(function (d, i) {
            graph.nodes[i] = { "name": d };
          });

          sankey
          .nodes(graph.nodes)
          .links(graph.links)
          .layout(32);

          var link = svg.append("g").selectAll(".link")
      .data(graph.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

      link.append("title")
      .text(function(d) {
          return d.source.name + " → " + 
              d.target.name + "\n" + format(d.value); });

              var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
		  return "translate(" + d.x + "," + d.y + ")"; })
      .call(d3.drag()
        .subject(function(d) {
          return d;
        })
        .on("start", function() {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));

        node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) { 
            return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function(d) { 
            return d3.rgb(d.color).darker(2); })
      .append("title")
        .text(function(d) { 
            return d.name + "\n" + format(d.value); });

        node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

        function dragmove(d) {
            d3.select(this)
              .attr("transform", 
                    "translate(" 
                       + d.x + "," 
                       + (d.y = Math.max(
                          0, Math.min(height - d.dy, d3.event.y))
                         ) + ")");
            sankey.relayout();
            link.attr("d", path);
          }});
        

// js code


    

    