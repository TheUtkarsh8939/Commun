<script lang="ts">
  import { draw } from "svelte/transition";
  import { initializeApp } from "firebase/app";
  import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
  import { config } from "./../fbaseconfig";
  import { getAuth, signOut } from "firebase/auth";
  import ProfileCoins from "./profilecoins.svelte";
  import Dialog from "./dialog.svelte";
  import NotOpenedAGroup from "./notOpenedAGroup.svelte";
  import {Switch}  from "$lib/components/ui/switch/index.ts";
  import { onMount } from "svelte";
  let app = initializeApp(config);
  let db = getFirestore(app);
  let gname = "";
  let islogedin = true;
  let isLight
  export let theme = "dark"
  let toStr = (bool: boolean) => {
    if (bool == false){
      return "false"
    }else{
      return "true"
    }
  }
  $: {
    window.localStorage.setItem("isLight", toStr(isLight))
    console.log(window.localStorage.getItem("isLight"))
    if (isLight) {
      theme = 'light';
    } else {
      theme = 'dark';
    }
  }
  export let batches: string[];
  export let coins;
  export let nameoftheuser = "";
  let isDiagOpened = false;
  let toBool = (arg)=> {
    if (arg == "false"){
      return false
    }else{
      return true
    }
  }
  if (window.localStorage.getItem("isLight") == null){
    window.localStorage.setItem("isLight","false")
  }
  isLight = toBool(window.localStorage.getItem("isLight"))
  console.log(toBool(window.localStorage.getItem("isLight")) + ":" + window.localStorage.getItem("isLight"))
 
  //Function to Join a group
  const hasKey = (obj, key) => Object.keys(obj).includes(key);
  async function join() {
    let temp;
    let refofmetadata = doc(db, "metadata", "groups");
    let docSnap = await getDoc(refofmetadata);
    if (docSnap.exists()) {
      if (hasKey(docSnap.data(), gname)) {
        let mem = docSnap.data()[gname].members;
        mem.push(splitedCookie[3].split("id=")[1]);
        temp = docSnap.data();
        Object.assign(temp[gname].members, mem);
        await setDoc(refofmetadata, temp).then(() => {
          window.location.href = "#/";
        });
      } else {
        alert("Group does not exist");
      }
    } else {
      alert("A major error has occurd. Please inform the developer of the");
    }
  }
  //Open Join Menu
  let opnjoinmenu = () => {
    document.getElementById("jagovr").style.visibility = "visible";
    document.getElementById("jagovr").style.scale = "1";
  };
  //Close Join Menu
  let closejn = () => {
    document.getElementById("jagovr").style.visibility = "hidden";
    document.getElementById("jagovr").style.transform = "scale(0)";
  };
  let isvisbile = false;
  let cookietosplit = `|${document.cookie}`;
  let splitedCookie = cookietosplit.split("|");
  if (splitedCookie.length >= 3) {
    let islogedin = splitedCookie[1];
    nameoftheuser = splitedCookie[2].split("name=")[1];
    if (islogedin !== "isLogined=verfor934") {
      isvisbile = false;
    } else {
      isvisbile = true;
    }
  }
  //Open User Dropdown
  let userDropdown = false;
  let Dropdown = () => {
    userDropdown = !userDropdown;
  };
  export let userdata;
  //Sign out
  const auth = getAuth();
  const signout = () => {
    signOut(auth);
    document.cookie += ";max-age=0";
    window.location.href = "./#/AskPwd";
  };
  let usr = auth.currentUser
  let profPic
  if (usr){
    profPic = usr.photoURL
  }else{
    profPic = null
  }
  let triggerDiag;
  let newGroupName
  let newGroupId
  async function CreateGroup() {
    const refrence = doc(db,"metadata", "groups")
    const docData = await getDoc(refrence)
    if (newGroupName == undefined) {alert("Please Enter The Group's Name"); return 0}
    let tempData = JSON.parse(JSON.stringify(docData.data()))
    if(tempData[newGroupId] !== undefined){alert("Id already taken"); return 0}
    let groupObj = {
      name: newGroupId,
      pname: newGroupName,
      members:[auth.currentUser.uid],
      logo: "",
      availablefor: "all"
    }
    tempData[newGroupId] = groupObj 
    setDoc(refrence, tempData).then(_ => window.location.reload())
  
  }
