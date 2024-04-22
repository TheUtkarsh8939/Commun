<script lang="ts">
  import Nav from "./lib/header.svelte";
  import UserMarket from "./lib/usermarket.svelte";
  import * as Card from "$lib/components/ui/card/index.ts";
  import { getFirestore, collection, getDocs } from "firebase/firestore";
  import { initializeApp } from "firebase/app";
  import { config } from "./fbaseconfig";
  import {blur} from "svelte/transition"
  import { sineIn } from "svelte/easing";
  let arrOfData = [];
  const app = initializeApp(config);
  const fs = getFirestore(app);
  const collectionReference = collection(fs, "badges");
  async function getMarket() {
    let arrayOfData = [];
    const snapshot = await getDocs(collectionReference);
    snapshot.forEach((doc) => {
      let data = JSON.parse(JSON.stringify(doc.data()))
      data.id = doc.id
      arrayOfData.push(data);
    });
    return arrayOfData;
  }
  getMarket().then((data) => {
    arrOfData = data;
  });
  let badges;
  let username;
  let cn;
  const cookie = document.cookie;
</script>

<svelte:head>
  <link rel="stylesheet" href="pg.css">
</svelte:head>
<main class="dark" in:blur="{{duration:800, easing:sineIn}}">
  <Nav bind:nameoftheuser={username} bind:coins={cn} bind:batches={badges}/>
  <div class="svgBadge" style="display:none"></div>
  <UserMarket {username} bind:badges={badges} bind:coins={cn} />
    <div class="marketitems">
      {#each arrOfData as { elem, name, price, id }}
      <a href="#/marketplacepage/{id}">
        <Card.Root class="w-[250px] m-5 pt-3" style="--hw:120px">
          <Card.Content>
            <div class="contentOfSvg" id="cnt">
              {@html elem}
            </div>
          </Card.Content>
          <Card.Header>
            <Card.Title>{name}</Card.Title>
            <Card.Description>{price}</Card.Description>
          </Card.Header>
        </Card.Root>
    </a>
      {/each}
    </div>
  
</main>

<style lang="scss">
  .marketitems {
    display: flex;
    flex-wrap: wrap;
    width: 100vw;
    margin: 0;
  }
  main {
    overflow-y: scroll;
    overflow-x: hidden;

    background-color: var(--body-color);
    height: 100vh;
    width: 100vw;
  }
  main::-webkit-scrollbar {
    width: 3px;
  }

  /* Track */
  main::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  main::-webkit-scrollbar-thumb {
    background: linear-gradient(
      transparent,
      mediumslateblue,
      mediumslateblue,
      mediumslateblue,
      transparent
    );
  }

  /* Handle on hover */
  main::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(transparent, mediumslateblue, transparent);
  }
  .contentOfSvg {
    height: 100px;
    width: 100px;
  }
</style>
