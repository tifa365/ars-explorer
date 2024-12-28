// The <template> tag defines the HTML structure of the Vue component.
// It contains the markup that will be rendered in the browser when the component is used.
// This structure allows for the creation of dynamic and reactive user interfaces using Vue's reactivity system.

// The main container for the application is a <div> with the id "app".
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
    };
  },

  mounted() {
    // Initialize the map
    this.map = L.map("map").setView([51.5, 11], 6);

    // Add the OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        'Map data &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a> | Gebietsumrisse: <a href="https://geoportal.de/Info/cfbe95dc-81b9-4704-a61c-d71070d15fd3">GeoBasis-DE / BKG 2023</a>',
    }).addTo(this.map);


    // Load the ARS data
    this.loadARSData();
  },

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
  },
};
</script>

<style>
/* Styles for the entire HTML document */
html {
  overflow: auto; /* Allows scrolling if content overflows */
}

/* Styles for the map container */
#map {
  height: 100vh; /* Sets the height of the map to fill the entire viewport height */
}

/* Styles for the search container */
.search {
  position: absolute; /* Positions the search box absolutely within the parent */
  top: 10px; /* 10 pixels from the top of the viewport */
  left: 80px; /* 60 pixels from the left of the viewport */
  max-width: 30vw; /* Maximum width of the search box is 30% of the viewport width */
  z-index: 1000; /* Ensures the search box appears above other elements */
  border-radius: 0.25em; /* Rounds the corners of the search box */
  scrollbar-width: thin; /* Sets the scrollbar width to thin */
  scrollbar-color: #363636 rgba(255, 255, 255, 0.5); /* Sets the scrollbar color */
}

/* Styles for the input field within the search container */
.search input {
  border: 2px solid rgba(0, 0, 0, 0.2); /* Light border around the input field */
  border-radius: 4px; /* Rounds the corners of the input field */
  min-width: 24em; /* Minimum width of the input field */
}

/* Styles for the input field when active or focused */
.search input:active,
.search input:focus {
  border: 2px solid rgba(0, 0, 0, 0.2); /* Keeps the same border style when active or focused */
}

/* Styles for the placeholder text in the input field */
.search input::placeholder {
  color: unset; /* Resets the color of the placeholder text */
}

/* Styles for the result wrapper within the search container */
.search .result-wrapper {
  max-height: 60vh; /* Maximum height of the result wrapper is 60% of the viewport height */
  margin-top: 0.5em; /* Adds a margin at the top */
  padding-top: 0; /* No padding at the top */
  padding-right: 0.5em; /* Adds padding on the right */
  padding-bottom: 0; /* No padding at the bottom */
  overflow-y: auto; /* Enables vertical scrolling if content overflows */
}

/* Styles for individual results within the result wrapper */
.search .result {
  background: rgba(255, 255, 255, 0.5); /* Semi-transparent background for results */
}

/* Styles for images within the result */
.search .result img {
  height: 1.5em; /* Sets the height of the image */
  float: right; /* Floats the image to the right */
}

/* Styles for the load more section */
section.load-more {
  padding-top: 1em; /* Adds padding at the top */
  padding-bottom: 5rem; /* Adds padding at the bottom */
}

/* Styles for individual result items */
.result {
  margin-bottom: 0.5rem; /* Adds margin at the bottom of each result */
  border: 1px solid #f5f5f5; /* Light border around each result */
  padding: 0.5em; /* Adds padding inside each result */
  border-radius: 0.5em; /* Rounds the corners of each result */
  cursor: pointer; /* Changes cursor to pointer on hover */
}

/* Styles for results on hover */
.result:hover {
  border: 1px solid #dadada; /* Changes border color on hover */
}
</style>
