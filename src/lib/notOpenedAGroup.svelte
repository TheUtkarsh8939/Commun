<main>
  <div class="logo">
    <img src="./logo.png" alt="logo" />
  </div>
  <div class="text">Welcome to Sparshak</div>
  <div class="how-to-join">
    To Join Click on the Top-Right button on navbar and then click on Join A
    group, eneter the user ID and you are joined to the group
  </div>
</main>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Acme&display=swap");
  main {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
  }
  .logo {
    height: 200px;
    aspect-ratio: 1/1;
  }
  .lines {
    background-color: var(--text-color);
    height: 2px;
    width: 120px;
    border-radius: 20px;
  }
  #second-line {
    rotate: 90deg;
  }
  .text {
    margin-top: 40px;
    font-family: "Vibur";
    font-size: 2.5rem;
    color:var(--text-color);
  }
  .how-to-join {
    display: flex;
    text-align: center;
    font-family: "Acme";
    flex-direction: column;
    font-weight: 400;
    font-style: normal;
    color:var(--text-color);
  }
</style>
