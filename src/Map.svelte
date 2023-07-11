<script>
//imports 
import { onMount } from "svelte";
import * as d3 from "d3"
import mapboxgl from "mapbox-gl";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";

//exports
export let hoverData;
export let selectedTractName;
export let naColor;
export let allCounties;
export let dataLocation;
export let bboxLocation;
export let explainerText;

let chartContainer;
let rawData = []; // holds raw data from csv
let rawBbox = {}; //holds raw bbox coords by geoid
let bboxMap = new Map();
let dataMap = new Map();
let hoveredTractId = ""; // holds reference to any highlighted feature on the map
let clickFocus = false; // boolean that holds state of click focus
let clickedID = "";
let map;

let initialLat = null;
let initialLong = null;


$: setInitialCoords(initialLat, initialLong, map)

// using the GeoJS API: https://www.geojs.io/docs/v1/endpoints/geo/
let request = new XMLHttpRequest();
request.open("GET", "https://get.geojs.io/v1/ip/geo.json");
request.send();
request.onload = function() {
    if(request.status === 200) {
        let response = JSON.parse(request.response);
        initialLat = +response.latitude;
        initialLong = +response.longitude;
        hoverData.hoverCounty = response.city;
        hoverData.hoverStateName = response.region;
    }
}


let setInitialCoords = (lat, long, map) => {
    if (map == undefined) return;
    if (lat == null || long == null) return;
    map.flyTo({center: [long, lat]})
}

//some documentation I was perusing
// https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/
// https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#feature-state


// DATA FORMATTING

//build data map
$: buildDataMap(rawData)

$: if (rawBbox.length > 0) {
    for (const d of rawBbox) {
        bboxMap.set(d.NAMELSAD + ", " + d.STATE_NAME, d.bbox)
    }
}

let buildDataMap = (raw) => {
    allCounties = [];
    raw.forEach((d) => {
        let obj = {};
        let geoid = "";
        Object.keys(d).forEach((prop) => {
            if (prop == "geoid") {
                geoid = d[prop]
            } else {
                obj[prop] = d[prop];
            }
        });
        dataMap.set(geoid, obj)

        //also build counties list bc why not
        let locale = toTitleCase(d['county_name'])+", " + d['state_name'];
        
        if(!allCounties.some(e => e.location == locale)){
            allCounties.push({"location":locale});
        }
    }); 
}

let toTitleCase = (locale) => {
    return locale.split(" ").map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }).join(' ')
}

//get data for tract that's hovered over
let setHoverData = (id) => {
    let thisData = dataMap.get(id)
    if (!thisData){
        thisData = dataMap.get("0"+id)
    }
    if (thisData && thisData.total_erap_index >= 0){
        hoverData = {
            'weHaveData': true,
            'hoverColor': colorScale(thisData.total_erap_index),
            'hoverCounty': toTitleCase(thisData.county_name),
            'hoverStateName': thisData.state_name,
            'hoverStateAbbrev':"", //TODO ####################################
            'hoverTract': id.toString().substr(-6),
            'erapIndex': thisData.total_erap_index,
            'hoverELI': thisData.eli_total,
            'subIndices': [
                [
                    [thisData.hh_characteristics_subindex,"Household Demographics Subindex"],
                    [thisData.average_renter_hh_size,"Average renter household size"],
                    [thisData.percent_black,"Share of Black people"],
                    [thisData.percent_asian,"Share of Asian people"],
                    [thisData.percent_hispanic,"Share of Latine people"],
                    [thisData.percent_other,"Share of Indigenous, Pacific Islander, or multiracial people"]
                ],[
                    [thisData.housing_subindex,"Housing Subindex"],
                    [thisData.median_monthly_housing_cost,"Median monthly housing cost"],
                    [thisData.percent_renter_occupied_units,"Share of renter-occupied units"],
                    [thisData.percent_renter_occupied_units_multi_unit,"Share of renter-occupied units in multiunit buildings"]
                ],[
                    [thisData.income_subindex,"Income Subindex"],
                    [thisData.percent_cost_burdened_renter_hhs,"Share of cost-burdened renter households"],
                    [thisData.percent_eli,"Share of extremely low-income renter households"]
                ]
            ]
        }
    } else if (thisData){
        hoverData = {
            'weHaveData': false,
            'hoverColor': "#D2D2D2",
            'hoverCounty': toTitleCase(thisData.county_name),
            'hoverStateName': thisData.state_name,
            'hoverStateAbbrev': "",
            'hoverTract': id.toString().substr(-6),
            'erapIndex': thisData.total_erap_index,
            'hoverELI': 0,
            'subIndices': []
        }
    }
    
    
}

