<script>
  import Header from "./lib/header.svelte";
  import { config } from "./fbaseconfig.js";
  import { initializeApp } from "firebase/app";
  import { getFirestore, doc, getDoc,setDoc } from "firebase/firestore";
  let app = initializeApp(config);
  let db = getFirestore(app);
  let newid
  let genpwd =async  (nameof) => {
    let rmws = nameof.replace(" ", "");
    rmws = rmws.toLowerCase();
    let num = Math.floor(Math.random() * 1024);
    let id = num + rmws + num;
    let idref = doc(db,"users",id)
    let snap = await getDoc(idref)
    if(snap.exists()){
      return genpwd(nameof)
    }else{
      return id
    }
  };
  function register(){
    //@ts-ignore
    let nam = document.getElementById('fl').value
  genpwd(nam).then(async (Response) => {
    newid = Response
    let ref = doc(db,'users',newid)
    document.getElementById('askcont').style.display = "block"
    let cookie = "isLogined=verfor934"
    document.cookie = cookie;
    document.cookie += `|name=${nam}`
    document.cookie += `|id=${Response}`
    document.cookie += `|`
    setTimeout(()=>window.location.href = "/#/",5000)
    
    await setDoc(ref,{
      batch:"",
      name:nam,
      coins:100,
      batches:[]
    })
  })
  } 
</script>

<Header />
<main>
  <div class="container-ask" id="askcont">
    <div class="border-ask">
      <div class="box-ask" >
        <span class="text-ask"><span class="uidis"> Unique ID is Please note it down</span><br>{newid}</span>
      </div>
    </div>
  </div>
  <div class="cont">
    <h2 class="txt">Create An <br /> Account</h2>
    <input type="text" id="fl" class="fields" placeholder="Please Enter Your Name" />
    <button class="create" on:click={register}>Create</button>
    <span>Already Have an Account, <a href="./#/askpwd">Log In</a></span>
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
