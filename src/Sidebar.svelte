<script>
//imports 
import { slide } from 'svelte/transition';

import IndexBox from "./IndexBox.svelte";
import LocatorIndexTitle from "./LocatorIndexTitle.svelte";
import iconInfo from './assets/iconInfo.png'

//exports
export let hoverData;

let NAFootnoteOpts = [hoverData.subIndices.length];


</script>

{#if hoverData.weHaveData}
    <div transition:slide >
        <LocatorIndexTitle {hoverData}></LocatorIndexTitle>
        <div class="info">
            <span class="icon" style="background-image: url({iconInfo});"/>
            <h6 class="explanation">All numbers are percentiles, which reflect the census tract’s values relative to all
                other tracts in the state.</h6>
        </div>
        {#each hoverData.subIndices as subIndex, i}
        <IndexBox {subIndex} bind:NAFootnote={NAFootnoteOpts[i]}/>
        {/each}
        {#if NAFootnoteOpts.includes(true)}
        <div class="info footnote">
            <span class="icon"/>
            <h6 class="explanation">*Some geographies do not have complete data for all indicators. We've labeled missing indicators as NA.</h6>
        </div>
        {/if}
    </div>
{/if}

<style>
    .info{
        display: flex;
        gap: 10px;
        margin: 15px 0px;
        align-items: center;
    }

    .explanation{
        font-size: 14px;
    }

    .icon{
        display: inline-block;
        height: 28px;
        width: 20px;
        flex-shrink: 0;
        background-size: 20px 24px;
        background-position: top;
        background-repeat: no-repeat;
    }

    .footnote{
        display: inline-flex;
        width: 45%;
        padding-left: 28px;
        position: relative;
        bottom: 90px;
    }

    @media screen and (max-width: 780px){
        .explanation{
            line-height: 21px;
        }
        .info {
            margin-bottom: 25px;
        }
        .footnote{
            width: 90%;
            position: initial;
            margin-top: 0px;
        }
    }

</style>