import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

import "dotenv/config";
let app = initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE)),
});
const genAI = new GoogleGenerativeAI(process.env.AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
export default async (req, res) => {
  if (req.method === "GET") {
    if (req.headers["x-auth"] === undefined) {
      res.status(400).json("Unauthorized");
      return;
    }
    const fs = getFirestore(app);

    getAuth(app)
      .verifyIdToken(req.headers["x-auth"])
      .then(async (token) => {
        const uid = token.uid;
        const colRef = fs.collection("aiTalk");
        const colData = await colRef.where('uid', '==', uid).get();
        if (colData.empty) {
          res.status(269).json({ 'msg':"No talks yet" });
          return;
        }
        let data = []
        colData.forEach(piece => {
          data.push({
            "time":piece.data().time,
            "prompt": piece.data().user,
            "model": piece.data().model
          })
        })
        data.sort((a, b)=> a.time - b.time)
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(400).json({ error: error });
        console.log(error);
      });
  } else if (req.method === "POST") {
    if (req.headers["x-prompt"] === undefined) {
      res.status(400).json({ error: "Missing Prompt" });
      return;
    }
    if (req.headers["x-auth"] === undefined) {
      res.status(401).json("Unauthorized");
      return;
    }
    getAuth(app)
      .verifyIdToken(req.headers["x-auth"])
      .then(async (token) => {
        const fs = getFirestore(app);
        const uid = token.uid;
        const colRef = fs.collection("aiTalk");
        const colData = await colRef.where('uid','==',uid).get()
        
        let history = []
        let tmpData = []
        colData.forEach(piece => {
          tmpData.push({
            "time":piece.data().time,
            "prompt": piece.data().user,
            "model": piece.data().model
          })
        })
        tmpData.sort((a, b)=> a.time - b.time)
        tmpData.forEach(piece => {
          let constructUser = {
            role: "user",
            parts: [{text: piece.prompt}]
          }
          let constructModel = {
            role: "model",
            parts: [{text: piece.model}]
          }
          history.push(constructUser)
          history.push(constructModel)
        })
        
        const chat = model.startChat({history:history})
        const prompt = req.headers["x-prompt"];
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();
        const time = Date.now()
        const data = {
          'time': time,
          'uid': uid,
          'user': req.headers["x-prompt"],
          'model': text
        }
       colRef.add(data).then(full => {
        console.log(full)
       })
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(401).json({ err: error });
        console.log(error);
      });
  }
};
