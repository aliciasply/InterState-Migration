// Layers to apply to map
var layers = {
    inbound: new L.LayerGroup(),
    outbound: new L.LayerGroup(),
    piechartin: new L.LayerGroup(),
    piechartout: new L.LayerGroup()
};
  
// Create initial map object
var myMap = L.map("migrationmapid", {
      center: [38.5003668,-99.5509956],
      zoom: 4.5,
      layers: [
        layers.inbound
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
migCsv = "../Data/Justin/top10_in_out.csv"

// var baseMaps = {
//   "Inbound": grayscale,
//   "Outbound": streets
// };

var overlays = {
    "Inbound Migration": layers.inbound,
    "Inbound by Generation": layers.piechartin,
    "Outbound Migration": layers.outbound,
    "Outbound by Generation": layers.piechartout,
    
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
        // console.log(filteredStates)

        // Migrants JSON
        filteredStates[0]['properties']['MigrantCountIn'] = element.migrants
        filteredMigrants = filteredStates[0]['properties']['MigrantCountIn']
        
        // Generations JSON
        filteredStates[0]['properties']['MillenialsCountIn'] = element.millenials
        filteredMillenials = filteredStates[0]['properties']['MillenialsCountIn']

        filteredStates[0]['properties']['GenXCountIn'] = element.genx
        filteredGenX = filteredStates[0]['properties']['GenXCountIn']

        filteredStates[0]['properties']['BoomersCountIn'] = element.boomers
        filteredBoomers = filteredStates[0]['properties']['BoomersCountIn']

        // LatLng JSON
        filteredStates[0]['properties']['Lat'] = element.lat
        filteredStates[0]['properties']['Lng'] = element.lng
        filteredLat = filteredStates[0]['properties']['Lat']
        filteredLng = filteredStates[0]['properties']['Lng']
        console.log(filteredStates)

        stateName = filteredStates[0]['properties']['NAME']
        console.log(stateName)

        L.geoJSON(filteredStates, {
          style: mapStyleIn,
          onEachFeature: function(feature, layer, element) {
            layer.bindPopup("<b>State:</b> " + feature.properties['NAME'] 
            + "<br><b>Total Migrants In:</b> " + filteredMigrants 
            + "<br><b>Millenials:</b> " + filteredMillenials 
            + "<br><b>Gen X:</b> " + filteredGenX
            + "<br><b>Baby Boomers:</b> " + filteredBoomers)}
             
        // Add geoJSON to inbound layer
        }).addTo(layers["inbound"])
        
        // Pie chart
        // Assign global variables and assign it to be passed into piechartMarker
        L.piechartMarker(
          L.latLng([filteredLat, filteredLng]),
          {
              radius: 30,
              data: [
                  { name: 'Millenials (25-40yo)', value: element.millenials, },
                  { name: 'Gen X (41-56)', value: element.genx },
                  { name: 'Baby Boomers (57-75)', value: element.boomers }
              ]
          }).bindPopup("<b>Total Migrants in:</b> " + filteredMigrants
           + "<br><b>Millenials:</b> " + Math.round((filteredMillenials/filteredMigrants)*100) + "%" 
            + "<br><b>Gen X:</b> " + Math.round((filteredGenX/filteredMigrants)*100) + "%"
            + "<br><b>Baby Boomers:</b> " + Math.round((filteredBoomers/filteredMigrants)*100) + "%"
          ).addTo(layers["piechartin"]);


        ////////// THIS WORKS ////////////////////////
        // Pie chart
        // Assign global variables and assign it to be passed into piechartMarker

        // L.piechartMarker(
        //     L.latLng(filteredLat, filteredLng),
        //     {
        //         radius: 50,
        //         data: [
        //             { name: 'Millenials (25-40yo)', value: filteredMillenials },
        //             { name: 'Gen X (41-56)', value: filteredGenX },
        //             { name: 'Baby Boomers (57-75)', value: filteredBoomers }
        //         ]
        //     }).bindPopup(("<b>State:</b> " + feature.properties['NAME'] 
        //     + "<br><b>Total Migrants In:</b> " + feature.properties.MigrantCountIn 
        //     + "<br><b>Millenials:</b> " + Math.round((filteredMillenials/feature.properties.MigrantCountIn)*100) + "%" 
        //     + "<br><b>Gen X:</b> " + Math.round((feature.properties.GenXCountIn/feature.properties.MigrantCountIn)*100) + "%"
        //     + "<br><b>Baby Boomers:</b> " + Math.round((feature.properties.BoomersCountIn/feature.properties.MigrantCountIn)*100) + "%")

        //     );
        // Test
        function logsomestuff(num){
          return console.log(num)
        }

       ////////// THIS WORKS ////////////////////////
        
    
    })

      top5Out.forEach(element => {
        // Filter json data by comparing to CSV then store as variable
        var filteredStates = stateFeature.filter(d => d.properties["NAME"]===element.state)
        console.log(filteredStates)

        // Add migrants to JSON
        filteredStates[0]['properties']['MigrantCountOut'] = element.migrants
        // Add generations to JSON
        filteredStates[0]['properties']['MillenialsCountOut'] = element.millenials
        filteredStates[0]['properties']['GenXCountOut'] = element.genx
        filteredStates[0]['properties']['BoomersCountOut'] = element.boomers
        

        L.geoJSON(filteredStates, {
            style: mapStyleOut,
            onEachFeature: function(feature, layer, element) {
              layer.bindPopup("<b>State:</b> " + feature.properties['NAME'] 
              + "<br><b>Total Migrants Out:</b> " + feature.properties.MigrantCountOut 
              + "<br><b>Millenials:</b> " + Math.round((feature.properties.MillenialsCountOut/feature.properties.MigrantCountOut)*100) + "%" 
              + "<br><b>Gen X:</b> " + Math.round((feature.properties.GenXCountOut/feature.properties.MigrantCountOut)*100) + "%"
              + "<br><b>Baby Boomers:</b> " + Math.round((feature.properties.BoomersCountOut/feature.properties.MigrantCountOut)*100) + "%")}
               
          // Add geoJSON to inbound layer
          }).addTo(layers["outbound"])
      })
    })
  });
  