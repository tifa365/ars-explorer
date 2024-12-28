// The template tag defines the HTML structure of the Vue component.
// It contains the markup that will be rendered in the browser when the component is used.
// This structure allows for the creation of dynamic and reactive user interfaces using Vue's reactivity system.
// The main container for the application is a div with the id "app".
<template>
  <div id="app">
    <!-- This <div> serves as a container for the map, which will display geographical data -->
    <div id="map"></div>
    
    <!-- The search section allows users to input queries related to ARS or area names -->
    <div class="search">
      <!-- Input field for user search queries -->
      <input
        id="search-input"
        class="input"
        type="text"
        placeholder="Nach ARS oder Gebietsbezeichnung suchen..."
        autofocus
      />
      
      <!-- Wrapper for displaying search results -->
      <div class="result-wrapper">
        <div class="results"></div>  <!-- This <div> will hold the search results -->
        
        <!-- Section for loading more results, if applicable -->
        <section class="section load-more has-text-centered">
          <a href="#" id="a-load-more"></a>  <!-- Link to load more results -->
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";

export default {
  name: "App",
  // data() is a standard method in Vue components, which is used to define the initial state of the component.
  // data is defined as a method (function) that returns an object with the initial state of the component.
  data() {
    return {
      map: null,
      layer: null,
      shapeStyle: {
        color: "#2A8A15",
        weight: 4,
        opacity: 0.65,
      },
      arsMap: [], // list of ARS and area names
      offset: 0, // results offset
      PAGE_SIZE: 30,
      searchQuery: '', // Store the current search query
      filteredResults: [], // Store the filtered search results
    };
  },

  mounted() {
    // Initialize the map
    this.map = L.map("map").setView([51.5, 11], 6);

    // Add the OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        'Map data &
        copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a> | Gebietsumrisse: <a href="https://geoportal.de/Info/cfbe95dc-81b9-4704-a61c-d71070d15fd3">GeoBasis-DE / BKG 2023</a>',
    }).addTo(this.map);


    // Load the ARS data
    this.loadARSData();
  },
  // Purpose: The methods property is an object that contains functions (methods) that can be called in response to events or to perform actions within the component. These methods can manipulate the data properties, perform calculations, or handle user interactions.
  // Example: In your code snippet, the methods object is where you would define functions like loadARSData and others that handle specific tasks:
  methods: {
    async loadARSData() {
      try {
        const response = await fetch("ars_from_geojson.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.arsMap = await response.json();
      } catch (error) {
        console.error("Failed to load ARS data:", error);
      }
    },
    
    handleSearch(query) {
      this.searchQuery = query;
      this.offset = 0; // Reset offset when new search is performed
      
      const queryLower = query.toLowerCase().trim();
      
      if (queryLower.length === 0) {
        this.filteredResults = [];
        return;
      }

      // Filter the ARS map based on the query
      this.filteredResults = Object.keys(this.arsMap)
        .filter(key => 
          key.indexOf(queryLower) === 0 || 
          this.arsMap[key].toLowerCase().indexOf(queryLower) !== -1
        )
        .map(ars => ({
          ars,
          name: this.arsMap[ars],
        }))
        .sort((a, b) => a.ars.length - b.ars.length);

      // Update URL hash
      window.location.hash = query;
      
      // If we have results and first result matches query exactly, show its shape
      if (this.filteredResults.length >= 1 && this.filteredResults[0].ars === queryLower) {
        this.showShape(this.filteredResults[0].ars);
      } else if (this.layer) {
        this.layer.remove();
      }
    },

    async showShape(ars) {
      try {
        const response = await fetch(`geojson/${ars}.geojson.json`);
        const geojson = await response.json();
        
        if (this.layer) {
          this.layer.remove();
        }

        this.layer = L.geoJSON(geojson.features, {
          style: this.shapeStyle
        }).addTo(this.map);

        this.map.flyToBounds(this.layer.getBounds(), {
          animate: true,
          maxZoom: 11.5
        });
      } catch (error) {
        console.error('Failed to load shape:', error);
      }
    },
  },
</script>

