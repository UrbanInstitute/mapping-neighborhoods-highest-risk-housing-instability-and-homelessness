# Emergency Rental Assistance Priority Index 2.0
## Project Details
### What it powers
This choropleth Mapbox map shows tracts filled based on a researcher-team-developed priority index assigned from 0 to 100 within each state. A slide-down sidebar displays individual subindex information making up that priority index. An IP sniffer initially places the map near the user's location for most relevant information.

### Pertinent Links
Developer: Rachel Logan

Designer: Brittney Spinner

Writer: Emily Peiffer and Wes Jenkins

Lead Researcher: Samantha Batko


Staging Link: [https://apps-staging.urban.org/features/emergency-rental-assistance-index-2/](https://apps-staging.urban.org/features/emergency-rental-assistance-index-2/)

Production Link: 

Figma Link: 

Data Catalogue Link:


## Data
Original Source: Census tract shapes come from the U.S. census bureau. Subindex values for each tract come from Urban's Metro policy center.

How to prepare the data: For the csv, ome name-cleaning is required, removing parentheticals from column names and translating to snake case. For the geojson, run `make clean` and `make` in a terminal to pull down shapefiles, and craft mbtile files from them. Then, upload those tiles to Mapbox and import them as a "tracts" layer for use in the Map.svelte file.

Where do the csv/geojson live: Geojson is saved in a data/output folder that does not need tracked in GitHub. Csv data can be saved in the public directory under the name "erap_index_for_communications_cleaned.csv".

## Development
### Dependencies
This project runs on Vite, Svelte, and Mapbox. D3 is used to color tracts. 

### Svelte module descriptions
App.svelte: holds constants for the project like locations for files and the color of tracts with no data.

ErapMap.svelte: the true insertion point for the project. Holds the top-level module structure and internal variable defaults.

Search.svelte: a search bar with dynamic width that sifts through county and state pairs. When a location is selected, the map flies to that county's bounds.

LocatorBadge.svelte: the top module overlaying the map that displays the current tract information and total ERAP index. Collapsible.

Map.svelte: holds all map rendering, coloring, hovering, and maneuvering logic.

LegendBadge.svelte: svg using D3 color scale that moves off the map at smaller widths.

Sidebar.svelte: displays and breaks down all subindex data. Slides up when there isn't an index for the current tract.

LocatorIndexTitle.svelte: part of the sidebar. Bigger, detailed display of where the cursor is.

Index.svelte: just one component of the sidebar for one subindex.

### Running locally
Start a local server with:

```bash
npm run dev
```

Open your browser and visit [http://localhost:5173](http://localhost:5173) to see your project running.

The project has a single entry point, defined by the `index.html` file. This HTML file loads a JavaScript module found in `src/main.js`. Vite will automatically bundle any JavaScript, CSS, or other assets imported by this file or any of its dependencies.


## Deploying to Urban's servers

Deployments are handled by [CircleCI](https://app.circleci.com/). Once your repository is setup in Github, you can initialize the project in CircleCI by visiting [https://app.circleci.com/projects/project-dashboard/github/UI-Research/](https://app.circleci.com/projects/project-dashboard/github/UI-Research/), finding your new project, and clicking the "Set Up Project" button.

Projects will also need to be configured with SSH keys to deploy properly. Consult [Mitchell Thorson](mailto:MThorson@urban.org) or [Jess Kelly](mailto:JKelly@urban.org) if you need help with this.

Once enabled, CircleCI will automatically build and deploy your project to Urban's staging server when you push a commit to the `dev` branch.

CircleCI will also run your tests and a build for each commit you push to any branch. You can use these checks to ensure that your changes don't break anything before you merge them into `dev` or `main`.

When you are ready to deploy to the production server, you'll need to make a small adjustment to the CircleCI config. Near the bottom of the `.circleci/config.yml` file, you'll see a `workflows` section. Under `workflows`, there should be a `install-test-build-deploy-prod` workflow that contains a `when` conditional statement:

```yaml
install-test-build-deploy-prod:
  when:
    equal: [ SET-ME-TO-MAIN-TO-DEPLOY, << pipeline.git.branch >>]
```

Update the `equal` statement to compare `main` to `pipeline.git.branch` instead of `SET-ME-TO-MAIN-TO-DEPLOY` like so:

```yaml
install-test-build-deploy-prod:
  when:
    equal: [ main, << pipeline.git.branch >>]
```

Once you've done that, CircleCI will automatically deploy each new commit to the `main` branch to the production server.

Optionally, you can modify the URL ending for your production build by specifying a new `project_slug_production` parameter near the top of the file:  

```yaml
parameters:
  project_slug_production:
    type: string
    default: my-new-production-slug-goes-here
```

The value of `project_slug_production` will be used in place of the repository name when this is set.
