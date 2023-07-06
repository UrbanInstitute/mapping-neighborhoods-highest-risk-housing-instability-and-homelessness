<script>
//imports 

//exports
export let subIndex;
export let NAFootnote;

$: NAFootnote = findNA(subIndex)

let findNA = (ind) => {
    for (let index of ind){
        if (index[0] == "NA"){
            return true;
        }
    }
    return false;
}

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

<div class="subindex">
{#each subIndex as subInfo, i}
    <div class={i ==0 ? "subindex_header" : "subindex_item"}>
        {#if subInfo[0] == "NA"}
        <div class="index-number">{subInfo[0]}*</div>
        {:else}
        <div class="index-number">{subInfo[0]}<span class="small-text">{getNumberSuperscript(parseInt(subInfo[0]))}</span></div>
        {/if}
        <div class="index-title">{subInfo[1]}</div>
    </div>
{/each}
</div>

<style>
    .subindex {
        margin: 10px 0px 20px 0px;
        width: 48%;
        display: inline-block;
        vertical-align: top;
        margin-right: 15px;
    }

    .subindex_header{
        background-color: #f5f5f5;
    }

    .subindex_header, .subindex_item{
        display: flex;
        align-items: baseline;
    }

    .index-number, .subindex_header{
        font-weight: bold;
    }

    .index-number {
        display: inline-block;
        width: 60px;
        flex-shrink: 0;
        text-align: center;
    }

    .small-text{
        font-size: 14px;
        vertical-align: super;
    }
    
    .index-title{
        display: inline-block;
    }

    .subindex_item:not(:last-child){
        border-bottom: 1px solid #D6D5D5;
        padding: 4px 0;
    }

    @media screen and (max-width: 780px){
        .subindex{
            display: block;
            width: 99%;
        }
    }

    /*@media screen and (min-width: 780px){
        .subindex:last-of-type{
            float: right;
            vertical-align: top;
        }
    }*/

</style>