</script>

<Dialog bind:this={triggerDiag}>
  <button
    on:click={triggerDiag.open()}
    class="h-[30px] relative left-[45%] rotate-45 w-[30px] flex items-center justify-center"
  >
    <div class="x-line absolute w-[20px] h-[2px] rotate-90 bg-white"></div>
    <div class="x-line absolute w-[20px] h-[2px] bg-white"></div>
  </button>
  <input bind:value={newGroupName}
  placeholder="Group's Name"
    type="text"
    class="groupnametocreate h-[40px] w-[80%] rounded-3xl bg-black border border-cyan-400 mt-11 mb-11 p-2 text-lg font-[vibur] text-white"
  />
  <input bind:value={newGroupId}
  placeholder="Group's ID"
  type="text"
  class="groupnametocreate h-[40px] w-[80%] rounded-3xl bg-black border border-cyan-400 mb-11 p-2 text-lg font-[vibur] text-white"
/>
  <button on:click={CreateGroup}
    class="h-[50px] w-[100px] font-[vibur] text-2xl text-white mb-7 rounded-xl border-[2px] border-cyan-400"
    >Create</button
  >
</Dialog>
<div id="jagovr">
  <div class="sendui" id="jag">
    <h2>Join A group</h2>
    <button class="close" id="cls" on:click={closejn}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="50"
        height="50"
        viewBox="0,0,256,256"
      >
        <defs
          ><linearGradient
            x1="32"
            y1="5"
            x2="32"
            y2="59.134"
            gradientUnits="userSpaceOnUse"
            id="color-1_43980_gr1"
            ><stop offset="0" stop-color="#12ff00"></stop><stop
              offset="1"
              stop-color="#00f0ff"
            ></stop></linearGradient
          ><linearGradient
            x1="32"
            y1="5"
            x2="32"
            y2="59.134"
            gradientUnits="userSpaceOnUse"
            id="color-2_43980_gr2"
            ><stop offset="0" stop-color="#12ff00"></stop><stop
              offset="1"
              stop-color="#00f0ff"
            ></stop></linearGradient
          ><linearGradient
            x1="32"
            y1="20.833"
            x2="32"
            y2="42.698"
            gradientUnits="userSpaceOnUse"
            id="color-3_43980_gr3"
            ><stop offset="0" stop-color="#00e8ff"></stop><stop
              offset="1"
              stop-color="#00ff32"
            ></stop></linearGradient
          ></defs
        ><g
          fill="none"
          fill-rule="nonzero"
          stroke="none"
          stroke-width="1"
          stroke-linecap="butt"
          stroke-linejoin="miter"
          stroke-miterlimit="10"
          stroke-dasharray=""
          stroke-dashoffset="0"
          font-family="none"
          font-weight="none"
          font-size="none"
          text-anchor="none"
          style="mix-blend-mode: normal"
          ><g transform="scale(4,4)"
            ><path
              d="M32,58c-14.337,0 -26,-11.663 -26,-26c0,-14.337 11.663,-26 26,-26c14.337,0 26,11.663 26,26c0,14.337 -11.663,26 -26,26zM32,8c-13.233,0 -24,10.767 -24,24c0,13.233 10.767,24 24,24c13.233,0 24,-10.767 24,-24c0,-13.233 -10.767,-24 -24,-24z"
              fill="url(#color-1_43980_gr1)"
            ></path><path
              d="M32,52c-11.028,0 -20,-8.972 -20,-20c0,-11.028 8.972,-20 20,-20c11.028,0 20,8.972 20,20c0,11.028 -8.972,20 -20,20zM32,14c-9.925,0 -18,8.075 -18,18c0,9.925 8.075,18 18,18c9.925,0 18,-8.075 18,-18c0,-9.925 -8.075,-18 -18,-18z"
              fill="url(#color-2_43980_gr2)"
            ></path><path
              d="M40.692,24.724l-1.417,-1.417c-0.41,-0.41 -1.076,-0.41 -1.486,0l-5.789,5.79l-5.789,-5.789c-0.41,-0.41 -1.076,-0.41 -1.486,0l-1.417,1.417c-0.41,0.41 -0.41,1.076 0,1.486l5.789,5.789l-5.789,5.789c-0.41,0.41 -0.41,1.076 0,1.486l1.417,1.417c0.41,0.41 1.076,0.41 1.486,0l5.789,-5.789l5.789,5.789c0.41,0.41 1.076,0.41 1.486,0l1.417,-1.417c0.41,-0.41 0.41,-1.076 0,-1.486l-5.789,-5.789l5.789,-5.789c0.411,-0.411 0.411,-1.076 0,-1.487z"
              fill="url(#color-3_43980_gr3)"
            ></path></g
          ></g
        >
      </svg></button
    >
    <input
      bind:value={gname}
      type="text"
      class="jagfield"
      placeholder="Enter Group ID"
    />
    <button class="jag" id="jng" on:click={join}>Join</button>
  </div>
