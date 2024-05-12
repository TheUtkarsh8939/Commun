<script lang="ts">
  import Loading from "./lib/loading.svelte";
  import Header from "./lib/header.svelte";
  import { config } from "./fbaseconfig.js";
  import { initializeApp } from "firebase/app";
  import { getAuth, signInWithCustomToken } from "firebase/auth";
  import Dialog from "./lib/dialog.svelte";
  const app = initializeApp(config);
  let theme;
  let open;
  let id;
  let isOpen
  function createCookies(name, pass, batch) {
    let cookie = "isLogined=verfor934";
    document.cookie = cookie;
    document.cookie += `|name=${name}`;
    document.cookie += `|id=${pass}`;
    document.cookie += `|${batch}`;

    localStorage.setItem("batch", batch);
    window.location.href = "/#/";
  }
  let register = async () => {
    isOpen = true
    const auth = getAuth();
    const res = await fetch("./api/auth", {
      headers: {
        "x-auth-uid": id
      },
    });
    if (!res.ok) {
      if (res.status === 400) {
        // Handle specific error for 400 status code
        open();
      } else {
        console.error(res);
      }
      throw new Error("Request failed"); // Re-throw to propagate the error
    }
    const data = await res.json();
    const token = data.token;
    signInWithCustomToken(auth, token)
      .then((cred) => {
        createCookies(data.name, id, data.batch);
        window.location.href = "./#/chat/tut"
        isOpen = false;
      })
      .catch((err) => {
        console.error(`Error Logining:${err}`);
      });
  };
</script>

<div class="main {theme}">
  <Loading bind:isOpen/>
  <Dialog bind:open>
    <button class="cut rotate-45 ml-auto mt-[10px] mr-[10px]" on:click={open}>
      <div class="rod h-[20px] w-[5px] absolute bg-white"></div>
      <div class="rod h-[20px] w-[5px] absolute bg-white rotate-90"></div>
    </button>
    <span class="text-white p-[100px]" style="font-size:35px">Wrong Id</span>
  </Dialog>
  <Header bind:theme />
  <main>
    <div class="cont">
      <h2 class="txt">Use a <br /> Secret Code</h2>
      <input
        bind:value={id}
        type="text"
        id="fl"
        class="fields"
        placeholder="Your Secret Code??"
      />
      <button class="create" on:click={register}>Use</button>
      <span>Or use Google Sign In, <a href="./#/askpwd">Here</a></span>
    </div>
  </main>
</div>

<style lang="scss">
  .uidis {
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
    transform: translate(-50%, -50%);
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
      color: white !important;
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
