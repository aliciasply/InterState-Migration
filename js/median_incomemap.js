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
migCsv = "../Data/Justin/in_top5.csv"



// Example: An array containing each city's name, location, and population
var cities = [{
  location: [40.7128, -74.0059],
  name: "New York",
  population: "8,550,405",
  image: "https://regenaxe.files.wordpress.com/2019/02/lower-manhattan-skyline.jpg"
},
{
  location: [41.8781, -87.6298],
  name: "Chicago",
  population: "2,720,546",
  image: "https://hotelemc2.com/wp-content/uploads/2018/02/Why-Chicago-is-the-Best-City-in-the-World.png"
}];

/////////// Ex from k
/*
//// Boundary////
// d3.json(url_1).then(data => {
  
//   d3.json(states_url).then(states_data =>{
//     states_data.forEach(d => {
//       d.extra = data.features.map(x => x.name=d.name)
//     });

//   });

// });
*/
/////////// Ex from k

///////// Test for matching ex from k
d3.csv(stateBoundaries, function(boundaries) {
  var stateFeature = boundaries.features
  console.log(stateFeature)
  //// CSV dataset////
  d3.csv(migCsv, function(migData) {
    // Iterate through boundary data
    console.log(migData)
//     filteredStates = ["Florida", "Texas", "California", "North Carolina", "Arizona"]
//     for (i = 0; i < filteredStates.length; i++) {
//       var coordinates = stateFeature.geometry.coordinates
//       var stateName = stateFeature.properties.name
//       filteredStates(element => 
//       var extra = stateFeature.filter(d => d.properties.name===element)
//       console.log(extra)



//     })

//     // boundaries.features.forEach(d => {
//     //   var extra = boundaries.features.properties.map(x => x.name=d.name)
//     //   console.log(d)
//     })
    
      
//   // }).addTo(myMap)
//       // Store as list of dictionaries, then .forEach add to map
//       // var stateName = boundaries.features.properties.stateName
//       // var bBox = boundaries.features
// });
///////// Test for matching ex from k







//////////////////// KEEP: Shows pins on map
//// Boundary////
/*
d3.json(stateBoundaries, function(boundaries) {

  //// CSV dataset////
  d3.csv(migCsv, function(migData) {
    console.log(migData)
    // Iterate through boundary data
    cities.forEach(d => {
      var thisMarker = L.marker(d.location, {
        title: "This is " + d.name
      }).addTo(myMap)
      // Store as list of dictionaries, then .forEach add to map
      // var stateName = boundaries.features.properties.stateName
      // var bBox = boundaries.features
    })
  })
})
*/
//////////////////// Shows pins on map


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