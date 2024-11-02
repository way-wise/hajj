'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import { User } from '@/payload-types'

// eslint-disable-next-line no-unused-vars
type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Create = (args: { email: string; password: string; passwordConfirm: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Login = (args: { email: string; password: string }) => Promise<User> // eslint-disable-line no-unused-vars

type Logout = () => Promise<void>

type AuthContext = {
  user?: User | null
  updateUser: (user: Partial<User>) => void // eslint-disable-line no-unused-vars
  setUser: (user: User | null) => void // eslint-disable-line no-unused-vars
  logout: Logout
  login: Login
  resetPassword: ResetPassword
  forgotPassword: ForgotPassword
}

const Context = createContext({} as AuthContext)

const CLOUD_CONNECTION_ERROR = 'An error occurred while attempting to connect to Payload Cloud'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const fetchedMe = useRef(false)

  const login = useCallback<Login>(async args => {
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: args.email,
          password: args.password
        }),
      })
      const data = await req.json()

      if (data && data?.user) {
        setUser(data?.user)
        return data?.user
      }
      else {
        return data.user = data.errors[0]
      }

    } catch (e) {
      throw new Error(e.message)
    }
  }, [])

  const logout = useCallback<Logout>(async () => {
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await req.json()

      if (data) {
        setUser(null)
      } else {
        throw new Error('An error occurred while attempting to logout.')
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }, [])

  useEffect(() => {
    if (fetchedMe.current) return
    fetchedMe.current = true

    const fetchMe = async () => {
      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
        const data = await req.json()

        if (data && data?.user) {
          setUser(data?.user || null)
        } else {
          throw new Error('An error occurred while attempting to fetch user.')
        }
      } catch (e) {
        throw new Error(e.message)
      }
    }

    fetchMe()
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async args => {
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: args.email
        }),
      })
      const data = await req.json()

      if (data) {
        setUser(null)
      } else {
        throw new Error('An error occurred while attempting to reset your password.')
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }, [])

  const resetPassword = useCallback<ResetPassword>(async args => {
    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: args.token,
          password: args.password
        }),
      })
      const data = await req.json()

      if (data && data?.user) {
        setUser(data?.user)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }, [])

  const updateUser = useCallback(
    async (incomingUser: Partial<User>) => {
      try {
        if (!user || !incomingUser) throw new Error('No user found to update.')

          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user?.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(incomingUser),
          })
          const data = await req.json()

        if (data && data?.doc) {
          setUser(data?.doc)
        } else {
          throw new Error('An error occurred while updating your account.')
        }
      } catch (e) {
        throw new Error(e.message)
      }
    },
    [user],
  )

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        resetPassword,
        forgotPassword,
        updateUser,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth<T = User> = () => AuthContext // eslint-disable-line no-unused-vars

export const useAuth: UseAuth = () => useContext(Context)