// COLORS

$: colorScale = d3
    .scaleThreshold()
    .domain([0,50,75,85,90,95,100])
    .range(["#d2d2d2","#cfe8f3","#73bfe2", "#46abdb", "#1696d2", "#12719e", "#0a4c6a"]) //first: #cfe8f3", 
    .unknown(naColor);

let urbanColors = ["#cfe8f3","#a2d4ec","#73bfe2", "#46abdb", "#1696d2", "#12719e","#0a4c6a" ]


//analytics ping when a county is clicked
let logClickToGA = (locationName) => {
    gtag('event',
        'button_click', //eventName
        {
            'firing-module-name':'erap-map', //firingModuleName
            'target-classes':"chart-container",
            'target-id':"",
            'target-text':"I'm the map",
            'click-target': locationName
        }
    )
}


// lifecycle method onMount: run when component is added to the DOM
onMount(async () => {
    // load csv data
    rawData = await d3.csv(dataLocation);
    rawBbox = await d3.json(bboxLocation)
});

$: flyToSelection(selectedTractName, map)

let flyToSelection = (id, map) => {
    if (!map) return;
    map.fitBounds(bboxMap.get(id), {padding: 100, duration: 6000})
}

//this big chunk renders the map -- once?
$: if (chartContainer) {
    renderMap()
}

let renderMap = () => {

    mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ"

    //first grab streets view. our tract shapes will layer on top
    map = new mapboxgl.Map({
        style: 'mapbox://styles/urbaninstitute/ckcnh9jwm2llo1hp4yvfvy76i',
        //style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-77.023195,38.883579],
        zoom: 12,
        maxZoom: 14,
        minZoom: 8,
        bearing: 0,
        cooperativeGestures: true,
        container: chartContainer
        /* -124.848974 (West) to -66.885444 (East)
Latitude: 24.396308 (South) to 49.384358 (North)*/
    });

    //adds zoom and pan controls
    map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'bottom-right');

    //set tilesets as source and layer
    map.on('load', () => {
        loadMapData(map)
    })

    const setTractColors = () => {
        for (let key of dataMap.keys()) {
            map.setFeatureState({
                source: 'tract_shapes',
                sourceLayer: 'tract_geo',
                id: key
            }, {
                'color': colorScale(dataMap.get(key)['total_erap_index']) 
            })
        }
    }

    const setAfterLoad = (e) => {
        if (e.sourceId === 'tract_shapes' && e.isSourceLoaded) {
            setTractColors();
            map.off('sourcedata', setAfterLoad)
        }
    }

    if (map.getSource('tract_shapes')) { //if (map.isSourceLoaded('tracts')) {
        setTractColors();
    } else {
        map.on('sourcedata', setAfterLoad);
    }

    // When the user moves their mouse over the tracts layer, we'll update the
    // feature state for the feature under the mouse.
    map.on('mousemove', 'tracts_fill', (e) => {
        if (e.features.length == 0 ) return;
        if(!clickFocus) {
            //reset previously highlighted tract
            if (hoveredTractId !== "") {
                map.setFeatureState(
                    { source: 'tract_shapes', sourceLayer: 'tract_geo', id: hoveredTractId },
                    { hover: false }
                );
            }
            //get data for next tract
            hoveredTractId = e.features[0].id.toString();
            if (hoveredTractId.length == 10) hoveredTractId = "0" + hoveredTractId
            setHoverData(hoveredTractId)

            map.setFeatureState(
                { source: 'tract_shapes', sourceLayer: 'tract_geo', id: hoveredTractId },
                { hover: true}
            );

        } else {
            //even if there is a click, still update the hover id, just don't act on it
            hoveredTractId = e.features[0].id.toString();
            if (hoveredTractId.length == 10) hoveredTractId = "0" + hoveredTractId
        }
    });
    
    // When the mouse leaves the tracts layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', 'tracts_fill', () => {
        if (hoveredTractId !== "" && hoveredTractId != clickedID) {
            map.setFeatureState(
                { source: 'tract_shapes', sourceLayer: 'tract_geo', id: hoveredTractId },
                { hover: false }
            );
        }
        hoveredTractId = "";
    });

    // when the user clicks, toggle clickFocus and freeze/unfreeze hovering
    map.on('click', 'tracts_fill', (e) => {
        //if nothing is selected and there's nothing hovered, don't activate click but can deactivate
        if (!clickFocus && hoveredTractId == "") {
            clickFocus = false; 
            return;
        }
        
        //else: either we have an active click or we have no active click and we just selected a tract
        //if we are selecting: don't need to update hover, just set clickedID
        //if we are deselecting: need to change hover val on clicked tract-- need id
        clickFocus = !clickFocus;

        if (clickFocus){
            clickedID = hoveredTractId;
            logClickToGA(hoverData.hoverCounty + ", "+ hoverData.hoverStateName) //log the new selection 
        }
        else {
            map.setFeatureState( //deselect clickedID
                { source: 'tract_shapes', sourceLayer: 'tract_geo', id: clickedID },
                { hover: false }
            );
            map.setFeatureState( //select tract under the mouse
                { source: 'tract_shapes', sourceLayer: 'tract_geo', id: hoveredTractId },
                { hover: true }
            );
            setHoverData(hoveredTractId); //and update the data
            clickedID = "";
            
        }
    })

    //for our mobile users, there is no lack of clickFocus
    //both touchstart and click are triggered! 
    //so we can just act like there was something focused and skip the two-step
    map.on('touchstart', 'tracts_fill', (e) => {
        clickFocus = false;
    })

    // disable map rotation using right click + drag
    map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

}

