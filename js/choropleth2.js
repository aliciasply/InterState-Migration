// Load in my states data!
Plotly.d3.csv("/Data/Alicia/avg_income_df.csv", function(err, data) {
  console.log(data)
  function unpack (data,key){
  return data.map(function(row){return row[key];});
  }
	var dataArray = [{
    type:"choropleth",
    locationmode:"USA-states", 
    locations:unpack(data, "State"),
    z:unpack(data, "Average_Income"),
    text:unpack(data, "State"),
    zmin:39000,
    zmax:73000,
    colorscale: [
      [0,"rgb(242, 240, 247)"],[0.2,"rgb(218, 218, 235)"],
      [0.4,"rgb(188, 189, 220)"],[0.6,"rgb(158, 154, 200)"],
      [0.8,"rgb(117, 107, 177)"],[1.0,"rgb(84, 39, 143)"]
      // [0,"rgb(242, 240, 247)"],[0,"rgb(242, 240, 247)"],
    ],
    colorbar: {
      title:"State", thickness:3.0,
      
    },
    marker: {
      line:{color:"rgb(255,255,255)", width:7}
    }

  }];
  var layout = {title: "State", 
  geo:{scope:"usa",
  showlakes: true, 
  lakecolor: "rgb(255, 255, 255)"
},
  margin:{l:0, r:0, b:0, t:0, pad:2},
  legend:{x:0.1, y:0, yanchor:"top", xanchor:"right", showactive:false, direction:"left",
  type:"buttons", pad:{"t":87, "r":10},
},
  width:1000, height:800,
};
  Plotly.plot(map, dataArray, layout, {showlink:false});
});


  