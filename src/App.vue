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
          <img src="@/assets/shape-berlin.svg" alt="Region icon">
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
    
    handleSearch(query) {
      this.searchQuery = query; // Update the search query
      this.offset = 0; // Reset offset when new search is performed
      
      const queryLower = query.toLowerCase().trim(); // Normalize the query for case-insensitive search
      
      if (queryLower.length === 0) {
        this.filteredResults = []; // Clear results if the query is empty
        return; // Exit the method early
      }

      this.filteredResults = Object.keys(this.arsMap)
        .filter(key => 
          key.indexOf(queryLower) === 0 || 
          this.arsMap[key].toLowerCase().indexOf(queryLower) !== -1 
        )
        .map(ars => ({
          ars, // ARS code
          name: this.arsMap[ars], // Corresponding area name
        }))
        .sort((a, b) => a.ars.length - b.ars.length); // Sort results by ARS code length

      window.location.hash = query; // Update URL hash to reflect the current search query
      
      if (this.filteredResults.length >= 1 && this.filteredResults[0].ars === queryLower) {
        this.showShape(this.filteredResults[0].ars); // Show the shape for the first result
      } else if (this.layer) {
        this.layer.remove(); // Remove the previous layer if no match is found
      }
    },

    async showShape(ars) {
      try {
        const response = await fetch(`geojson/${ars}.geojson.json`); // Fetch the GeoJSON data for the ARS
        const geojson = await response.json(); // Parse the GeoJSON data
        
        if (this.layer) {
          this.layer.remove(); // Remove the previous layer if it exists
        }

        this.layer = L.geoJSON(geojson.features, {
          style: this.shapeStyle // Apply the defined shape style
        }).addTo(this.map);

        this.map.flyToBounds(this.layer.getBounds(), {
          animate: true, // Enable animation
          maxZoom: 11.5 // Set maximum zoom level
        });
      } catch (error) {
        console.error('Failed to load shape:', error); // Log any errors that occur
      }
    },

    handleResultClick(ars) {
      this.searchQuery = ars; // Update the search query with the clicked ARS
      window.location.hash = ars; // Update the URL hash
      this.showShape(ars); // Show the shape for the clicked ARS
    },
  },
};
</script>