let loadMapData = (map) => {

    map.addSource('tract_shapes', {
        'type': 'vector',
        'url': "mapbox://urbaninstitute.3uregab7"
    });

    //using style from old map, but want to turn off the fills
    map.setLayoutProperty('housing-data-indexid-exponential-color', 'visibility', 'none');
    map.setLayoutProperty('tract-hover-strokes', 'visibility', 'none');

    //change water fill to not be on the color scale
    map.setPaintProperty('water', 'fill-color', '#000000');

    //add points of interest
    map.setLayoutProperty('poi-label', 'visibility','visible');
    map.setPaintProperty('poi-label', 'text-color','white');
    map.setPaintProperty('poi-label', 'text-halo-color','black');
    map.setPaintProperty('poi-label', 'text-halo-width',.5);
    map.setFilter('poi-label', 
        ['all',
            ['!=', 'class', 'food_and_drink'],
            ['!=', 'maki', 'golf'],
            ['!=', 'class', 'lodging']
        ]
    )

    map.setPaintProperty('settlement-minor-label', 'text-color','white');
    map.setPaintProperty('settlement-minor-label', 'text-halo-color','black');

    map.setPaintProperty('settlement-major-label', 'text-color','white');
    map.setPaintProperty('settlement-major-label', 'text-halo-color','black');

    map.setLayoutProperty('road-label-simple','visibility','visible')
    map.setFilter('road-label-simple', 
        ['any',
            ['==', 'class', 'motorway'],
            ['==', 'class', 'trunk'],
            ['==', 'class', 'primary'],
            ['==','class','secondary']
        ]
    )

    map.setLayoutProperty('waterway-label','visibility','visible')
    map.setLayoutProperty('water-line-label','visibility','visible')
    map.setLayoutProperty('water-point-label','visibility','visible')

    map.addLayer({
        'id': 'tracts_fill',
        'type': 'fill',
        'source': 'tract_shapes',
        'source-layer': 'tract_geo',
        'paint': {
            'fill-color': ['feature-state', 'color'],
            'fill-opacity': .85
        }
    }, 'county boundaries')

    map.addLayer({
        'id': 'tracts',
        'type': 'line',
        'source': 'tract_shapes',
        'source-layer': 'tract_geo',
        'paint': {
            'line-opacity': 1,
            'line-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                'rgb(255, 255, 255)',
                'lightgray'],
            'line-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                4,
                .25]
        }
    },'county boundaries')

    map.moveLayer('water','tracts')
    map.moveLayer('waterway','tracts')

    //console.log(map.getStyle().layers)
}

let vis = "block";
let hide = () => {vis = "none"};
let w = 0; 
let h = 0;

</script>

<div>
    <div class="hover-instructions" style="width: {w}px; height:{h}px; display:{vis};" on:click={hide} on:keypress={hide}>
        <div class="hover-instructions-text">{explainerText}</div>
    </div>
    <div class="chart-container" bind:this={chartContainer} bind:clientHeight={h} bind:clientWidth={w}></div>
</div>

<style>
    .chart-container{
        margin: 0;
        min-height: 600px;
        width: 100%;
    }

    .hover-instructions {
        position: absolute;
        background-color: rgba(0,0,0,.5);
        z-index: 5;
    }

    .hover-instructions-text{
        margin: 240px auto;
        width: 60%;
        padding: 20px;
        vertical-align: center;
        background-color: white;
    }

    @media screen and (max-width: 779px){
        .chart-container{
            min-height: 400px;
            height: 400px;
        }
        .hover-instructions-text{
            margin: 140px auto;
        }
    }

</style>