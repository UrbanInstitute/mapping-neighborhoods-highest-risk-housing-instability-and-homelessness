<script>
//imports 

//exports
export let hoverData;

let myHeight;

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

<div class="locatorIndexTitle" bind:clientHeight={myHeight}>
    {#if hoverData.weHaveData}
        <div class="color-bar" style="background-color: {hoverData.hoverColor}; "></div>
        <div class="location">
            <div class="county">{hoverData.hoverCounty == "District of Columbia" ? "District of Columbia" : hoverData.hoverCounty + ", " + hoverData.hoverStateName}</div>
            <div class="index">{hoverData.erapIndex}<span class="small-letters">{getNumberSuperscript(parseInt(hoverData.erapIndex))}</span> erap index | <div class="bump">census tract <span class="yellow-underline">{hoverData.hoverTract}</span></div></div>
            <div class="among-tracts">percentile among {hoverData.hoverStateName} tracts</div>
            <div class="eli"><span class="eli-num">{hoverData.hoverELI}</span> <span class="eli-text">extremely low-income renters</span></div>
        </div>
    {/if}
</div>

<style>

    .locatorIndexTitle{
        display: flex;
        gap: 10px;
        text-transform: uppercase;
        margin: 20px 0px;
    }

    .color-bar{
        width: 25px;
    }

    .county{
        color: #696969;
        font-size: 16px;
        font-weight: bold;
    }

    .index{
        font-size: 32px;
        line-height: 36px;
        margin-bottom: 6px;
    }

    .small-letters{
        vertical-align: super;
        font-size: 18px;
        text-transform: lowercase;
    }

    .bump{
        display: inline-block;
    }

    .yellow-underline{
        border-bottom: 3px solid #FDBF11;
    }

    .among-tracts{
        font-size: 16px;
    }

    .eli-num{
        color: #828282;
    }

    .eli{
        font-weight: bold;
        font-size: 14px;
    }

    @media screen and (max-width: 780px){
        .locatorIndexTitle{
            margin-top: 31px;
        }
        .index{
            margin-bottom: 16px;
        }
    }

</style>