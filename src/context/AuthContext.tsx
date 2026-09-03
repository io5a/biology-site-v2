import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/supabase-client'
import type { User } from '@supabase/supabase-js'

type AuthContextValue = {
  currentUser: User | null
  userLoggedIn: boolean
  loading: boolean
  changingName: boolean
  userName: string
  setChangingName: (value: boolean) => void
  setUserName: (value: string) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [changingName, setChangingName] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    let active = true

    const syncUser = async (user: User | null) => {
      if (!active) return

      setCurrentUser(user)
      setUserLoggedIn(Boolean(user))

      if (user) {
        const { data } = await supabase.from('users').select('name').eq('user_id', user.id).maybeSingle()
        if (active) setUserName(data?.name ?? '')
      } else {
        if (active) setUserName('')
      }

      if (active) setLoading(false)
    }

    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      await syncUser(user)
    }

    void initialize()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await syncUser(session?.user ?? null)
    })

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextValue = {
    currentUser,
    userLoggedIn,
    loading,
    changingName,
    userName,
    setChangingName,
    setUserName,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
