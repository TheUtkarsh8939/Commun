
import { initializeApp, cert } from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore";
import "dotenv/config";
let app = initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE)),
});
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  if (req.headers["x-auth-uid"] === ""|| req.headers["x-auth-uid"] === undefined){
    res.status(400).json({"err":"header not present"})
    return
  }
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
