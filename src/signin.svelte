<script lang="ts">
  import Header from "./lib/header.svelte";
  import {config} from "./fbaseconfig.js";
  import {initializeApp} from "firebase/app"
  import {getFirestore,doc, getDoc} from "firebase/firestore"
  async function hashSHA256(message) {
  // Encode the message as a Uint8Array
  const messageUint8 = new TextEncoder().encode(message);

  // Hash the message using SHA-256 algorithm
  const hashBuffer = await crypto.subtle.digest('SHA-256', messageUint8);

  // Convert the hash buffer to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
}
const app = initializeApp(config)
const db = getFirestore(app)
const register = () => {
  const docref = doc(db, "metadata","storage")
  const docData = getDoc(docref)
  console.log(docData)
}
</script>

<Header />
<main>
  <div class="cont">
    <h2 class="txt">Use a <br /> Secret Code</h2>
    <input type="text" id="fl" class="fields" placeholder="Your Secret Code??" />
    <button class="create" on:click={register}>Use</button>
    <span>Or use Google Sign In, <a href="./#/askpwd">Here</a></span>
  </div>
</main>

<style lang="scss">
  .uidis{
    font-size: 20px;
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
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
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
  span {
    margin-top: 40px;
    color: white;
    font-family: "Vibur";
    font-size: 20px;
    a {
      color: rgb(0, 221, 255);
    }
  }
  main {
    background-color: rgb(6, 6, 6);
    height: calc(100vh - 110px);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cont {
    height: 600px;
    align-items: center;
    border-radius: 50px;
    box-shadow:
      0 0 7px #fff,
      0 0 10px #fff,
      0 0 21px #fff,
      0 0 42px #00fbff,
      0 0 82px #00fbff,
      0 0 92px #00fbff,
      0 0 102px #0fa,
      0 0 151px #0fa;
    aspect-ratio: 16/20;
    background-color: black;
    display: flex;
    flex-direction: column;
    h2 {
      margin-top: 30px;
      font-family: "Vibur";
      text-shadow:
        0px 0px 14px #fff,
        0px 0px 23px #fff,
        0px 0px 41px #fff,
        0px 0px 82px #00fbff,
        0px 0px 112px #00fbff;
      font-size: 30px;
      color: #fff;
    }
    .fields {
      color:white !important;
      margin-top: 100px;
      width: 80%;
      height: 40px;
      border-radius: 100px;
      border: 1px solid rgb(0, 251, 255);
      padding: 7px;
      box-shadow:
        0px 0px 18px #fff,
        0px 0px 28px rgb(0, 251, 255),
        0px 0px 38px rgb(0, 253, 207);
      &::placeholder {
        color: rgb(125, 125, 125);
      }
      background-color: rgb(32, 32, 32);
    }
    .create {
      border-radius: 25px;
      color: white;
      font-size: 20px;
      font-family: "Vibur";
      width: 100px !important;
      margin-top: 100px;
      cursor: pointer;
      box-shadow:
        0px 0px 18px #fff,
        0px 0px 28px rgb(0, 251, 255),
        0px 0px 38px rgb(0, 253, 207);
      height: 40px;
      background-color: black;
      border: 1px solid aqua;
    }
  }
  @media only screen and (max-width: 538px) {
    .cont {
      width: 80%;
    }
  }
</style>
