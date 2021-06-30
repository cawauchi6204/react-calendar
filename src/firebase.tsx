import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore';

import { FirebaseContext } from './contexts'
import { LinearProgress } from '@material-ui/core'

export const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FB_DEV_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDAR_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_FB_MESUREMENT_ID
})

const db = firebase.firestore()

export const loginWithEmail = async (_email: string, _password: string) => {
  try {
    await app.auth().signInWithEmailAndPassword(_email, _password)
  } catch (_error) {
    alert(_error)
  }
}

export const loginWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  try {
    await firebase.auth().signInWithPopup(provider).then((_credentials) => {
      if (_credentials && _credentials.user) {
        const uid = _credentials.user.uid
        const email = _credentials.user.email
        db.collection('users').doc(uid).set({
          user_email: email,
        })
      }
    })
  } catch (error) {
    alert(error)
  }
}

export const signupWithEmail = async (_email: string, _password: string) => {
  try {
    await app.auth().createUserWithEmailAndPassword(_email, _password).then((_credentials) => {
      if (_credentials && _credentials.user) {
        const uid = _credentials.user.uid
        db.collection('users').doc(uid).set({
          user_email: _email,
        })
      }
    })
  } catch (_error) {
    alert(_error)
  }
}

export const logout = () => {
  app.auth().signOut()
}

export const FirebaseProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    app.auth().onAuthStateChanged(user => {
      setUser(user)
      setPending(false)
    })
  }, [])

  if (pending) {
    return <LinearProgress />
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
