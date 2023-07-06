<script>
    export let naColor;

    let width = 700;
    $: trueWidth = (width > 700 ? 700 : width) - 40;
    let margin = 7;
    let tMargin = 7; //for text centeredness
    $: w = trueWidth - 2*margin - 3*tMargin; //minus margins and extra text space on the right minus padding


</script>

<div bind:clientWidth={width} class="legend">
    <h5 style="padding-left: 7px;">{width > 400 ? "Emergency Rental Assistance Priority Index" : "ERAP Index"}</h5>
    <svg width={trueWidth + 40} height=60>
        <text x={tMargin} y=15 fill="black" font-size="14px">LOW PRIORITY</text>
        <text x={tMargin} y=55 fill="black" font-size="12px">0</text>
        <rect height = 20 width = {w*.50} x={margin} y=20 fill="#cfe8f3"></rect>
        <text x={0 + w*.5} y=55 fill="black" font-size="12px">50</text>
        <rect height = 20 width = {w*.25} x={w*.50+margin} y=20 fill="#73bfe2"></rect>
        <text x={0 + w*.75} y=55 fill="black" font-size="12px">75</text>
        <rect height = 20 width = {w*.10} x={w*.75+margin} y=20 fill="#46abdb"></rect>
        <text x={0 + w*.85} y=55 fill="black" font-size="12px">85</text>
        <rect height = 20 width = {w*.05} x={w*.85+margin} y=20 fill="#1696d2"></rect>
        <text x={0 + w*.90} y=55 fill="black" font-size="12px">90</text>
        <rect height = 20 width = {w*.05} x={w*.90+margin} y=20 fill="#12719e"></rect>
        <text x={0 + w*.95} y=55 fill="black" font-size="12px">95</text>
        <rect height = 20 width = {w*.05} x={w*.95+margin} y=20 fill="#0a4c6a"></rect>
        <text x={0 + w} y=55 fill="black" font-size="12px">100</text>
        <text x={w - 95} y=15 fill="black" font-size="14px">HIGH PRIORITY</text>

        <rect height = 20 width = {w*.03} x={w + 4*margin} y=20 fill={naColor}></rect>
        <text x={30 + w} y=55 fill="black" font-size="12px">n/a</text>


    </svg>


</div>

<style>
    .legend{
        background-color: rgba(255,255,255,.95);
        z-index: 3;
        padding-top: 5px;
        padding-left: 10px;
        padding-bottom: 16px;
        border-bottom: 1px solid #D6D5D5;
    }

    h5 {
        margin-bottom: 5px;
    }

    @media screen and (min-width: 780px){ /**big screens*/
        .legend{
            position: absolute !important;
            top: 470px;
            left: 15px;
            display: inline-block;
        }
    }

</style>