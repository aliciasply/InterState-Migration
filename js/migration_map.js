// Layers to apply to map
var layers = {
  inbound: new L.LayerGroup(),
  outbound: new L.LayerGroup()
};

// Create initial map object
var myMap = L.map("migrationmapid", {
    center: [38.5003668,-99.5509956],
    zoom: 5,
    layers: [
      layers.inbound,
      layers.outbound,
    ]
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

// Style object for migration in
var mapStyleIn = {
  color: "black",
  fillColor: "blue",
  fillOpacity: 0.5,
  weight: 1.5
};

// Style object for migration out
var mapStyleOut = {
  color: "black",
  fillColor: "red",
  fillOpacity: 0.5,
  weight: 1.5
};



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
migCsv = "../Data/Justin/top5_in_out.csv"



var overlays = {
  "Inbound Migration": layers.inbound,
  "Outbound Migration": layers.outbound,
}
L.control.layers(null, overlays).addTo(myMap)


/////////// Ex from k

///////// Test for matching ex from k
d3.json(stateBoundaries, function(boundaries) {
  console.log(boundaries)
  var stateFeature = boundaries.features
  // console.log(stateFeature)
  //// CSV dataset////
  d3.csv(migCsv, function(migData) {
    // Iterate through boundary data
    console.log(migData)
    top5In = migData.filter(m => m.indicator==="in")
    top5Out = migData.filter(m => m.indicator==="out")
    console.log(top5In)
    console.log(top5Out)
    top5In.forEach(element => {
      
      var filteredStates = stateFeature.filter(d => d.properties["NAME"]===element.state)
      console.log(filteredStates)
      filteredStates[0]['properties']['MigrantCount'] = element.migrants
       
      L.geoJSON(filteredStates, {
        style: mapStyleIn,
        onEachFeature: function(feature, layer, element) {
          layer.bindPopup("<b>State:</b> " + feature.properties['NAME'] + "<br><b># of Inbound:</b> " + feature.properties.MigrantCount)}
           

      }).addTo(layers["inbound"]);})
    top5Out.forEach(element => {
        var filteredStates = stateFeature.filter(d => d.properties["NAME"]===element.state)
        console.log(filteredStates)
        L.geoJSON(filteredStates, {
          style: mapStyleOut,
          onEachFeature: function(feature, layer, element) {
            layer.bindPopup("<b>State:</b> " + feature.properties['NAME'] + "<br><b># of Outbound:</b> " + feature.properties.MigrantCount)}
        }).addTo(layers['outbound']);
    })
  


    
    // boundaries.features.forEach(d => {
    //   var extra = boundaries.features.properties.map(x => x.name=d.name)
    //   console.log(d)
    })
    
      
  // }).addTo(myMap)
      // Store as list of dictionaries, then .forEach add to map
      // var stateName = boundaries.features.properties.stateName
      // var bBox = boundaries.features
});
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


// L.geoJson(data, {style: style}).addTo(map);


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