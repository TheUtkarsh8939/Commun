<script>
  import { onMount } from "svelte";
  import Coins from "./coinsOnMarket.svelte"
  export let username;
  export let badges;
  export let coins;
  let container;
  const render = (badges) => {
    const child = document.createElement("span");
    child.style.display = "flex";
    badges.forEach((badge) => {
      child.innerHTML += badge;
      container.appendChild(child);
    })

    // Select all SVGs within the appended content
    const svgElements = child.querySelectorAll("svg");

    // Loop through each SVG and set its width and height attributes
    svgElements.forEach((svg) => {
      svg.setAttribute("width", "30px");
      svg.setAttribute("height", "30px");
    });
  };
  const renderWithIf = (badge) => {
    if (Array.isArray(badge)) {
      render(badge)
    }
  }
  $: renderWithIf(badges)
</script>

<div class="steelvorders">
  <div class="uplace">
    <div class="name" bind:this={container}>{username}</div>
    <div class="coins">
      <Coins bind:coins={coins}/>
    </div>
  </div>
</div>

<style lang="scss">
  .uplace {
    width: 100vw;
    height: 210px;
    background-color: var(--usr-market);
    color: var(--text-color);
    font-family: "VIbur";
    display:flex;
    justify-content: space-between;
    .name {
      font-size: clamp(0px, 12vw, 3rem); 
      margin-left: 3px;
      display: flex;
      flex-direction: column;
      width: 50vw;
    }
    .coins{
      width:50vw;
      display: flex;
      justify-content: center;
      text-shadow: var(--usr-market-coin-shadow);
    }
  }
  .steelvorders {
    width: 100vw;
    height: 211px;
    background: linear-gradient(to right, #d5dee7, #e8ebf2, #e2e7ed);
    margin-bottom: 20px;
  }
  @media only screen and (max-width:631px){
    .name{
      font-size:7vw !important;
    }
  }
</style>
