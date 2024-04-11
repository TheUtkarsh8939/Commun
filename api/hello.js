
import { initializeApp,cert } from "firebase-admin/app";
import  {getAuth} from "firebase-admin/auth"
import "dotenv/config"
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (!req.headers.uid) {
    return res.status(400).json({ message: 'Missing uId in request header' });

  }
  //@ts-ignore

  const uid = req.headers.uid;
  //@ts-ignore
  initializeApp(
    {
      credential:cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') // Replace \n characters in the private key
      })
    }
  );
  getAuth()
    .createCustomToken(uid,{
      custom: true
    })
    .then((customToken) => {
      return res.status(200).json(customToken)
    })
    .catch((error) => {
      return res.status(501).json({"message":error})
    });

  
}