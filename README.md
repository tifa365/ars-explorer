# ARS-Explorer

ARS-Explorer is a vue.js-based administrative region lookup and visualization tool for German administrative regions (Amtlicher Regionalschlüssel - ARS). ARS-Explorer allows users to search, visualize, and explore German administrative boundaries on an interactive map. The idea and orginal Python/Javascript implementation was done by @codedust https://codeberg.org/opengovtech/ars-tool. Porting the application to vue.js might further enhance its web-friendliness, allowing for a more dynamic and responsive user experience. 

## Features

- 🔍 Search regions by ARS code or name
- 🗺️ Interactive map visualization using Leaflet
- 📈 Hierarchical display of administrative regions
- 📥 Directly access all datasets in the region by clicking on the map
- 📱 Responsive design using Bulma CSS framework

## Data Sources

The application uses:
- OpenStreetMap for base map tiles
- GeoBasis-DE/BKG 2023 for administrative boundaries in GeoJSON format (municipalities, districts, states)

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Project Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd ars-explorer
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server with hot-reload:
```bash
npm run serve
```

The application will be available at `http://localhost:8080`

## Production Build

Create a production-ready build:
```bash
npm run build
```

## Code Quality

Run linting checks:
```bash
npm run lint
```

## Technical Stack

- Vue 3
- Pinia for state management
- Leaflet for map visualization
- Bulma CSS framework

## License

Licensed under Creative Commons Zero (CC0), though I'd be happy to hear how you're using it.

## Attribution

- Map data: © OpenStreetMap contributors
- Administrative boundaries: © GeoBasis-DE / BKG 2023 (modified representation)
- Idea/prototype: @codedust

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions and feedback, please open an issue in the repository.