</div>
<div id="wrapper">
  <!-- Header -->
  <div class="usermenu" class:hgt-out={!userDropdown}>
    <div class="content hi"><img class="rounded-full h-[45px] mr-1 aspect-square" src={profPic} alt="">{nameoftheuser}</div>
    <button class="content" on:click={opnjoinmenu}>
      <img
        alt="Join"
        src="data:image/png;base64,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"
      />
      <h3 class="aqua">Join A group</h3>
    </button>
    <a class="content" href="#/marketplace">
      <img
        alt="Marketplace"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACaElEQVR4nO2Wz2vTYBjH30uTHrzJ7E3/BHeel02QXWT0IqgnNwZ63MWboN4c021SPbfMWU8mGR5qrTVJm4KUYebBtmy9SJlre/SiK8gjT7DQ5n1j3y2FvW3fB76QpN/k+3zeH2kIkSVL1niWWz0ou7U6iKAv1frnkwMI0Ljbo1MDaB+LkEjroOUdrnPhABJpAza3NXjxxuA6Fw5Ayztek3p3xAecCwfgCiIyUQBgRqbBVqFXv4uX4MG7q31azcz3ebry+7pieVcz85QPsyivGZnmB7DUDf8DvjtzVNBWbiE0wFZugfJhFuW11A2+5ndJBCyl7X+AbcepoIwVDw2QsejnYhYNoLSxt8EABSXOCnqZvU4FlQvhZ6BcoGcAs1he7I1n+eg86x+174TfA/sOvQcC94Gl6gNG/9wUWGqHWv/FWWZI05kJDdB0ZphezGQAdLDHYABbWWGF7LxnhxybsdAAx2aM6cVM5jKylZVggLxyxHzV7VxhN2RGQwOAGWV6MZPpzyutYIAUOYIUgV510hdgMTELN9Yu92kpMef9Rvtjw/O/nqL8kCKHwQBJ8sx/Qyu7DOv6Iypg3XgMrQ93qYBm7t7Q/O3sEg2QJGv/A4h6EEny49er83Cg3YK9SgV2KzUvBEcKhcd4ba9a9ZrCkUXhMV4blv9r5RvU394E7AV7ghR5Cs+JSnjK+FQC1Fl/Axn/+uBqeqwBrt1e5pa/icbPPyeWKxrAxSeH3GpIACJnAOQSqslNXBrPt9Di/YejDbC5rU0mQEOUf+I7p1hCI/8t5EqAkpwBGNklZAgiMnEAsmTJIiNRfwEz1k8acryjBQAAAABJRU5ErkJggg=="
      />
      <h3 class="gold">Marketplace</h3>
    </a>
    <button on:click={signout} class="content">
      <img
        alt="Sign Out"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEaklEQVR4nO2Z20+bZRzHC8wegHJ420IF53Hq2K2JUW+MWWJcTJw33uo/oTBWeuTQMmBsOOdZNyHZ3+CFMXrhdHRbmBsrvKVAS19YC8yt6O3XPM/TF3p43/K0fZoY01/yuf98v3l+v75JDYb61Kc+h87x2b13T8xlNk7M7aFvNoPjPzBevvqY8tIVwiO8+D3j2Hd/UV74lvAQz3/zEM99TdjFs18RdvDMl4ynv9imHP2ckMZTlwmpRO/l1CmDqOmbyyT6Znnki8WZ/K6u/FEqvp0VT6P3M0IKT376IC4uwGwmR56/9UL5A/EdjdbTVJzQc4kGgLAA5TwZntYL5XuzrRNxVV5wgMc58o/25XlaV+XzWy9+Mj1UnokTnDNb4gKU+2SY+O4hi6rdunOGyXdfFBig2kVV5bVbT2nKd1/cFBeg+kXd1lzUnkta4lvourBJERpA+7ZXv6hOHXnHtMAAom671qI6s/Jd5zcoRNwxrcB+XhEXoNpFzb3tWq07JtfhGI/CHpRhn1ij8kID1HJRuy5swh6KwhZYgOQJQwrcgTQeg20qKTZAebc9pftktN66PSRT+bfv/oPXfkpD8i+gMxQTF4D/I6z8RXVMK7AFZXS65/G+Asobv+6gw7cgLkD5i5rSXtQCcXv2rUtjy3kBCK//soM3gSNCAnB/hM0ocE6twjkZQ/cEYQVd5xhkSemihggybd0WlJn86DI6hvIDEE4ruCYkBO9tJ/LdwUU4ArfhCNyCw8+w+25SbN4wW1RPmDbe6Z6n4oR2V3EAYSF4bztpnoifvL2nKVMxSVz1Ao0VB+BdVPJkSONC5RUBIXhvO33r/pu1CaBQPqo4AM9HGF1SX+0CvKfgw4oC8N52EsDmrU2A00lcqfgJ8d529Rf1rVuZ/448Ge5f1FAUUuDPovNIaHPdoFjPEv5A6yCj5czvaB5gaMoruPYB0GSoZvQ+wgp/UW0TcUjks2CU/DgtoWOE0T4SobQNR2AN3Ke0+gmLaPExLAPXayNPplTr+/JTSYo0mUTnxAal4xwhgfZxRlsoTrEG1ymtY4Q1NHvvwdKfH+DVn9MQIk+mlHyuuDS5kSOfyJFXxeM54utoGV2jNHvyAxB5y2BY3MccT+uF8sWt68iPrNIA5k+u4+TC33jlxy2YB+Zhci+KDaAlz8STJVsvfDIH4kzeMrwKi/sezP03YPr4N5j6w1Te6FsRF4C3dVX+8NZz5IdjMHsiMLnuwuS6A+PQfSr/hDcqLkAped5FzX0yTHwV5kCMYvLHYPLJMHrlfXmhAWxTCveiqvKlWy+Q96/kiR/xEGSRAQQs6oi+uFFDvsktMID+bY+XfDI8rRuz8kw8SsUJjUPL4gJUdNt15Uu33pSVFxpAf1Hj5S3qIfKNQ0y+wcUQGKCC2667qCslW2+g8kswnF0SF6Ci287ZepO7oHUiriJqrMH1hIhFVeUPxOXi1lUGI+L+5LOGEqesY2uJcm4776I26MmfibwjLEB96vM/nn8BBPCiXyhyXwIAAAAASUVORK5CYII="
      />
      <h3 class="text-emerald-300">Sign Out</h3>
    </button>
    <button class="content" on:click={triggerDiag.open()}>
      <img
        style="height:56px;width:56px"
        alt="Create a new account"
        src="data:image/png;base64,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"
      />
      <h3 class="text-red-600">Create Group</h3>
    </button>
    <div class="content">
      <ProfileCoins bind:data={userdata} bind:coins bind:batches />
    </div>
    <div class="content flex justify-around text-rose-400">
      Light Mode? <Switch class="mr-1" style="box-shadow: 0px 0px 10px white, 0px 0px 20px white;" bind:checked={isLight}/>
    </div>
  </div>
  <header>
    <nav>
      <a href="#/" class="flex items-center h-[100%]"
        ><img class="brand-heading" src="logo.png" alt="" /></a
      >
      <div class="opdiv">
        {#if isvisbile}
          <button
            on:click={Dropdown}
            id="jnbtn"
            class="Menu w-12 bg-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              width="50"
              height="50"
              viewBox="0 0 256 256"
              xml:space="preserve"
            >
              <defs> </defs>
              <g
                style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
                transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
              >
                <path
                  d="M 45 49.519 L 45 49.519 c -7.68 0 -13.964 -6.284 -13.964 -13.964 v -5.008 c 0 -7.68 6.284 -13.964 13.964 -13.964 h 0 c 7.68 0 13.964 6.284 13.964 13.964 v 5.008 C 58.964 43.236 52.68 49.519 45 49.519 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(110,177,225); fill-rule: nonzero; opacity: 1;"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 52.863 51.438 c -2.362 1.223 -5.032 1.927 -7.863 1.927 s -5.501 -0.704 -7.863 -1.927 C 26.58 53.014 18.414 62.175 18.414 73.152 v 14.444 c 0 1.322 1.082 2.403 2.403 2.403 h 48.364 c 1.322 0 2.403 -1.082 2.403 -2.403 V 73.152 C 71.586 62.175 63.42 53.014 52.863 51.438 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(110,177,225); fill-rule: nonzero; opacity: 1;"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 71.277 34.854 c -2.362 1.223 -5.032 1.927 -7.863 1.927 c -0.004 0 -0.007 0 -0.011 0 c -0.294 4.412 -2.134 8.401 -4.995 11.43 c 10.355 3.681 17.678 13.649 17.678 24.941 v 0.263 h 11.511 c 1.322 0 2.404 -1.082 2.404 -2.404 V 56.568 C 90 45.59 81.834 36.429 71.277 34.854 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(113,212,86); fill-rule: nonzero; opacity: 1;"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 63.414 0 c -7.242 0 -13.237 5.589 -13.898 12.667 c 8 2.023 13.947 9.261 13.947 17.881 v 2.385 c 7.657 -0.027 13.914 -6.298 13.914 -13.961 v -5.008 C 77.378 6.284 71.094 0 63.414 0 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(113,212,86); fill-rule: nonzero; opacity: 1;"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 13.915 73.152 c 0 -11.292 7.322 -21.261 17.677 -24.941 c -2.861 -3.029 -4.702 -7.019 -4.995 -11.43 c -0.004 0 -0.007 0 -0.011 0 c -2.831 0 -5.5 -0.704 -7.863 -1.927 C 8.166 36.429 0 45.59 0 56.568 v 14.444 c 0 1.322 1.082 2.404 2.404 2.404 h 11.511 V 73.152 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(240,88,47); fill-rule: nonzero; opacity: 1;"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
                <path
                  d="M 26.536 32.932 v -2.385 c 0 -8.62 5.946 -15.858 13.947 -17.881 C 39.823 5.589 33.828 0 26.586 0 c -7.68 0 -13.964 6.284 -13.964 13.964 v 5.008 C 12.622 26.635 18.879 32.905 26.536 32.932 z"
                  style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(240,88,47); fill-rule: nonzero; opacity: 1;"
                  transform=" matrix(1 0 0 1 0 0) "
                  stroke-linecap="round"
                />
              </g>
            </svg>
            <!-- <img src="data:image/png;base64,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"> -->
          </button>
        {/if}
      </div>
    </nav>
  </header>
</div>

<style lang="scss">
  .hgt-out {
    height: 0px !important;
    opacity: 0;
    visibility: hidden;
  }
  .aqua {
    color: aqua;
  }
  .gold {
    color: gold;
    display: flex;
    height: 100%;
    width: 100%;
  }
  .hi {
    background: linear-gradient(
      90deg,
      #ffebb2,
      #ffebb2,
      #e9a89b,
      #d875c7,
      #912bbc,
      #ffebb2,
      #e9a89b,
      #912bbc
    );
    background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200%;
    animation: moveIt 5s ease-in infinite;
  }
  @keyframes moveIt {
    from {
      background-position: bottom left;
    }
    to {
      background-position: top right;
    }
  }
  .content {
    height: calc(100% / 7);
    border-bottom: 1px solid rgb(86, 86, 86);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 10px;
    h3 {
      margin-left: 20px;
    }
    font-family: "Vibur";
    font-size: 30px;
  }
  .usermenu {
    height: 380px;
    display: flex;
    flex-direction: column;
    --widthofit: 250px;
    transition: 2s all;
    position: absolute;
    background-color: var(--usrmenu-bg);
    width: var(--widthofit);
    top: 110px;
    left: calc(100vw - var(--widthofit));
    z-index: 9;
    border-radius: 0px 0px 20px 20px;
    box-shadow:var(--usrmenu-shadow);
  }
  .Menu {
    transform: translateY(-10px);
  }
  #jagovr {
    transition: 2s all;
    height: 100vh;
    width: 100vw;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.306);
    z-index: 10;
    display: grid;
    place-items: center;
    visibility: hidden;
    scale: 0;
  }
  .close {
    margin-left: auto;
    margin-right: 20px;
    margin-top: -50px;
  }
  #jag {
    height: 500px;
    width: 80vw;
    display: flex;
    flex-direction: column;
    #jng {
      width: 30%;
      font-family: "Vibur";
      font-size: 25px;
      padding: 0;
    }
    h2 {
      margin-top: 20px;
      font-size: 30px;
      font-family: "Vibur";
      text-shadow:
        0px 0px 3px white,
        0px 0px 15px white,
        0px 0px 24px white,
        0px 0px 48px white;
    }
    input,
    .jag {
      padding: 10px;
      margin-top: 35%;
      height: 40px;
      width: 80%;
      border: 1px solid aqua;
      border-radius: 20px;
      background-color: black;
      box-shadow:
        0px 0px 4px white,
        0px 0px 12px white,
        0px 0px 20px white,
        0px 0px 24px white,
        0px 0px 46px aqua,
        0px 0px 72px aqua,
        0px 0px 20px aqua,
        0px 0px 40px aqua;
    }
  }
  @mixin center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  header {
    margin-top: 0px;
    height: 110px;
    top: 0;
    position: sticky;
    width: 100vw;
    background-image: linear-gradient(
      to right,
      red,
      yellow,
      green,
      blue,
      purple,
      violet
    );
    z-index: 2;
  }
  nav {
    position: sticky;
    top: 0;
    width: 100vw !important;
    display: grid !important;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    // place-items: center;
    color: white;
    background-color: var(--nav-bg);
    align-items: center;
    height: calc(100% - 2px);
    .brand-heading {
      margin-top: 10px;
      margin-left: 5px;
      transform: translateY(-10px);
      height: 90px;
    }
    .opdiv {
      display: flex;
      margin-left: auto;
      margin-right: 20px;
    }
    z-index: 2;
  }
  @media only screen and (min-width: 513px) {
    #jag{
      width: 400px;
      max-height: 50vh !important;
      height: 30vh !important;
    }
  }
</style>
