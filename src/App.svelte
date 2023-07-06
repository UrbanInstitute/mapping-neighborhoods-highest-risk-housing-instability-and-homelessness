<script>
  import packageJson from "../package.json";
  import ErapMap from "./ErapMap.svelte";
  import "./app.css"
  console.log("👋 Welcome to DataViz@URBAN!");

// "#5c5859"
  
</script>

<main>
  
  <div>
    <ErapMap
      explainerText="Select a census tract to see how its rental assistance need compares with other tracts in the state."
      dataLocation="./erap_index_for_communications_cleaned.csv"
      bboxLocation="./county-bbox.json"
      naColor = "#D2D2D2"
    ></ErapMap>
  </div>
</main>

<style>
  main {
    width: 100%;
  }
</style>
