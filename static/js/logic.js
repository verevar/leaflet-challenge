// Store the API query as endpoint.
let quakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL.
d3.json(quakeURL).then(function(data) {
    console.log(data);

    createFeatures(data.features);

        function createFeatures(earthquakeData) {
            console.log(earthquakeData)

            function onEachFeature(features, layer) {
            
            
            layer.bindPopup(`<h3>${features.properties.title}</h3><hr>
                             Location: ${features.properties.place}<br>
                             Magnitude: ${features.properties.mag}<br>
                             Depth: ${Math.round(features.geometry.coordinates[2])} km<br>
                             Date & Time: ${new Date(features.properties.updated)}`)
            }
            
            function changeColor(features) {
                if (features.geometry.coordinates[2] >= -10 && features.geometry.coordinates[2] <= 10)
                return "#a4f600" 
                else if (features.geometry.coordinates[2] >= 10 && features.geometry.coordinates[2] <= 30)
                return "#ddf400" 
                if (features.geometry.coordinates[2] >= 30 && features.geometry.coordinates[2] <= 50)
                return "#f7db10" 
                else if (features.geometry.coordinates[2] >= 50 && features.geometry.coordinates[2] <= 70)
                return "#feb72a" 
                else if (features.geometry.coordinates[2] >= 70 && features.geometry.coordinates[2] <= 90)
                return "#fca35d" 
                else
                return "#ff5f65"
            }
            
            function geojsonMarkerOptions(features) {
                return {
                    radius: features.properties.mag*3,
                    fillColor: changeColor(features),
                    color: "black",
                    weight: .5,
                    opacity: 1,
                    fillOpacity: 0.8
                }
            };
         
            let earthquakes = L.geoJSON(earthquakeData, {
                style: geojsonMarkerOptions,
                    pointToLayer: function (features, latlng) {
                        return L.circleMarker(latlng, geojsonMarkerOptions)
                    },
                            onEachFeature: onEachFeature
            })
        
        createMap(earthquakes);

    }
    
    function createMap(earthquakes) {
    
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };

    let overlayMaps = {
      'Earthquakes': earthquakes,
    };

    let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes],
    });
    
    function  getColour(s) {
        if (s === '-10 to 10 km')
        return "#a4f600"; 
        else if ( s === '10 to 30 km' ) 
        return "#ddf400";
        else if (s === '30 to 50 km')
        return "#f7db10"; 
        else if (s === '50 to 70 km')
        return "#feb72a";
        else if (s === '70 to 90 km')
        return "#fca35d"; 
        else
        return "#ff5f65" 
    }

    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        let legendDiv =  L.DomUtil.create('div', 'info legend'),
           depths = [
            '-10 to 10 km', 
            '10 to 30 km', 
            '30 to 50 km',
            '50 to 70 km', 
            '70 to 90 km', 
            '90+ km'],
           labels = ['Earthquake<br>Depth<hr>'];
        for ( let i=0; i < depths.length; i++) {
            labels.push( 
                '<i class="square" style="background:' + getColour(depths[i]) + '"></i>'+ depths[i] + '')
        }
        legendDiv.innerHTML = labels.join('<br>');

        return legendDiv;
    }

    legend.addTo(myMap);
  
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(myMap);       
    };
})