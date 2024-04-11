<script>
  export let coins;
  let change = false;
  const changeChange = () => {
    change = !change;
    console.log(change);
  };
</script>

<div class="coinshow">
  {#if change}
    <div id="ovr" style="height:100vh !important">
      <div class="ad">
        <button class="lines cut" on:click={changeChange}>
          <div class="line"></div>
          <div class="line line2"></div>
        </button>
        <ins
        style="display:block;"
          class="adsbygoogle"
          data-ad-client="ca-pub-9239593704319891"
          data-ad-slot="5085659691"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
    </div>
  {/if}
  <img
    src="data:image/png;base64,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"
  />
  {coins}
  <button class="lines" on:click={changeChange}>
    <div class="line"></div>
    <div class="line line2"></div>
  </button>
</div>

<style lang="scss">
  .cut {
    rotate: 45deg;
    position: relative;
    top: 20px;
    left: calc(50vw - 30px);
    scale: 2;
    z-index: 100;
  }
  .ad {
    margin-top: 50%;
    height: 40vh;
    width: 50vw;
    background-color: black;
    border: 1px solid white;
    border-radius: 20px;
    margin-bottom: 50vh;;
  }
  #ovr {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    height: 100vh !important;
    width: 100vw;
    background-color: transparentize(#000000, 0.7);
  }
  .coinshow {
    display: flex;
    align-items: center;
    height: 50px;
    font-size: 30px;
    color: gold;
    justify-content: center;
    width: 50vw;
    img {
      height: 50px;
      width: 50px;
    }
    .lines {
      display: grid;
      margin-left: 10px;
      place-items: center;
    }
    .line {
      background: linear-gradient(to right, #d5dee7, #e8ebf2, #e2e7ed);
      height: 2px;
      width: 15px;
      position: absolute;
    }
    .line2 {
      transform: rotate(90deg);
    }
  }
</style>
