// src/auth.js

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

// LOGIN
export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// SIGNUP
export const signupUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// LOGOUT
export const logoutUser = () => signOut(auth);

// AUTH LISTENER
export const listenAuth = (callback) =>
  onAuthStateChanged(auth, callback);