<script lang="ts">
  // Importing Important Components
  // import {blur} from 'svelte/transition'
  export let params;
  import Link from "./lib/link.svelte";
  import Header from "./lib/header.svelte";
  import ExtendButton from "./lib/extendbutton.svelte";
  import Annoucements from "./lib/ann.svelte";
  import { initializeApp } from "firebase/app";
  import {
    getFirestore,
    doc,
    getDoc,
    collection,
    onSnapshot,
    setDoc,
    getDocs,
  } from "firebase/firestore";
  import { config, fcmPublicKey } from "./fbaseconfig";
  import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { onMount } from "svelte";
  import NotOpenedAGroup from "$lib/notOpenedAGroup.svelte";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import AiTalk from "./lib/aiTalk.svelte";
  import Dialog from "./lib/dialog.svelte";
  import { getMessaging, getToken, onMessage } from "firebase/messaging";

  // Declaring Important Variables
  let theme = "dark";
  let istgjn = false;
  let filetext = document.getElementById("filenameupd");
  let updperct = document.querySelector(".pg");
  let barpg = document.getElementById("progress-pg");
  let progress = 0;
  let filename;
  let fileitem;
  let issendcontopen = true;
  let sendcont = "Images";
  let linkopen = "false";
  let groups = [];
  let msg = [];
  let cookietosplit = `|${document.cookie}`;
  let splitedCookie = cookietosplit.split("|");
  let username = splitedCookie[2];
  const id = splitedCookie[3].replace("id=", "");
  let html = "";
  let isOpen = false;
  let oldIsOpen = isOpen;
  const storage = getStorage();
  let app = initializeApp(config);
  let db = getFirestore(app);
  let msgamount: number = 0;
  let toshow = false;
  let idToken;
  let openDialog;
  const messaging = getMessaging(app);
  let countForShowingImages = 0;
  //Function to Request Notfification Permission
  async function reqNotiPerm() {
    let Perm: boolean;
    let permission = await Notification.requestPermission();
    if (permission == "granted") {
      Perm = true;
    } else {
      Perm = false;
    }
    return Perm;
  }

  //Asking for PWA installation
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    let deferredPrompt = e;
    document.getElementById("askcont").style.display = "flex";
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

  //Funtion to get the logos of the groups
  function getLogo(logo: string, count: number) {
    //Creating a refrence
    const pathRefrence = ref(storage, "logos/" + logo);
    getDownloadURL(pathRefrence).then((url) => {
      const img = document.getElementById(`logo${count}`);
      img.setAttribute("src", url);
    });
    return "";
  }

  //Function to Retrieve All the Groups from the database
  async function findGroups() {
    let groupRef = doc(db, "metadata", "groups");
    onSnapshot(groupRef, async (groupSnap) => {
      if (groupSnap.exists()) {
        const data = Object.entries(groupSnap.data());
        console.log(data);
        groups = data;
      } else {
        alert(
          "Critical Internal Server File Deleted(Internal Server Error)" + 500
        );
        throw (
          "Critical Internal Server File Deleted(Internal Server Error)" + 500
        );
      }
    });
    // const groupSnap = await getDoc(groupRef);
  }
  onMount(() => {
    findGroups();
  });
  //Saving announcements

  //Function to Disable Input bar
  async function disableWriting(grp: Array<any>) {
    let x = grp.length;
    let y = 0;
    while (y !== x) {
      if (grp[y].name == params.group) {
        if (grp[y].availablefor !== "all") {
          if (grp[y].availablefor.includes(username.split("name=")[1])) {
            // @ts-ignore
            document.getElementById("sendemsg").disabled = false;
          } else {
            // @ts-ignore
            document.getElementById("sendmsg").disabled = true;
          }
        } else {
          // @ts-ignore
          document.getElementById("sendmsg").disabled = false;
        }
        break;
      }
      y++;
    }
  }
  // Loading All the messages on arrival
  if (params.group !== "tut") {
    let msgRef = collection(db, params.group);
    disableWriting(params.group);
    onSnapshot(msgRef, (snap) => {
      let x = snap.docs.reverse();
      x.forEach((doc) => {
        if (id != doc.data().uid) {
          html += `<div class="msg">
          <span class="sender">${doc.data().sender} ${
            doc.data().batch
          }<br></span>
          ${doc.data().msg}
          </div>`;
        } else {
          html += `<div class="msg sentbyme">
          <span class="sender">${doc.data().sender} ${doc.data().batch}<br>
            </span>
            ${doc.data().msg}
            
            </div>`;
        }
        msg.push({ ...doc.data(), id: doc.id });
      });
      msgamount = msg.length;
      document.getElementById("seamsg").innerHTML = html;
      html = "";
      msg = [];
      var elem = document.getElementById("seamsg");
      elem.scrollTo(0, elem.scrollHeight);
    });
  }
  //Adding logic to open button and Change group
  let changeGroup = (group: string) => {
    return () => {
    msg = [];
    let colRef = collection(db, group);
    onSnapshot(colRef, (snap) => {
      let x = snap.docs.reverse();
      x.forEach((doc) => {
        if (id != doc.data().uid) {
          html += `<div class="msg">
                    <span class="sender">${doc.data().sender} ${
                      doc.data().batch
                    }<br></span>
                ${doc.data().msg}
                </div>`;
        } else {
          html += `<div class="msg sentbyme">
                  <span class="sender">${doc.data().sender} ${
                    doc.data().batch
                  }<br></span>
                  ${doc.data().msg}
                  </div>`;
        }
        msg.push({ ...doc.data(), id: doc.id });
      });
      msgamount = msg.length;
      document.getElementById("seamsg").innerHTML = html;
      html = "";

      msg = [];
      var elem = document.getElementById("seamsg");
      elem.scrollTo(0, elem.scrollHeight);
    });

    disableWriting(group);
  }
  };
  setInterval(() => {
    if (isOpen != oldIsOpen) {
      if (isOpen) {
        document.getElementById("sidenav").style.transform = "scaleX(1)";
      } else {
        document.getElementById("sidenav").style.transform = "scaleX(0)";
        document.getElementById("areaformsg").style.width = "100%";
      }
      oldIsOpen = isOpen;
    }
  }, 100);
  //Fuction to send messages
  async function sendmsg() {
    //@ts-ignore

    let msgtosend = document.getElementById("msg").value;
    sendmsgwtype("Text", "", msgtosend);
  }
  async function sendmsgwtype(type, durl, msgtosend) {
    if (msgtosend != "") {
      const date = new Date();

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let batch = localStorage.getItem("batch");
      // @ts-ignore
      let msgid = 99999999999999 - msgamount;
      await setDoc(doc(db, params.group, `${msgid}`), {
        msg: msgtosend,
        sender: username.split("name=")[1],
        onsent: `${day}-${month}-${year}`,
        batch: batch,
        type: type,
        durl: durl,
        uid: id,
      });
      //@ts-ignore

      document.getElementById("msg").value = "";
    }
  }
  //TEST: Listening to notifications

  onMessage(messaging, (payload) => {
    alert("Message received. :" + payload);
    console.log("Msg Recieved: ", payload);
    // ...
  });
  //Function to Open The area of send options
  function openLink() {
    if (linkopen === "false") {
      document.getElementById("linkcont").style.height = "40%";
      document.getElementById("linkcont").style.opacity = "1";
      linkopen = "true";
    } else {
      document.getElementById("linkcont").style.height = "0px";
      setTimeout(() => {
        document.getElementById("linkcont").style.opacity = "0";
      }, 1000);
      linkopen = "false";
    }
    console.log(linkopen);
  }
  //Function to open the send files container
  let opensendcntimg = () => {
    sendcont = "Image";
    if (issendcontopen === false) {
      document.getElementById("sendovr").style.visibility = "hidden";
      document.getElementById("sendovr").style.transform = "scale(0)";

      issendcontopen = true;
    } else {
      document.getElementById("sendovr").style.visibility = "visible";
      document.getElementById("sendovr").style.transform = "scale(1)";
      issendcontopen = false;
    }
  };
  //Function to close the send files container
  function closecntsend() {
    document.getElementById("sendovr").style.visibility = "hidden";
    document.getElementById("sendovr").style.transform = "scale(0)";
    issendcontopen = true;
    filetext.innerHTML = "";
    updperct.innerHTML = "0%";
    barpg.style.width = "0%";
  }
  //Function that runs on the onchange of input to keep information up-to-date
  function getFiles() {
    let finp = document.getElementById("fileupd");
    //@ts-ignore
    let file = finp.files[0];
    filename = file.name;
    fileitem = file;
    document.getElementById("filenameupd").innerHTML = filename;
  }
  //function to upload the files
  let uploadfile = async () => {
    let refofmd = doc(db, "metadata", "storage");
    let snapofmd = await getDoc(refofmd);
    if (snapofmd.exists()) {
      let n = snapofmd.data().total;
      let storageRef = ref(storage, "files/" + n);
      let updtask = uploadBytesResumable(storageRef, fileitem);
      updtask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          let prg = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progress = Math.trunc(prg);
        },
        (error) => {
          alert(
            "An error Occured while uploading: " +
              error.message +
              "With code of" +
              error.code +
              "Caused by " +
              error.cause
          );
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(updtask.snapshot.ref).then((url) => {
            sendmsgwtype(sendcont, url, `<img src="${url}">`);
          });
          setDoc(refofmd, {
            total: n + 1,
          });
        }
      );
    } else {
      alert("A major error has occurd. Please inform the developer of the app");
    }
  };

  //Open Join group
  function tgjn() {
    istgjn = !istgjn;
    // Optionally log the current value to console for debugging
    console.log(istgjn);
    // Optionally alert the current value
    alert(istgjn);
  }
  //Getting Auth
  let auth = getAuth();
  //Redirect if user ain't logged in
  onAuthStateChanged(auth, (usr) => {
    if (!usr) {
      window.location.href = "/#/AskPwd";
    }
  });
  let aiTalkOpen = false;
  async function setIdToken() {
    idToken = await auth.currentUser.getIdToken(false);
    aiTalkOpen = !aiTalkOpen;
    console.log(idToken);
  }
  //Requesting Notification Permission and sending Notification token to server
  onMount(() => {
    openDialog();
    reqNotiPerm().then(() => {
      openDialog();
      getToken(messaging, { vapidKey: fcmPublicKey })
        .then(async (token) => {
          console.log(token);

          let docRef = doc(db, "users", id);
          let docSnap = await getDoc(docRef);
          let tmp = JSON.parse(JSON.stringify(docSnap.data()));
          if (tmp.Keys === undefined) {
            tmp.Keys = [token];
          } else {
            if (!tmp.Keys.includes(token)) {
              tmp.Keys.push(token);
            }
          }
          await setDoc(docRef, tmp);
        })
        .catch((err) => {
          console.error("An error occurred while retrieving token. ", err);
          // ...
        });
    });
  });
