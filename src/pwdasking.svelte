<script lang="ts">
  import Header from "./lib/header.svelte";
  import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
  import { initializeApp } from "firebase/app";
  import { config } from "./fbaseconfig";
  import {
    onAuthStateChanged,
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInWithCustomToken,
  } from "firebase/auth";

  //Vars
  let username;
  let firebase = initializeApp(config);
  let db = getFirestore(firebase);
  const auth = getAuth(firebase);
  const googleProvider = new GoogleAuthProvider();
  //Nessecary interface
  interface token {
    token: string;
  }
  //Asking for PWA installation
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    let deferredPrompt = e;
    document.getElementById("askcont").style.display = "flex";
    // @ts-ignore
    document.getElementById("asktoinstall").addEventListener("click", (ce) => {
      // @ts-ignore
      deferredPrompt.prompt();
      // @ts-ignore
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
        }
        deferredPrompt = null;
        document.getElementById("askcont").style.display = "none";
      });
    });
  });
  function signInWithGoogle() {
    signInWithPopup(auth, googleProvider);
  }
  function createCookies(name, pass, batch) {
    let cookie = "isLogined=verfor934";
    document.cookie = cookie;
    document.cookie += `|name=${name}`;
    document.cookie += `|id=${pass}`;
    document.cookie += `|${batch}`;

    localStorage.setItem("batch", batch);
    window.location.href = "/#/";
  }
  signOut(auth)
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
  let scode = "";
  let name: Element;
  let sub: Element;
  let signinwithg: Element;
  async function addName() {
    if (scode !== "") {
      name.style.transform = "translatex(-650px)";
      sub.style.transform = "translatex(-650px)";
      sub.style.visibility = "hidden";
      name.style.visibility = "hidden";
      name.style.opacity = "0";
      sub.style.opacity = "0";
      username = scode;

      signinwithg.setAttribute("id", "");
    }else{
      alert("Please Enter Your Name")
    }
  }
</script>

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
<Header />
<main>
  <div class="pwdbox">
    <h2>
      Log<br /> <span class="pwdtext">In</span>
    </h2>
    <div class="cont">
      <button
        bind:this={signinwithg}
        id="invisible"
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
      >Don't Have an Account, <a href="/#/signin">Create it here</a></span
    >
  </div>
</main>

<style lang="scss">
  .name {
    transform: translateX(-650px) !important;
    visibility: hidden;
    opacity: 0;
  }
  #invisible {
    visibility: hidden;
    transform: translateX(250px);
  }
  .logwithg {
    transition: 1s linear all;
    position: absolute;
    top: -15%;
  }
  .cont {
    position: absolute;
    top: 55%;
    left: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .text-ask {
    color: white;
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
    color: white;
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
  @import url("https://fonts.googleapis.com/css2?family=Agbalumo&family=Vibur&display=swap");
  main {
    --wdt-of-pwdbox: 467.5px;
    background-color: #0d0d0d;
    height: calc(100% - 110px);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    .pwdbox {
      height: 550px;
      width: var(--wdt-of-pwdbox);
      border-radius: 20px;
      border: 1px solid #00fbff;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center !important;
      background-color: black;
      box-shadow:
        0 0 7px #fff,
        0 0 10px #fff,
        0 0 21px #fff,
        0 0 42px #00fbff,
        0 0 82px #00fbff,
        0 0 92px #00fbff,
        0 0 102px #0fa,
        0 0 151px #0fa;
      .pwdtext {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      h2 {
        position: absolute;
        left: 50%;
        font-size: 28px;
        transform: translateX(-50%);
        margin-top: 20px;
        font-family: "Vibur";
        text-shadow:
          0px 0px 14px #fff,
          0px 0px 23px #fff,
          0px 0px 41px #fff,
          0px 0px 82px #00fbff,
          0px 0px 112px #00fbff;
      }
      .pwd {
        transition: 1s linear all;
        font-family: "Vibur";
        font-size: 23px;
        gap: 20px;
        border-radius: 25px;
        width: calc(calc(var(--wdt-of-pwdbox) * 80) / 100);
        height: 40px;
        color: white;
        border: 1px solid rgb(0, 251, 255);
        background-color: rgb(0, 0, 0);
        // position: absolute;

        transform: translate(-50%, -50%);
        box-shadow:
          0px 0px 18px #fff,
          0px 0px 28px rgb(0, 251, 255),
          0px 0px 38px rgb(0, 253, 207);
        &::placeholder {
          color: rgb(125, 125, 125);
        }
        padding: 7px;
        display: flex;
        align-items: center;
        img {
          height: 30px;
        }
      }
      .or {
        font-family: "Vibur";
        font-size: 20px;
      }
      .subbtn {
        font-family: "Vibur";
        font-size: 20px;
        background-color: black;
        width: 100px !important;
        margin-top: 75px;
        cursor: pointer;
        display: flex;
        justify-content: center;
      }
      .dhaa {
        font-family: "Vibur";
        font-size: 20px;
        position: absolute;
        margin-top: 500px;
        a {
          color: rgb(0, 255, 242);
        }
      }
    }
  }
  @media only screen and (max-width: 538px) {
    main {
      --wdt-of-pwdbox: 80%;
    }
  }
</style>
