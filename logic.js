// Store our API endpoint inside queryUrl
var queryUrl =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(mag) {
  return mag
  // / 40;
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3>" + "<h4>Magnitude: " + feature.properties.mag + "</h4><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng){
      return new L.circle(latlng,
      {radius: getRadius(feature.properties.mag),
      fillColor: getColor(feature.properties.mag),
      fillOpacity: .6,
      color: "#000",
      stroke: true,
      weight: .8
      })
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYWdhcndhbjEiLCJhIjoiY2podjQ5Z213MHZrNDN2c2QzNnA2ZDEzeCJ9.iTgdJALv-yO5PITR1hCBsw");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYWdhcndhbjEiLCJhIjoiY2podjQ5Z213MHZrNDN2c2QzNnA2ZDEzeCJ9.iTgdJALv-yO5PITR1hCBsw");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });


  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
//}

  // Setting up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend"),
       grades = [0, 1, 2, 3, 4, 5],
       labels = [];

        div.innerHTML += '<p><u>Magnitude</u></p>'

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}
  return div;
  };

    // Adding legend to the map
    legend.addTo(myMap);
}   //end of CreateMap function.


function getRadius(value){
  return value*50000
}

//getColor uses a conditional statement to determine what the hex code will be for a magnitude. 
function getColor(d) {
return d > 5  ? '#F06B6B' : //#E31A1C
       d > 4  ? '#F0A76B' :  //#FC4E2A
       d > 3  ? '#F3BA4D':  //'#FD8D3C'
       d > 2  ? '#F3DB4D':     //'#FEB24C
       d > 1  ? '#E1F34D':  //'#FED976'
                  '#B7F34D';   //'#FFEDA0'
}