</script>

<main class="{theme} main">
  <Dialog bind:open={openDialog}>
    <button
      on:click={openDialog}
      class="cut2 rotate-45 relative top-2 ml-auto right-4"
    >
      <div class="bg-white w-[2px] absolute h-4"></div>
      <div class="bg-white w-[2px] h-4 rotate-90"></div>
    </button>
    <div class="flex flex-col items-center mb-3">
      <span class="text-[var(--text-color)] font-['Vibur'] text-4xl pt-3"
        >Hey There! 👋</span
      >
      <span class="text-xl font-['Vibur'] text-[var(--text-color)]">
        We need Notifications to run,<br /> can you give us permission for that
      </span>
    </div>
  </Dialog>
  <AiTalk bind:isOpen={aiTalkOpen} bind:auth bind:token={idToken}/>
  <button
    on:click={setIdToken}
    class="absolute z-10 bottom-[75px] flex items-center justify-center right-4 h-14 w-14 rounded-full"
    style="box-shadow:var(--ai-btn-shadow)"
  >
    <Avatar.Root class="h-14 w-14">
      <Avatar.Image src="./Ai.png" alt="AI" />
      <Avatar.Fallback>Ai</Avatar.Fallback>
    </Avatar.Root>
  </button>
  <div class="sendovr" id="sendovr">
    <div class="sendui">
      <div class="grid so2">
        <div class="x"></div>
        <div class="x"></div>
        <button class="cut" on:click={closecntsend}>
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
          </svg>
        </button>
        <div class="x"></div>
        <h1>Send {sendcont}</h1>
        <div class="x"></div>
        <div class="x"></div>
        <div class="x"></div>
        <div class="x"></div>
      </div>
      <div class="sendinput">
        <input type="file" name="" id="fileupd" on:change={getFiles} />
        <label for="fileupd" class="fileupdbtn">+</label>
        <span id="filenameupd"></span>
        <div class="pg-bar">
          <div
            class="progress-pg"
            id="progress-pg"
            style="width:{progress}%"
          ></div>
        </div>
        <div class="pg">{progress}%</div>
        <button class="uploadbtn" id="updbtn" on:click={uploadfile}
          >Upload {sendcont}</button
        >
      </div>
    </div>
  </div>
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
  <chatwindows style="display: flex;">
    <div class="linkcont" id="linkcont">
      <div class="row" id="r1">
        <div
          class="item-border"
          style="
      border-radius: 25px 0px 0px 0px;
      "
        >
          <div
            class="item"
            id="doc"
            style="
      border-radius: 25px 0px 0px 0px;
      "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              fill="#87f542"
              width="45px"
              height="45px"
              viewBox="0 0 100 100"
            >
              <path
                d="M 50.224609 13.296875 A 1.0001 1.0001 0 0 0 50.179688 13.298828 C 50.16123 13.299617 50.143454 13.299991 50.125 13.300781 A 1.0001 1.0001 0 0 0 50.119141 13.302734 C 31.913969 14.082695 15.105874 15.702779 14.658203 15.746094 A 1.0001 1.0001 0 0 0 14.582031 15.742188 A 1.0001 1.0001 0 0 0 13.638672 17.046875 C 13.638672 17.046875 24.381611 52.495531 28.097656 88.794922 A 1.0001 1.0001 0 0 0 29.337891 89.794922 A 1.0001 1.0001 0 0 0 29.404297 89.775391 C 29.404297 89.775391 57.272701 81.167951 85.035156 80.193359 A 1.0006178 1.0006178 0 0 0 85.207031 80.171875 A 1.0001 1.0001 0 0 0 85.232422 80.166016 A 1.0006178 1.0006178 0 0 0 85.302734 80.146484 A 1.0001 1.0001 0 0 0 85.304688 80.146484 A 1.0006178 1.0006178 0 0 0 85.789062 79.808594 A 1.0001 1.0001 0 0 0 85.804688 79.787109 A 1.0006178 1.0006178 0 0 0 85.935547 79.548828 A 1.0001 1.0001 0 0 0 85.9375 79.542969 A 1.0006178 1.0006178 0 0 0 85.998047 79.255859 A 1.0001 1.0001 0 0 0 85.998047 79.251953 A 1.0006178 1.0006178 0 0 0 86 79.195312 C 86.031519 65.348175 81.384688 45.753602 75.476562 28.601562 A 1.0001 1.0001 0 0 0 74.900391 27.974609 C 67.996048 21.87697 59.147455 17.022439 50.759766 13.439453 A 1.0001 1.0001 0 0 0 50.330078 13.302734 A 1.0001 1.0001 0 0 0 50.324219 13.300781 A 1.0001 1.0001 0 0 0 50.310547 13.300781 A 1.0001 1.0001 0 0 0 50.25 13.296875 A 1.0001 1.0001 0 0 0 50.224609 13.296875 z M 49.705078 15.324219 C 49.769223 15.41721 49.829699 15.513365 49.892578 15.607422 C 54.767023 25.972774 52.49625 30.794441 53.419922 31.814453 C 55.033611 33.598476 61.493021 29.212535 73.789062 29.867188 C 79.420532 46.361686 83.768484 65.033705 83.931641 78.228516 C 81.18488 78.274412 58.525927 78.858701 31.035156 85.6875 C 26.190063 48.513621 17.005675 20.802771 15.933594 17.646484 C 17.709898 17.476858 32.58672 16.072665 49.705078 15.324219 z M 52.878906 16.742188 C 59.195363 19.64076 65.522486 23.13343 70.931641 27.390625 C 66.313751 26.986141 61.44167 27.59287 57.111328 28.523438 C 56.121564 24.541778 54.88369 20.441584 52.878906 16.742188 z M 52.292969 39.617188 A 1.0001 1.0001 0 0 0 52.224609 39.621094 C 52.224609 39.621094 43.025617 40.108818 33.791016 41.820312 A 1.0002108 1.0002108 0 1 0 34.15625 43.787109 C 43.223649 42.106604 52.330078 41.617187 52.330078 41.617188 A 1.0001721 1.0001721 0 0 0 52.292969 39.617188 z M 69.501953 47.601562 A 1.0001 1.0001 0 0 0 69.431641 47.603516 C 58.264238 48.250261 47.143073 49.691715 36.179688 51.912109 A 1.0005036 1.0005036 0 0 0 36.578125 53.873047 C 47.448739 51.671441 58.474278 50.240864 69.546875 49.599609 A 1.0001 1.0001 0 0 0 69.501953 47.601562 z M 67.205078 58.414062 A 1.0001 1.0001 0 0 0 67.136719 58.416016 C 57.551249 58.983114 47.994487 60.061673 38.523438 61.644531 A 1.0001 1.0001 0 1 0 38.853516 63.617188 C 48.254465 62.046045 57.739376 60.976965 67.253906 60.414062 A 1.000298 1.000298 0 0 0 67.205078 58.414062 z M 72.439453 68.837891 A 1.0001 1.0001 0 0 0 72.371094 68.841797 C 61.897374 69.549941 51.457058 70.756825 41.097656 72.458984 A 1.0005252 1.0005252 0 1 0 41.421875 74.433594 C 51.718473 72.741753 62.095579 71.539793 72.505859 70.835938 A 1.0001 1.0001 0 0 0 72.439453 68.837891 z"
              ></path>
            </svg>
            <span class="label">Files</span>
          </div>
        </div>
      </div>
      <div class="row" id="r2">
        <div class="item-border">
          <button class="linkbtn" id="imagesend" on:click={opensendcntimg}>
            <div class="item" id="img">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#42f5ec"
                style="margin-left: 10px;"
                viewBox="0 0 24 24"
                width="30"
                height="30"
                ><g id="_01_align_center" data-name="01 align center"
                  ><path
                    d="M21,0H3A3,3,0,0,0,0,3V24H24V3A3,3,0,0,0,21,0ZM3,2H21a1,1,0,0,1,1,1V20.586L11.121,9.707a3,3,0,0,0-4.242,0L2,14.586V3A1,1,0,0,1,3,2ZM2,17.414l6.293-6.293a1,1,0,0,1,1.414,0L20.586,22H2Z"
                  /><path
                    d="M16,10a3,3,0,1,0-3-3A3,3,0,0,0,16,10Zm0-4a1,1,0,1,1-1,1A1,1,0,0,1,16,6Z"
                  /></g
                ></svg
              >

              <span class="label">Images</span>
            </div></button
          >
        </div>
      </div>
      <div class="row" id="r3">
        <div class="item-border">
          <div class="item" id="poll">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#f542ec"
              style="margin-left: 6px;"
              width="50"
              height="50"
              viewBox="0 0 30 30"
              id="poll"
              ><path fill="none" d="M0 0h24v24H0V0z" /><path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 17c-.55 0-1-.45-1-1v-5c0-.55.45-1 1-1s1 .45 1 1v5c0 .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v8c0 .55-.45 1-1 1zm4 0c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1z"
              /></svg
            >

            <span class="label">Poll</span>
          </div>
        </div>
      </div>
      <div class="row" id="r4">
        <div class="item-border">
          <div class="item" id="img">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#f5ce42"
              height="48"
              width="48"
              style="margin-left:7px"
              viewBox="0 0 512 512"
              ><path
                d="m497.39 361.8-112-48a24 24 0 0 0 -28 6.9l-49.6 60.6a370.66 370.66 0 0 1 -177.19-177.19l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112a24.16 24.16 0 0 0 -27.5-13.9l-104 24a24 24 0 0 0 -18.6 23.39c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0 -14.01-27.6z"
              /></svg
            >

            <span class="label">Phone Number</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Side Grouping Menu -->
    <ExtendButton bind:isOpen />
    <div id="sidenav" class="sidenav h-[calc(100vh-110px)] bg-slate-950">
      {#each groups as group, index}
        <button type="button" on:click={changeGroup(group[1].name)} class="w-[100%]">
          <a class="group" href="#/chat/{group[1].name}">
            <img src="" id="logo{index}" class="groupicon" alt="" />
            <span class="groupname">{group[1].pname}</span>
            {getLogo(group[1].logo, index)}
          </a>
        </button>
      {/each}
    </div>
    <div class="areaformsg" id="areaformsg">
      <div class="seamsg" id="seamsg">
        <NotOpenedAGroup />
        <div class="msg" style="display:none">
          <span class="sender">ChatBot <br /></span>Welcome
        </div>
      </div>
      <div
        class="msgarea dark:border-none border-l-2 border-t-2 border-gray-500"
      >
        <input
          type="text"
          class="typemsg dark:border-white border-2 border-gray-700"
          id="msg"
        />
        <button id="sendmsg" type="button" on:click={sendmsg}
          ><svg
            class="text-black dark:text-white ml-2"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            fill="currentColor"
            height="25px"
            width="25px"
            version="1.1"
            id="Layer_1"
            viewBox="0 0 491.022 491.022"
            xml:space="preserve"
          >
            <g>
              <g>
                <path
                  d="M490.916,13.991c-0.213-1.173-0.64-2.347-1.28-3.307c-0.107-0.213-0.213-0.533-0.32-0.747    c-0.107-0.213-0.32-0.32-0.533-0.533c-0.427-0.533-0.96-1.067-1.493-1.493c-0.427-0.32-0.853-0.64-1.28-0.96    c-0.213-0.107-0.32-0.32-0.533-0.427c-0.32-0.107-0.747-0.32-1.173-0.427c-0.533-0.213-1.067-0.427-1.6-0.533    c-0.64-0.107-1.28-0.213-1.92-0.213c-0.533,0-1.067,0-1.6,0c-0.747,0.107-1.493,0.32-2.133,0.533    c-0.32,0.107-0.747,0.107-1.067,0.213L6.436,209.085c-5.44,2.347-7.893,8.64-5.547,14.08c1.067,2.347,2.88,4.373,5.227,5.44    l175.36,82.453v163.947c0,5.867,4.8,10.667,10.667,10.667c3.733,0,7.147-1.92,9.067-5.12l74.133-120.533l114.56,60.373    c5.227,2.773,11.627,0.747,14.4-4.48c0.427-0.853,0.747-1.813,0.96-2.667l85.547-394.987c0-0.213,0-0.427,0-0.64    c0.107-0.64,0.107-1.173,0.213-1.707C491.022,15.271,491.022,14.631,490.916,13.991z M190.009,291.324L36.836,219.218    L433.209,48.124L190.009,291.324z M202.809,437.138V321.831l53.653,28.267L202.809,437.138z M387.449,394.898l-100.8-53.013    l-18.133-11.2l-0.747,1.28l-57.707-30.4L462.116,49.298L387.449,394.898z"
                />
              </g>
            </g>
          </svg></button
        >
        <button class="send" on:click={openLink}>
          <svg
            class="font-thin dark:fill-white fill-black"
            xmlns="http://www.w3.org/2000/svg"
            enable-background="new 0 0 24 24"
            viewBox="0 0 24 24"
            id="link"
            ><path
              d="M10,15H7c-1.7,0-3-1.3-3-3s1.3-3,3-3h3c0.6,0,1-0.4,1-1s-0.4-1-1-1H7c-2.8,0-5,2.2-5,5s2.2,5,5,5h3c0.6,0,1-0.4,1-1
            S10.6,15,10,15z M17,7h-3c-0.6,0-1,0.4-1,1s0.4,1,1,1h3c1.7,0,3,1.3,3,3s-1.3,3-3,3h-3c-0.6,0-1,0.4-1,1s0.4,1,1,1h3
            c2.8,0,5-2.2,5-5S19.8,7,17,7z M8,12c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1s-0.4-1-1-1H9C8.4,11,8,11.4,8,12z"
            ></path></svg
          >
        </button>
      </div>
    </div>
  </chatwindows>
</main>

<style lang="scss">
  .cut {
    margin-top: auto;
    margin-left: auto;
    height: 100%;
    aspect-ratio: 1/1;
    margin-top: 20px;
    margin-right: 20px;
  }
  .so2 {
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    grid-template-columns: 20% 60% 20%;
    grid-template-rows: 20% 60% 20%;
    h1 {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
    }
  }

  #sendovr {
    visibility: hidden;
    transform: scale(0);
  }
  .sendovr {
    transition: 2s all;
    height: 100vh;
    width: 100vw;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.306);
    z-index: 10;
    display: grid;
    place-items: center;
  }
  .linkbtn {
    height: 100%;
    width: 100%;
    margin: 0;
  }
  #r4 {
    .label {
      font-size: 18px;
      font-weight: 500;
    }
  }
  .item-border {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    color: #000;
    background: linear-gradient(
      45deg,
      #999 5%,
      #fff 10%,
      #ccc 30%,
      #ddd 50%,
      #ccc 70%,
      #fff 80%,
      #999 95%
    );
  }
  .label {
    color: white;
    font-size: 25px;
    margin-left: calc(45% - 50px);
    margin-right: auto;
    font-family: "Vibur", sans-serif;
  }
  #doc {
  }
  .item {
    height: 99%;
    width: 100%;
    background-color: var(--item-color);
    display: flex;
    align-items: center;
    justify-content: left;
  }
  .row {
    height: calc(100% / 4);
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .linkcont {
    margin: 0px;
    display: flex;
    flex-direction: column;
    transition: 1s linear height;
    border-radius: 25px 0px 0px 0px;
    right: 0px;
    position: absolute;
    height: 0%;
    opacity: 0;
    top: auto;
    bottom: 80px;
    width: 250px;
    z-index: 3;
    background-color: hsl(239, 96%, 9%);
  }
  #link {
    width: 30px;
    height: 30px;
    margin-left: -20px !important;
    rotate: 135deg;
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
  .typemsg {
    width: 80%;
    height: 40px;
    border-radius: 20px;
    background-color: var(--msg-type-bg);
    color: var(--text-color);
    padding: 10px;
    font-size: 20px;
    margin-top: 0px;
    box-shadow: var(--msg-type-shadow);
  }
  .send {
    height: 50px;
    width: 50px;
    margin-left: 20px;
    color: #fff;
    &:disabled {
      color: rgb(154, 154, 154);
    }
  }
  // reponsiveness
  @media only screen and (max-width: 900px) {
    .sidenav {
      width: calc(100vw - 3rem) !important;
      transform: scaleX(0);
    }
    .areaformsg {
      width: calc(100vw - 3rem) !important;
      left: 3rem !important;
    }
  }
</style>
