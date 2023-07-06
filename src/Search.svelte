<script>
//imports 
import Typeahead from "svelte-typeahead"
import SearchIcon from "./assets/icon-search.svg";

//exports
export let selectedTractName;
export let allCounties;

let extract = (item) => item.location;

let onTypeaheadSelect = ({detail}) => {
    selectedTractName = detail.selected

    gtag('event',
        'button_click', //eventName
        {
            'firing-module-name':'snap-map', //firingModuleName
            'target-classes':"dropdown-container",
            'target-id':"",
            'target-text':"Search for your county...",
            'dropdown-select': detail.selected
        }
    )
}

let windowWidth = 0;
$: smallScreen = windowWidth < 780; 

</script>

<svelte:window bind:innerWidth={windowWidth}/>
<div>
    <div class="search-container {smallScreen ? 'render-up': "render-down"}">
        <Typeahead data={allCounties} {extract} showDropdownOnFocus hideLabel label="Search for your county." placeholder="Search for your county." on:select={onTypeaheadSelect}/>
        <div class="search">
          <SearchIcon alt="Search icon" viewBox = "0 0 48 48" width=20 height=20></SearchIcon>
      </div>
    </div>

</div>

<style>

  .search-container{
    margin: 10px;
    border: 1px solid lightgray;
    background-color: white;
  }

  .render-up{
    position: relative;
    margin: 0px 0px 10px 0px;
  }

  .render-down{
    position: absolute;
    top: 0px;
    z-index: 2;
  }

  .render-up :global([data-svelte-typeahead]) {
    width: calc(100% - 45px);
  }

.search {
    width: 20px;
    height: 20px;
    margin: 0px 10px;
    display: inline-block;
    color: darkgrey;
    background-size: 20px 20px;
    background-repeat: no-repeat;
    background-position: center bottom;
    display: inline-block;
    vertical-align: text-bottom;
  }

  :global([data-svelte-typeahead]){
    width: 350px;
    display: inline-block;
    z-index: 3;
  }

  :global([data-svelte-typeahead] ul){
    overflow: scroll;
    max-height: 300px;
  }

  :global([data-svelte-typeahead] mark){
    background-color: #FDBF11;
  }

  :global([data-svelte-typeahead] li.selected){
    background-color: #D2D2D2 !important;
  }

  /* maybe this messes with accessibility but in dark mode it's white text by default */
  :global([data-svelte-typeahead] input){
    color: black; 
    border: none !important;
  }
  
</style>