<script>
//imports 
import Sidebar from "./Sidebar.svelte";
import Map from "./Map.svelte";
import Search from "./Search.svelte";
import LocatorBadge from "./LocatorBadge.svelte";
import LegendBadge from "./LegendBadge.svelte";

//exports
export let explainerText;
export let dataLocation;
export let bboxLocation;
export let naColor;


let hoverData = {
            'weHaveData': false,
            'hoverColor': "#D2D2D2",
            'hoverCounty': "District of Columbia",
            'hoverStateName': "District of Columbia",
            'hoverTract': "000000",
            'erapIndex': "NA",
            'hoverELI': 0,
            'subIndices': []
        };
let selectedTractName = "";
let allCounties = [];



</script>

<div>

    <Search bind:selectedTractName = {selectedTractName} {allCounties}/>
    <LocatorBadge {hoverData}/>
    <Map
        bind:hoverData = {hoverData} {bboxLocation} {explainerText}
        {selectedTractName}  {dataLocation} bind:allCounties={allCounties} {naColor}
    />

    <LegendBadge {naColor}/>
    <Sidebar {hoverData}/>


</div>

<style>


</style>