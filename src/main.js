import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import './assets/styles.css'

// Bulma CSS is a modern CSS framework based on Flexbox. 
// Import Bulma CSS
import "bulma/css/bulma.min.css";
// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

const app = createApp(App);

// Initialize Pinia to manage state in your Vue.js application
app.use(createPinia());

// Mounting the app in Vue.js means to start the application and attach it to a specific DOM element in your HTML. When you call app.mount("#app");, you are telling Vue to take the instance of your application and render it inside the HTML element with the ID app
app.mount("#app");
