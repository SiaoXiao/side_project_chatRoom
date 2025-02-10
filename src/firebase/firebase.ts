import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup} from 'firebase/auth'
import {getFirestore, addDoc, collection, doc, getDoc,setDoc, onSnapshot} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBAES_API_KEY,
  authDomain: import.meta.env.VITE_FIREBAES_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBAES_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBAES_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBAES_APP_ID
};

// Initialize Firebase
initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider
const COLLECTIONS = {
  ROOM: "room",
  MESSAGE: "message"
}

export function requireAuth() {
  return new Promise((resolve)=> {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user)=> {
      if(user) {
        // 已經登入
        resolve(user)
        unsubscribe()
      }else {
        // 未登入
        signInWithPopup(auth, provider)
      }
    })
  })
}

export async function createRoom() {
  const db = getFirestore();
  const room = await addDoc(collection(db, COLLECTIONS.ROOM), {
    name: "Chat Room",
    createdAt: new Date()
  })
  return room.id
}

export async function sendMessageToRoom (roomId:string, content:string) {
  const db = getFirestore();
  const messageRef = collection(db, COLLECTIONS.ROOM, roomId, COLLECTIONS.MESSAGE)
  const auth = getAuth()
  const message = await addDoc(messageRef, {
    senderEmail: auth.currentUser?.email,
    senderName: auth.currentUser?.displayName,
    content,
    timestamp: new Date()
  })
  return message
}

export async function subscribeToRoom (fn: (messages: any[]) => void, roomId:string) {
  const db = getFirestore();
  const messageRef = collection(db, COLLECTIONS.ROOM, roomId, COLLECTIONS.MESSAGE)
  const unsubscribe = onSnapshot(messageRef, (messages)=> {
    const auth = getAuth()
    const transformedMessages = messages.docs.map((doc)=> {
      const data = doc.data()
      const id = doc.id

      return {id, isSelt: auth.currentUser?.email === data.senderEmail, ...data}
    })

    fn(transformedMessages)
  })

  return unsubscribe
}

export function getRoom(roomId:string) {
  const db = getFirestore();
  const roomRef = doc(db, COLLECTIONS.ROOM, roomId)
  return getDoc(roomRef).then((doc) => doc.data())
}

export async function updateRoomName(name:string, roomId:string) {
  const db = getFirestore();
  const roomRef = doc(db, COLLECTIONS.ROOM, roomId)
  await setDoc(roomRef, {name:name}, {merge: true})
}
