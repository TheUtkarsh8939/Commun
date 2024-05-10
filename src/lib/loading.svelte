<style>
    main{
        position: absolute;
        height: 100vh;
        width: 100vw;
        background-color: rgba(0, 0, 0, 0.849);
    }
    .ovr{
        height: 100vh;
        width: 100vw;
        background-image: 
            linear-gradient(to right, rgba(0, 255, 208, 0.427) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 234, 0.448) 1px, transparent 1px);;
        background-size: 7.5rem 7.5rem;
        background-position: center center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .mask{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .loading{
        color:rgb(0, 174, 255);
        font-size:50px;
        font-family: "Vibur";
    }

</style>
{#if isOpen}
<main>
    <div class="ovr" transition:blur={{duration:200}}>
        <div class="mask">
            <img src="./load.gif" alt="">
            <span class="loading">Loading</span>
        </div>
    </div>
</main>
{/if}
<script>
    import {blur} from "svelte/transition"
    export let isOpen = false
</script>