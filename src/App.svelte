<script lang="ts">
  // Importing neccasry components
  import Rd from "./redirect.svelte"
  import Router, {location, link} from 'svelte-spa-router'
  import Pwd from "./pwdasking.svelte"
  import Header from "./lib/header.svelte"
  import Chat from "./chat.svelte"
  import {initializeApp} from "firebase/app"
  import {config} from "./fbaseconfig"
  import {getFirestore} from "firebase/firestore"
  import signin from "./signin.svelte"
  import mplace from "./marketplace.svelte"
  import mpage from "./mpage.svelte"
  let app = initializeApp(config);
  let db = getFirestore(app);

  // Registering Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
  }
  //Asking Password
  async function askpwd() {
    let cookietosplit = `|${document.cookie}`;
    let splitedCookie = cookietosplit.split("|");
    if (splitedCookie.length >= 2) {
      let islogedin = splitedCookie[1]
      if (islogedin !== "isLogined=verfor934") {
        window.location.href = "/#/AskPwd"
        } else {
          
        }
      }
  }
  askpwd();
</script>

<Router routes={{
  '/': Rd,
  '/chat/:group': Chat,
  "/askpwd": Pwd,
  "/signin": signin,
  "/marketplace":mplace,
  "/marketplacepage/:id":mpage
}}/>


