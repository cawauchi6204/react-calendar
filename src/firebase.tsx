import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { FirebaseContext } from './contexts'

export const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FB_DEV_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDAR_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_FB_MESUREMENT_ID
})

export const loginWithEmail = async (email: string, password: string) => {
  try {
    await app.auth().signInWithEmailAndPassword(email, password)
  } catch (error) {
    alert(error)
  }
}

export const loginWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  try {
    await firebase.auth().signInWithPopup(provider)
  } catch (error) {
    alert(error)
  }
}

export const signupWithEmail = async (email: string, password: string) => {
  try {
    await app.auth().createUserWithEmailAndPassword(email, password)
  } catch (error) {
    alert(error)
  }
}

export const logout = () => {
  app.auth().signOut()
}

export const FirebaseProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState(null)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    app.auth().onAuthStateChanged((user: any) => {
      setUser(user)
      setPending(false)
    })
  }, [])

  if (pending) {
    return <div className='loading'>ローディング中...</div>
  }

  return (
    <FirebaseContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}
