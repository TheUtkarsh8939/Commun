<script lang="ts">
  export let isOpen: boolean;
  let opencounter: number = 0;
  let open: () => void = () => {
    opencounter++;
    if (opencounter % 2 == 0) {
      isOpen = false;
    } else {
      isOpen = true;
    }
  };
</script>

<button
  on:click={open}
  class="Menu flex flex-col items-center w-12 bg-gray-950"
>
  <div class="line rounded bg-white mt-5 h-1 w-4/5"></div>
  <div class="line rounded bg-white mt-1 h-1 w-4/5"></div>
  <div class="line rounded bg-white mt-1 h-1 w-4/5"></div>
</button>

<style>
  .line {
    box-shadow:
      0px 0px 5px #fff,
      0px 0px 10px #fff;
  }
  .Menu {
    height: calc(100vh - 110px);
  }
  @media only screen and (min-width: 900px) {
    .Menu {
      display: none;
    }
  }
</style>
