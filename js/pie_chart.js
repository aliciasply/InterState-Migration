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
  

// Data sources
stateBoundaries = "https://raw.githubusercontent.com/loganpowell/census-geojson/master/GeoJSON/5m/2019/state.json";
migCsv = "../Data/Justin/top5_in_out.csv"
  

var overlays = {
    "Inbound Migration": layers.inbound,
    "Outbound Migration": layers.outbound,
}
L.control.layers(null, overlays).addTo(myMap)
  
  
// D3 to load JSON of state boundaries
d3.json(stateBoundaries, function(boundaries) {
    console.log(boundaries)
    var stateFeature = boundaries.features

    // D3 load migration data from CSV
    d3.csv(migCsv, function(migData) {
      console.log(migData)

      // Store variables for migration in and out of state
      var top5In = migData.filter(m => m.indicator==="in")
      var top5Out = migData.filter(m => m.indicator==="out")
      console.log(top5In)
      console.log(top5Out)

      top5In.forEach(element => {
        // Filter json data by comparing to CSV then store as variable
        var filteredStates = stateFeature.filter(d => d.properties["NAME"]===element.state)
        console.log(filteredStates)

        // Add migrants to JSON
        filteredStates[0]['properties']['MigrantCountIn'] = element.migrants
        // Add generations to JSON
        filteredStates[0]['properties']['MillenialsCountIn'] = element.millenials
        filteredStates[0]['properties']['GenXCountIn'] = element.genx
        filteredStates[0]['properties']['BoomersCountIn'] = element.boomers


        L.geoJSON(filteredStates, {
          style: mapStyleIn,
          onEachFeature: function(feature, layer, element) {
            layer.bindPopup("<b>State:</b> " + feature.properties['NAME'] + "<br><b># of Inbound:</b> " + feature.properties.MigrantCountIn)}
             
        // Add geoJSON to inbound layer
        }).addTo(layers["inbound"])

        L.piechartMarker(
            L.latLng([37.683, -122.4536]),
            {
                radius: 50,
                data: [
                    { name: 'Millenials (25-40yo)', value: feature.properties.MillenialsCountIn },
                    { name: 'Gen X (41-56)', value: feature.properties.GenXCountIn },
                    { name: 'Baby Boomers (57-75)', value: feature.properties.BoomersCountIn }
                ]
            }).addTo(layers["inbound"]);

        
    
    
    
    })

      top5Out.forEach(element => {
        // Filter json data by comparing to CSV then store as variable
        var filteredStates = stateFeature.filter(d => d.properties["NAME"]===element.state)
        console.log(filteredStates)

        // Add migrants to JSON
        filteredStates[0]['properties']['MigrantCountOut'] = element.migrants

        L.geoJSON(filteredStates, {
            style: mapStyleOut,
            onEachFeature: function(feature, layer, element) {
              layer.bindPopup("<b>State:</b> " + feature.properties['NAME'] + "<br><b># of Outbound:</b> " + feature.properties.MigrantCountOut)}
        // Add geoJSON to outbound layer
          }).addTo(layers['outbound']);
      })
    })
  });
  