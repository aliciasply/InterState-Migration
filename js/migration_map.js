// Create our initial map object
var myMap = L.map("migrationmapid", {
    center: [38.5003668,-99.5509956],
    zoom: 5
  });


// Add a tile layer to map (background map image)
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/light-v9',
    accessToken: API_KEY
}).addTo(myMap);


// Map legend
var legend = L.control({ position: "bottomright"});
legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Magnitude</h4>"
    div.innerHTML += '<i style="background: #00ff00"></i><span>-10-10</span><br>';
    div.innerHTML += '<i style="background: #ccff66"></i><span>10-30</span><br>';
    div.innerHTML += '<i style="background: #ffcc66"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: #ffcc00"></i><span>50-70</span><br>';
    div.innerHTML += '<i style="background: #ff9900"></i><span>70-90</span><br>';
    div.innerHTML += '<i style="background: #ff3300"></i><span>90+</span><br>';

    return div;
};
legend.addTo(myMap)

///////////////////////////////////////////////////////////////////
// Keep Keep Keep
// Need to get state boundaries. Read from JSON (GeoJSON better),
// then combine into one interactive visualization.
// Load dataset first, then load boundary data
/*
d3.json(url_1).then(data => {
  d3.json(states_url).then(states_data =>{
    states_data.forEach(d => {
      d.extra = data.features.map(x => x.name=d.name)
    });

  });

});
*/
///////////////////////////////////////////////////////////////////

stateBoundaries = "https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/5m/2019/state.json";
migData = "../Data/Justin/in_sorted.csv"

//Test
// Load dataset first, then load boundary data
d3.json(stateBoundaries, function(boundaries) {
  console.log(boundaries)
  d3.csv(migData, function(states) {
    console.log(states)
  })
})



// Function for returning colors
function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
};

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// L.geoJson(data, {style: style}).addTo(map);


// Our style object
var mapStyle = {
    color: "white",
    fillColor: "pink",
    fillOpacity: 0.5,
    weight: 1.5
  };


////////////////////////////////////////////////////
/*/* D3 using geoJson layer /*/
// d3.json(link, function(data) {
//     // Creating a geoJSON layer with the retrieved data
//     L.geoJson(data, {
//       // Passing in our style object
//       style: mapStyle
//     }).addTo(myMap);
//   });
/////////////////////////////////////////////////////





// Url for analysis
////////////////////////////////////////
// https://eric.clst.org/tech/usgeojson/
// const link = "state_boundaries.json"
////////////////////////////////////////