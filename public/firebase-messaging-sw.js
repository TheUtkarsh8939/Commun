importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js')

let config =  {
    apiKey: "AIzaSyDyY5F4FGDsL4al0PagVTFOZzZ0UDIY6Vw",
    authDomain: "friendsforever-9cc00.firebaseapp.com",
    projectId: "friendsforever-9cc00",
    storageBucket: "friendsforever-9cc00.appspot.com",
    messagingSenderId: "836167022374",
    appId: "1:836167022374:web:3d48a724d93b005b1af3e7",
    measurementId: "G-D18HLQN9MV"
}
const app = firebase.initializeApp(config)
const messaging = firebase.messaging()

