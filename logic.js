// Store our API endpoint inside queryUrl
var queryUrl =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var tectPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  var quakeFeatures = data.features
  //createFeatures(data.features);

  // Create a GeoJSON layer containing the features array on the earthquakeData object
      // Run the onEachFeature function once for each piece of data in the array
      var earthquakes = L.geoJSON(quakeFeatures, {
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

    // Define a function we want to run once for each feature in the features array
      // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3>" + "<h4>Magnitude: " + feature.properties.mag + "</h4><hr><p>" + new Date(feature.properties.time) + "</p>");
      }

   // Add fault lines to map
    d3.json(tectPlatesUrl, function(tectPlateData){
      console.log(faultFeatures)
      var faultFeatures = data.features

        // create a layer group for faultlines
        var tectonicPlates = new L.LayerGroup();

        var faultlines = L.geoJson(faultFeatures,{
          color: "blue",
          fillOpacity: 0,
          weight: 1
        }).addTo(tectonicPlates);
    
          // Sending our earthquakes layer to the createMap function
        createMap(earthquakes, faultlines);
}); //end of D3


}) //end of quakes D3

 
// Define a markerSize function that will give each city a different radius based on its population
function markerSize(mag) {
  return mag
  // / 40;
}

//delete the below createfeatures
// function createFeatures(quakeFeatures,faultFeatures) {
// } //end of createFeatures

function createMap(earthquakes,tectonicPlates) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYWdhcndhbjEiLCJhIjoiY2podjQ5Z213MHZrNDN2c2QzNnA2ZDEzeCJ9.iTgdJALv-yO5PITR1hCBsw");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYWdhcndhbjEiLCJhIjoiY2podjQ5Z213MHZrNDN2c2QzNnA2ZDEzeCJ9.iTgdJALv-yO5PITR1hCBsw");

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?"+
  "access_token=pk.eyJ1IjoiYWdhcndhbjEiLCJhIjoiY2podjQ5Z213MHZrNDN2c2QzNnA2ZDEzeCJ9.iTgdJALv-yO5PITR1hCBsw");

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiYWdhcndhbjEiLCJhIjoiY2podjQ5Z213MHZrNDN2c2QzNnA2ZDEzeCJ9.iTgdJALv-yO5PITR1hCBsw");

  

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Outdoors": streetmap,
    "Dark Map": darkmap,
    "Satellite": satellitemap,
    "Grayscale": lightmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Fault Lines": tectonicPlates
    //faultLayer
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes, satellitemap, lightmap, darkmap]
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

//getColor uses a conditional statement to determine what the hex code will be for a magnitude. 
function getColor(d) {
  return d > 5  ? '#F06B6B' : 
         d > 4  ? '#F0A76B' :  
         d > 3  ? '#F3BA4D':  
         d > 2  ? '#F3DB4D':     
         d > 1  ? '#E1F34D':  
                    '#B7F34D';   
  }

function getRadius(value){
  return value*50000
}
