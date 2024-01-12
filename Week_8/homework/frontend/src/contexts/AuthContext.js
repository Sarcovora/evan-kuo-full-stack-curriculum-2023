// Importing necessary hooks and functionalities
import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Creating a context for authentication. Contexts provide a way to pass data through
// the component tree without having to pass props down manually at every level.
const AuthContext = createContext();

const firebaseConfig = {
  apiKey: "AIzaSyCaBy8FEhNEwMc-U7osrdeC-pfs7oeYMVE",
  authDomain: "tpeo-todo-backend.firebaseapp.com",
  projectId: "tpeo-todo-backend",
  storageBucket: "tpeo-todo-backend.appspot.com",
  messagingSenderId: "51384821691",
  appId: "1:51384821691:web:e8d913f9a26dd0c728869e",
  measurementId: "G-DRZNQ9F8KW"
};

const app = initializeApp(firebaseConfig);
// const app = initializeApp(JSON.parse(process.env.FIREBASE_CONFIG));
const auth = getAuth(app);

export const useAuth = () => {
  // console.log("from useAuth: " + useContext(AuthContext));
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [loginError, setLoginError] = useState(null);

  const register = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setCurrentUser(userCredential.user);
        navigate("/");
      })
      .catch((err) => {
        setLoginError(err.message);
      });
    // console.log("registered as: " + email + " and password: " + password)
  };

  // Login function that validates the provided username and password.
  const login = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setCurrentUser(userCredential.user);
        navigate("/");
      })
      .catch((err) => {
        setLoginError(err.message);
      });
      // console.log("logged in as: " + email + " and password: " + password)
  };

  // Logout function to clear user data and redirect to the login page.
  const logout = () => {
    auth.signOut().then(() => {
      setCurrentUser(null);
      navigate("/login");
    });
  };

  // An object containing our state and functions related to authentication.
  // By using this context, child components can easily access and use these without prop drilling.
  const contextValue = {
    currentUser,
    register,
    login,
    logout,
    loginError,
  };

  // The AuthProvider component uses the AuthContext.Provider to wrap its children.
  // This makes the contextValue available to all children and grandchildren.
  // Instead of manually passing down data and functions, components inside this provider can
  // simply use the useAuth() hook to access anything they need.
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
