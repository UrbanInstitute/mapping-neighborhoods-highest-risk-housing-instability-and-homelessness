<script>
//imports 
import iconOpen from "./assets/icon-plus.png";
import iconClose from "./assets/icon-minus.png";

//exports
export let hoverData;

let opened = true;
let myDiv = null;
let smallScreen = false;

let windowWidth = 0;
$: smallScreen = windowWidth < 780;
$: smallerScreen = windowWidth < 400;

let getNumberSuperscript = (number) => {
    if (number > 10 && number < 14) return "th"; //eleventh, twelfth, thirteenth
    switch (number % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

</script>

<svelte:window bind:innerWidth={windowWidth}/>
<div class="locator-badge {smallScreen && !smallerScreen ? 'render-low' : "render-high"} {smallerScreen ? 'render-full': ''}">
    <div class="location">
        <div class="left-stuff"> 
            <div class="color-bar" style="background-color: {hoverData.hoverColor};"></div>
            <div class="location-text">
                <div>CENSUS TRACT: <span class="yellow-underline">{hoverData.hoverTract}</span></div>
                <div>{(hoverData.hoverCounty == "District Of Columbia"|| hoverData.hoverStateName == "District Of Columbia")? "District of Columbia" : hoverData.hoverCounty + ", " + hoverData.hoverStateName}</div>
            </div>
        </div>
       {#if !smallerScreen}
        <div class="openclose" on:click={()=> opened = !opened} on:keypress={()=>opened = !opened}
            style="background-image: url({opened? iconClose : iconOpen});"></div>
        {/if}
        
    </div>
    <div class="index {opened ? 'padded' : ''}">
        {#if !hoverData.weHaveData && opened}
            <div class="color-bar" style="background-color: {hoverData.hoverColor};"></div>
            <div class="index-num">{hoverData.erapIndex}</div>
            <div class="no-data">Data are not displayed for census tracts that have no extremely low–income renters</div>
        {:else if opened}
            <div class="color-bar" style="background-color: {hoverData.hoverColor};"></div>
            <div class="index-num">{hoverData.erapIndex}<span class="small-text">{getNumberSuperscript(hoverData.erapIndex)}</span></div>
            <div class="index-info">
                <div class="title">Emergency Rental Assistance Priority Index percentile</div>
                <div class="where">among {hoverData.hoverStateName} tracts</div>
            </div>
            
        {/if}
    </div>
    {#if smallerScreen}
    <div class="chevron" on:click={()=> opened = !opened} on:keypress={()=>opened = !opened}
        style="background-image: url({opened? iconClose : iconOpen});"></div>
    {/if}

</div>

<style>
    .locator-badge{
        position: absolute;
        z-index: 2;
        width: 360px;
        cursor: default;
    }

    .render-high {
        top: 10px;
        right: 15px;
    }

    .render-low{
        top: 70px;
        left: 15px;
    }

    .render-full {
        top: 70px;
        width: 100%;
        right: 0px;
        left: 0px;
    }

    .location{
        display: flex;
        font-size: 14px;
        font-weight: bold;
    }

    .location-text {
        margin: 5px;
    }

    .color-bar{
        width: 25px;
        flex-shrink: 0;
    }

    .left-stuff{
        display: flex;
        width: 100%;
        gap: 5px;
        background-color: white;
        padding: 1px;
    }

    .openclose {
        width: 55px;
        flex-shrink: 0;
        background-repeat: no-repeat;
        background-size: 15px 15px;
        background-position: center;
        height: 55px;
        margin-left: 3px;
        background-color: white;
        cursor: pointer;
    }

    .chevron {
        width: 30px;
        height: 30px;
        background-repeat: no-repeat;
        background-size: 15px 15px;
        background-position: center;
        border: 1px solid gray;
        border-radius: 15px;
        position: absolute;
        right: 15px;
        bottom: -15px;
        cursor: pointer;
        background-color: white;
    }

    .chunk{
        display: inline-block;
    }

    .yellow-underline{
        border-bottom: 2px solid #FDBF11;
    }

    .index {
        display: flex;
        margin-top: 3px;
        background-color: white;
    }

    .padded {
        padding: 1px;
    }

    .index-num{
        width: 60px;
        padding-top: 5px;
        flex-shrink: 0;
        font-size: 26px;
        text-align: center;
        font-weight: bold;
    }

    .small-text{
        vertical-align: super;
        font-size: 16px;
        text-transform: lowercase;
    }

    .index-info {
        padding: 8px;
    }

    .title {
        font-size: 16px;
    }

    .where {
        color: darkgrey;
        text-transform: uppercase;
        font-size: 12px;
    }

    .no-data{
        font-size: 16px;
        padding: 5px;
    }

</style>