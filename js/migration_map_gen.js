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
migCsv = "Data/Justin/top10_in_out.csv"

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
      var top10In = migData.filter(m => m.indicator==="in")
      var top10Out = migData.filter(m => m.indicator==="out")
      console.log(top10In)
      console.log(top10Out)

      top10In.forEach(element => {
        // Filter json data by comparing to CSV then store as variable
        var filteredStates = stateFeature.filter(d => d.properties["NAME"]===element.state)
        // console.log(filteredStates)

        // Migrants JSON
        filteredStates[0]['properties']['MigrantCountIn'] = element.migrants
        filteredMigrants = parseInt(filteredStates[0]['properties']['MigrantCountIn'])
        
        // Generations JSON
        filteredStates[0]['properties']['MillennialsCountIn'] = element.millennials
        filteredMillennials = parseInt(filteredStates[0]['properties']['MillennialsCountIn'])

        filteredStates[0]['properties']['GenXCountIn'] = element.genx
        filteredGenX = parseInt(filteredStates[0]['properties']['GenXCountIn'])

        filteredStates[0]['properties']['BoomersCountIn'] = element.boomers
        filteredBoomers = parseInt(filteredStates[0]['properties']['BoomersCountIn'])

        // LatLng JSON
        filteredStates[0]['properties']['Lat'] = element.lat
        filteredStates[0]['properties']['Lng'] = element.lng
        filteredLat = filteredStates[0]['properties']['Lat']
        filteredLng = filteredStates[0]['properties']['Lng']
        // console.log(filteredStates)

        stateName = filteredStates[0]['properties']['NAME']
        

        // Outline filtered states
        L.geoJSON(filteredStates, {
          style: mapStyleIn,
          onEachFeature: function(feature, layer, element) {
            layer.bindPopup("<b>State:</b> " + feature.properties['NAME'] 
            + "<br><br><b>Inbound migrant total:</b> " + filteredMigrants.toLocaleString() 
            + "<br><b>Millennials:</b> " + filteredMillennials.toLocaleString() 
            + "<br><b>Gen X:</b> " + filteredGenX.toLocaleString()
            + "<br><b>Baby Boomers:</b> " + filteredBoomers.toLocaleString())}
             
        // Add geoJSON to inbound layer
        }).addTo(layers["inbound"])
        
        // Pie chart
        L.piechartMarker(
          L.latLng([filteredLat, filteredLng]),
          {
              radius: 30,
              data: [
                { name: 'Millennials (25-40yo)', value: element.millennials, style: millPie},
                { name: 'Gen X (41-56)', value: element.genx, style: genxPie },
                { name: 'Baby Boomers (57-75)', value: element.boomers, style: boomPie }
            ]
          }).bindPopup("<b>State: </b>" + stateName +
          "<br><br><b>Inbound migrant total:</b> " + filteredMigrants.toLocaleString()
         + "<br><b>Millennials:</b> " + Math.round((filteredMillennials/filteredMigrants)*100) + "%" 
          + "<br><b>Gen X:</b> " + Math.round((filteredGenX/filteredMigrants)*100) + "%"
          + "<br><b>Baby Boomers:</b> " + Math.round((filteredBoomers/filteredMigrants)*100) + "%"
        ).addTo(layers["piechartin"]);

    
    })

      top10Out.forEach(element => {
        // Filter json data by comparing to CSV then store as variable
        var filteredStates = stateFeature.filter(d => d.properties["NAME"]===element.state)
        // console.log(filteredStates)

        // Migrants JSON 
        filteredStates[0]['properties']['MigrantCountOut'] = element.migrants
        filteredMigrants = parseInt(filteredStates[0]['properties']['MigrantCountOut'])
        // console.log(filteredMigrants)
        
        // Generations JSON
        filteredStates[0]['properties']['MillennialsCountOut'] = element.millennials
        filteredMillennials = parseInt(filteredStates[0]['properties']['MillennialsCountOut'])

        filteredStates[0]['properties']['GenXCountOut'] = element.genx
        filteredGenX = parseInt(filteredStates[0]['properties']['GenXCountOut'])

        filteredStates[0]['properties']['BoomersCountOut'] = element.boomers
        filteredBoomers = parseInt(filteredStates[0]['properties']['BoomersCountOut'])

        // LatLng JSON
        filteredStates[0]['properties']['Lat'] = element.lat
        filteredStates[0]['properties']['Lng'] = element.lng
        filteredLat = filteredStates[0]['properties']['Lat']
        filteredLng = filteredStates[0]['properties']['Lng']
        // console.log(filteredStates)

        stateName = filteredStates[0]['properties']['NAME']
        
        // Outline filtered states
        L.geoJSON(filteredStates, {
            style: mapStyleOut,
            onEachFeature: function(feature, layer, element) {
              layer.bindPopup("<b>State:</b> " + feature.properties['NAME'] 
              + "<br><br><b>Outbound migrant total:</b> " + filteredMigrants.toLocaleString() 
              + "<br><b>Millennials:</b> " + filteredMillennials.toLocaleString() 
              + "<br><b>Gen X:</b> " + filteredGenX.toLocaleString()
              + "<br><b>Baby Boomers:</b> " + filteredBoomers.toLocaleString())}
               
          // Add geoJSON to inbound layer
          }).addTo(layers["outbound"])

        // Pie chart
        L.piechartMarker(
            L.latLng([filteredLat, filteredLng]),
            {
                radius: 30,
                data: [
                    { name: 'Millennials (25-40yo)', value: element.millennials, style: millPie},
                    { name: 'Gen X (41-56)', value: element.genx, style: genxPie },
                    { name: 'Baby Boomers (57-75)', value: element.boomers, style: boomPie }
                ]
            }).bindPopup("<b>State: </b>" + stateName +
              "<br><br><b>Outbound migrant total:</b> " + filteredMigrants.toLocaleString()
             + "<br><b>Millennials:</b> " + Math.round((filteredMillennials/filteredMigrants)*100) + "%" 
              + "<br><b>Gen X:</b> " + Math.round((filteredGenX/filteredMigrants)*100) + "%"
              + "<br><b>Baby Boomers:</b> " + Math.round((filteredBoomers/filteredMigrants)*100) + "%"
            ).addTo(layers["piechartout"]);
  
      })
    })
  });

// Pie chart colors
millPie = { fillStyle: '#65e6ae', strokeStyle: '#65e6ae', lineWidth: 2 }
genxPie = { fillStyle: 'rgb(210, 93, 176)', strokeStyle: 'rgb(210, 93, 176)', lineWidth: 2 }
boomPie = { fillStyle: 'rgb(255, 127, 23)', strokeStyle: 'rgb(255, 127, 23)', lineWidth: 2 } 

