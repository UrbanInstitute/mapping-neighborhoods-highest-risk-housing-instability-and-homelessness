<script>
  import ErapMap from "./ErapMap.svelte";
  import "./app.css";
  console.log("👋 Welcome to DataViz@URBAN!");

  // "#5c5859"
</script>

<main>
  <div>
    <ErapMap
      explainerText="Select a census tract to see how its rental assistance need compares with other tracts in the state."
      dataLocation="./erap_index_for_communications_2025_11_18.csv"
      bboxLocation="./county-bbox.json"
      naColor="#D2D2D2"
    />
  </div>
</main>

<style>
  main {
    width: 100%;
  }
</style>
