"use client";

import { useContext, useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import React from "react";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [changingName, setChangingName] = useState(false)
  const [userName, setUserName] = useState("")
  let isMounted=true
  async function getName(userId) {
    const { data } = await supabase.from("users").select("name").eq("user_id", userId).maybeSingle()
    return data?.name ?? ""
  }

  async function loadUser(user) {
    if (!isMounted) return;

    setCurrentUser(user);
    setUserLoggedIn(Boolean(user));

    if (user) {
      const name = await getName(user.id);

      if (isMounted) {
        setUserName(name);
      }
    } else {
      setUserName("");
    }

    if (isMounted) {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      await loadUser(user);
    }

    initialize();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setLoading(true);
        await loadUser(session?.user ?? null);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    changingName,
    userName,
    setChangingName,
    setUserName
  }
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}


