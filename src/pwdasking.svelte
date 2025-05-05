<script lang="ts">
  import Header from "./lib/header.svelte";
  import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
  import { initializeApp } from "firebase/app";
  import { config } from "./fbaseconfig";
  import { blur } from "svelte/transition";
  import {
    onAuthStateChanged,
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInWithCustomToken,
  } from "firebase/auth";
  import { quintIn, sineIn } from "svelte/easing";

  //Vars
  let theme;
  let username;
  let firebase = initializeApp(config);
  let db = getFirestore(firebase);
  const auth = getAuth(firebase);
  const googleProvider = new GoogleAuthProvider();
  //Nessecary interface
  interface token {
    token: string;
  }

  async function addName() {
    if (scode !== "") {
      sub.style.visibility = "hidden";
      name.style.visibility = "hidden";
      name.style.opacity = "0";
      sub.style.opacity = "0";
      username = scode;

      signinwithg.setAttribute("id", "");
    } else {
      alert("Please Enter Your Name");
    }
  }
  //Asking for PWA installation
  
  function signInWithGoogle() {
    signInWithPopup(auth, googleProvider);
  }
  function createCookies(name, pass, batch) {
    let cookie = "isLogined=verfor934";
    document.cookie = cookie;
    document.cookie += `|name=${name}`;
    document.cookie += `|id=${pass}`;
    document.cookie += `|${batch}`;
    document.cookie += `;max-age=34560000`

    localStorage.setItem("batch", batch);
    window.location.href = "/#/";
  }

  onAuthStateChanged(auth, async (user) => {
    if (user && user.providerData[0].providerId === "google.com") {
      console.log(user);
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        createCookies(docSnap.data().name, user.uid, docSnap.data().batch);
      } else {
        // let name = prompt("One More Question.What is your Name?")
        setDoc(docRef, {
          batch: "",
          name: username,
          coins: 100,
          batches: [],
        });
        createCookies(username, user.uid, "");
      }
    }
  });
  signOut(auth);
  let scode = "";
  let name: Element;
  let sub: Element;
  let signinwithg: Element;
</script>

<main class="main {theme}">
  <div class="container-ask" id="askcont">
    <div class="border-ask">
      <div class="box-ask">
        <span class="text-ask">Please Install to Continue</span>
        <button type="button" class="ask" id="asktoinstall"
          ><span class="innerText"> Install </span></button
        >
      </div>
    </div>
  </div>
  <Header bind:theme />
  <main in:blur={{ duration: 800, easing: sineIn }}>
    <div class="pwdbox">
      <h2>
        Log<br /> <span class="pwdtext">In</span>
      </h2>
      <div class="cont">
        <button
          bind:this={signinwithg}
          id="invisble"
          class="pwd logwithg"
          on:click={signInWithGoogle}
          ><img src="./google.svg" alt="" />Log In with google</button
        >
        <input
          bind:this={name}
          bind:value={scode}
          type="text"
          class="pwd"
          id="pwd"
          placeholder="Your Name?"
        />
        <input
          bind:this={sub}
          type="submit"
          value="Submit"
          class="pwd subbtn"
          id="subbtn"
          on:click={addName}
        />
      </div>
      <span class="dhaa"
        >Want to use Secret code, <a href="/#/signin">Use it here</a></span
      >
    </div>
  </main>
</main>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css2?family=Agbalumo&family=Vibur&display=swap");
  .dhaa{
    font-size:clamp(15px,5vw,20px);
    a{
      color:aqua;
    }
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: var(--body-color);
  }
  .pwdbox {
    --wdt-of-pwd-box:clamp(10px, 80vw, 467.5px);
    background-color: white;
    height: 70vh;
    width: clamp(10px, 80vw, 467.5px);
    border: 2px solid var(--pwd-box-border);
    box-shadow: var(--pwd-box-shadow);
    background-color: var(--pwdbox-bg);
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    color: var(--text-color);
    align-items: center;
    font-family: "Vibur", sans-serif;
    .subbtn{
      margin-top: 25%;
      width:100px !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      height: 50px !important;
    }
    h2 {
      font-size: 30px;
      margin-top: 7px;
      text-shadow:
        0px 0px 14px #fff,
        0px 0px 23px #fff,
        0px 0px 41px #fff,
        0px 0px 82px #00fbff,
        0px 0px 112px #00fbff;
    }
    .cont {
      display: flex;
      flex-direction: column;
      width: 85%;
      height: 75%;
      align-items: center;
      
    }
    .logwithg {
      display: flex;
      align-items: center;
      gap: 15px !important;
      font-size: 22px;
      margin-top: 30px;
      img {
        height: 40px;
      }
    }
    .pwd {
      transition: 1s linear all;
      font-family: "Vibur";
      font-size: 23px;
      gap: 20px;
      border-radius: 25px;
      width: 100%;
      height: 40px;
      color: var(--text-color);
      border: 1px solid var(--pwd-border);
      background-color: var(--pwd-bg);
      box-shadow: var(--pwd-shadow);
      padding: 7px;
      display: flex;
      align-items: center;
    }
    #invisble {
      visibility: hidden;
    }
  }
  // Installation Asking
  .text-ask {
    color: var(--text-color);
    font-family: "Vibur", sans-serif;
    font-size: x-large;
    margin-bottom: 20px;
    text-shadow:
      0px 0px 7px #fff,
      0px 0px 12px #fff,
      0px 0px 15px #fff,
      0px 0px 25px rgb(146, 255, 241),
      0px 0px 35px rgb(138, 251, 236);
  }
  .ask {
    height: 50px;
    width: 90px;
    border: white;
    border-radius: 20px;
    box-shadow:
      0px 0px 7px #fff,
      0px 0px 12px #fff,
      0px 0px 15px #fff,
      0px 0px 25px rgb(146, 255, 241),
      0px 0px 45px rgb(138, 251, 236),
      0px 0px 7px #fff inset,
      0px 0px 12px #fff inset,
      0px 0px 15px rgb(138, 251, 236) inset;
    color: var(--text-color);
    text-shadow:
      0px 0px 10px #fff,
      0px 0px 15px #fff;
    font-family: "Vibur", sans-serif;
  }
  #askcont {
    box-sizing: border-box;
    position: absolute;
    height: 100vh;
    width: calc(100vw + 20vw);
    z-index: 7;
    display: none;
    justify-content: center;
    align-items: center;
    left: 50%;
    transform: translateX(-50%);
  }
  .border-ask {
    background-image: linear-gradient(
      to bottom right,
      red,
      yellow,
      green,
      blue,
      purple,
      violet
    );
    height: 200px;
    width: 270px;
    border: 0px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box-ask {
    border-radius: 20px;
    height: 99%;
    width: 99%;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
