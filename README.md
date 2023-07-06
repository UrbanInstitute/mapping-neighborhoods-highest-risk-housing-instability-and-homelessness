# Emergency Rental Assistance Priority Index 2.0
## Project Details
What it powers: This choropleth Mapbox map shows tracts filled based on a researcher-team-developed priority index assigned from 0 to 100 within each state. A slide-down sidebar displays individual subindex information making up that priority index. An IP sniffer initially places the map near the user's location for most relevant information.


Developer: Rachel Logan

Designer: Brittney Spinner

Writer: Emily Peiffer and Wes Jenkins

Lead Researcher: Samantha Batko


Staging Link: [https://apps-staging.urban.org/features/emergency-rental-assistance-index-2/](https://apps-staging.urban.org/features/emergency-rental-assistance-index-2/)

Production Link: [https://www.urban.org/data-tools/does-snap-cover-cost-meal-your-county-2022](https://www.urban.org/data-tools/does-snap-cover-cost-meal-your-county-2022)

Data Catalogue Link: 


## Data
Original Source: Census tract shapes come from the U.S. census bureau. Subindex values for each tract come from Urban researchers.

How to prepare the data: For the csv, some name-cleaning is required, removing parentheticals from column names and translating to snake case. For the geojson, run `make clean` and `make` in a terminal to pull down shapefiles, and craft mbtile files from them. Then, upload those tiles to Mapbox and import them as a "tracts" layer for use in the `Map.svelte` file.

Where do the csv/geojson live: Geojson is saved in a data/output folder that does not need tracked in GitHub. Csv data can be saved in the public directory under the name "erap_index_for_communications_cleaned.csv".

## Development
### Dependencies
This project runs on Vite, Svelte, and Mapbox. D3 is used to color tracts. 

### Svelte module descriptions
`App.svelte`: holds constants for the project like locations for files and the color of tracts with no data.

`ErapMap.svelte`: the true insertion point for the project. Holds the top-level module structure and internal variable defaults.

`Search.svelte`: a search bar with dynamic width that sifts through county and state pairs. When a location is selected, the map flies to that county's bounds.

`LocatorBadge.svelte`: the top module overlaying the map that displays the current tract information and total ERAP index. Collapsible.

`Map.svelte`: holds all map rendering, coloring, hovering, and maneuvering logic.

`LegendBadge.svelte`: svg using D3 color scale that moves off the map at smaller widths.

`Sidebar.svelte`: displays and breaks down all subindex data. Slides up when there isn't an index for the current tract.

`LocatorIndexTitle.svelte`: part of the sidebar. Bigger, detailed display of where the cursor is.

`Index.svelte`: just one component of the sidebar for one subindex.

### Running locally
Start a local server with:

```bash
npm run dev
```

Open your browser and visit [http://localhost:5173](http://localhost:5173) to see your project running.

The project has a single entry point, defined by the `index.html` file. This HTML file loads a JavaScript module found in `src/main.js`. Vite will automatically bundle any JavaScript, CSS, or other assets imported by this file or any of its dependencies.
