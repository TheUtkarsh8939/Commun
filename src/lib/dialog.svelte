<script>
  import { onMount } from "svelte";
    import {blur} from "svelte/transition";

    export let isOpened = false;
    export const open = _ => {
        isOpened = !isOpened;
    }
</script>
{#if isOpened}
<div class="ovr"  transition:blur="{{duration:800}}">
    <div class="dialog">
      <slot/>
    </div>
</div>
{/if}
<style>
    .ovr{
        position: absolute;
        height: 100vh;
        width: 100vw;
        background-color: rgba(0, 0, 0, 0.46);
        z-index:12;
        display:flex;
        align-items: center;
        justify-content: center;
    }.dialog{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        height: auto;
        width: 80%;
        background-color: black;
        border:1px solid white;
        box-shadow: 0px 0px 7px  white,
        0px 0px 15px white,
        0px 0px 23px white,
        0px 0px 17px aqua,
        0px 0px 23px aqua,
        0px 0px 33px aqua,
        0px 0px 50px aqua;
    }
    @media only screen and (min-width: 548px) {
        .dialog{
            width: 438px;
        }
    }
</style>