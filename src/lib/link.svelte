<script>
  export let isopen;
  let oldisopen = "true";
  window.onload = () => {
    setInterval(() => {
      if (isopen !== oldisopen) {
        if (isopen == "false") {
          document.getElementById("linkcont").style.height = "0px";
        } else {
          document.getElementById("linkcont").style.height = "40%";
        }
      }
      oldisopen=isopen
    },500);
  };
</script>

<div class="linkcont" id="linkcont">
  <div class="row" id="r1"></div>
  <div class="row" id="r2"></div>
  <div class="row" id="r3"></div>
</div>

<style>
  .linkcont {
    border-radius: 25px 0px 0px 0px;
    right: 0px;
    position: absolute;
    height: 40%;
    top: auto;
    bottom: 80px;
    width: 250px;
    z-index: 3;
    background-color: hsl(239, 96%, 9%);
  }
</style>
