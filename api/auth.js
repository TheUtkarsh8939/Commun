import { service } from "./service.js";
import { initializeApp, cert } from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore";
import "dotenv/config";
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  let app = initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE)),
  });
  const auth = getAuth(app);
  const fs = getFirestore(app);
  let ref = fs.collection("users");
  let snap = await ref.doc(req.headers["x-auth-uid"]).get();
  if (snap.exists){
    auth
    .createCustomToken(req.headers["x-auth-uid"])
    .then((token)=> {
      res.status(200).json({"token":token,"batch":snap.data().batch,"name":snap.data().name})
    })
    .catch((err)=> {
      res.status(501).json({"err":err})
    })
  }else{
    res.status(400).json({"msg":"Invalid UiD"})
  }
}
