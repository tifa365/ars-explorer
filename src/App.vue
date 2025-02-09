/* eslint-disable */
<template>
  <div id="app">
    <div id="map"></div>
    <div class="search">
      <input
        id="search-input"
        class="input"
        type="text"
        v-model="searchQuery"
        @input="handleSearch($event.target.value)"
        placeholder="Nach ARS oder Gebietsbezeichnung suchen..."
        autofocus
      />
      <div class="results">
        <div v-for="result in filteredResults" :key="result.ars" class="container result">
          <!-- Can be added back in when we have shapes for all ARS <img src="@/assets/shape-berlin.svg" alt="Region icon"> -->
          <p @click="handleResultClick(result.ars)">
            <strong>{{ result.name }}</strong> | {{ result.ars }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet"; // Importing Leaflet library for map functionalities

export default {
  name: "App", // Name of the Vue component
  data() {
    return {
      map: null, // Variable to hold the map instance
      layer: null, // Variable to hold the current shape layer
      shapeStyle: { // Style settings for the shapes on the map
        color: "#2A8A15", // Color of the shape
        weight: 4, // Border weight of the shape
        opacity: 0.65, // Opacity of the shape
      },
      arsMap: [], // Array to hold the list of ARS and area names
      offset: 0, // Variable to manage pagination offset for results
      PAGE_SIZE: 30, // Number of results to display per page
      searchQuery: '', // Variable to store the current search query
      filteredResults: [], // Array to store the results filtered based on the search query
    };
  },

  mounted() {
    this.map = L.map("map").setView([51.5, 11], 6); // Initialize the map and set its view

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, // Maximum zoom level for the map
      attribution: 'Map data &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a> | Gebietsumrisse: <a href="https://geoportal.de/Info/cfbe95dc-81b9-4704-a61c-d71070d15fd3">GeoBasis-DE / BKG 2023</a>',
    }).addTo(this.map); // Add the tile layer to the map

    this.loadARSData(); // Load the ARS data from a JSON file

    // Debounce the search function to avoid multiple requests
    this.debouncedSearch = this.debounce(this.handleSearch, 150);
  },

  methods: {
    async loadARSData() {
      try {
        const response = await fetch("ars_from_geojson.json"); // Fetch the ARS data
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
        }
        this.arsMap = await response.json(); // Parse and store the ARS data
      } catch (error) {
        console.error("Failed to load ARS data:", error); // Log any errors that occur
      }
    },

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    handleSearch(query) {
      this.searchQuery = query;
      this.offset = 0;
      
      const queryLower = query.toLowerCase().trim();
      
      if (queryLower.length === 0) {
        this.filteredResults = [];
        return;
      }

      // Only search if query is at least 2 characters
      if (queryLower.length < 3) {
        return;
      }

      // Use more efficient filtering
      this.filteredResults = Object.entries(this.arsMap)
        .filter(([ars, name]) => {
          const nameMatch = name.toLowerCase().includes(queryLower);
          const arsMatch = ars.startsWith(queryLower);
          return nameMatch || arsMatch;
        })
        .map(([ars, name]) => ({ ars, name }))
        .slice(0, this.PAGE_SIZE); // Limit initial results

      // Only update URL and shape if we have an exact match
      if (this.filteredResults.length > 0 && this.filteredResults[0].ars === queryLower) {
        window.location.hash = query;
        this.showShape(this.filteredResults[0].ars);
      } else if (this.layer) {
        this.layer.remove();
      }
    },

    async showShape(ars) {
      try {
        if (this.layer) {
          this.layer.remove();
        }

        const response = await fetch(`geojson/${ars}.geojson.json`);
        const geojson = await response.json();
        
        this.layer = L.geoJSON(geojson.features, {
          style: this.shapeStyle,

          onEachFeature: (feature, layer) => {
          // Calculate bounding box from feature
          const bounds = layer.getBounds();
          const bbox = [
            bounds.getWest(),  // min longitude
            bounds.getSouth(), // min latitude
            bounds.getEast(),  // max longitude
            bounds.getNorth()  // max latitude
          ];
          
          const govDataUrl = `https://www.govdata.de/suche?boundingbox=${bbox.join(',')}`;
          const popupContent = `
            <strong>${this.arsMap[ars]}</strong><br><br>
            ARS: ${ars}<br>
            <a href="${govDataUrl}" target="_blank">
              GovData-Datensätze für diese Region
            </a>
          `;
          layer.bindPopup(popupContent);
        }
        }).addTo(this.map);

        // Optimize the zoom animation
        this.map.flyToBounds(this.layer.getBounds(), {
          duration: 1, // Duration of the animation in seconds
          easeLinearity: 0.5,  // More linear movement
          padding: [50, 50]  // Add some padding around the shape
        });
      } catch (error) {
        console.error('Failed to load shape:', error);
      }
    },

    handleResultClick(ars) {
      this.searchQuery = ars; // Update the search query with the clicked ARS
      window.location.hash = ars; // Update the URL hash
      this.showShape(ars); // Show the shape for the clicked ARS
      this.filteredResults = []; // Clear the search results
    },
  },
};
</script>
