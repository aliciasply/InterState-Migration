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



///////// Test for matching ex from k
d3.json(stateBoundaries, function(response) {
    console.log(response)
    L.geoJSON(response, {
        
        // Function to click each feature for more pop up information
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<b>Place:</b> " + feature.properties.name + "<br><b>Magnitude:</b> " + feature.properties.mag +
             "<br><b>Depth:</b> " + feature.geometry.coordinates[2]);
          },

    // Add entire geoJSON layer to map
    }).addTo(myMap);
});