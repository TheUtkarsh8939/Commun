<script>
    export let content,toshow;
    if (toshow === "false"){
        document.getElementById("ann-border").style.display = "none"
    }
    function close() {
        document.getElementById("ann-border").style.opacity = "0"
    }
    setTimeout(() => {
        document.getElementById("ann-border").style.opacity = "0"
    }, 10000);
</script>
<div class="ann-border" id="ann-border">
  <div class="ann-container">
    <span class="ann"
      >{content}</span
    >
    <button id="close" class="closebutton" on:click={close}>X</button>
  </div>
</div>

<style lang="scss">
    .closebutton{
        position: absolute;
        top:0%;
        right: 10px;
        font-size: x-large;
    }
  .ann-border {
    margin-top: 150px;
    position: absolute;
    z-index: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: auto;
    padding: 1px;
    padding-top: 0px !important;
    background: linear-gradient(
      to right,
      red,
      yellow,
      green,
      blue,
      purple,
      violet
    );
    transition: 1s all;
  }
  .ann-container {
    border-radius: 5px;
    height: auto;
    width: 100%;
    background-color: rgb(2, 2, 6);
    color: white;
    padding:10px;
  }
</style>
