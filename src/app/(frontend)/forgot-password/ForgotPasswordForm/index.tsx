'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/providers/Auth'

type FormData = {
  email: string
}

export const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { user, forgotPassword } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = useCallback(async (data: FormData) => {

    try {
      await forgotPassword(data)
      setSuccess(true)
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  return (
    <div className='max-w-md w-full mx-auto bg-white p-4 rounded-lg space-y-6'>
      {!success && (
        <React.Fragment>
          <h1 className="text-2xl font-bold">Recover Password</h1>
          <div className="w-[66.66%] md:w-full">
            <p className='pb-4'>
              {`Please enter your email below. You will receive an email message with instructions on
              how to reset your password. `}
              <Link href="/signin" className="text-primary hover:underline">
                Signin
              </Link>
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {error && (
                <div className="mb-6 p-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 text-green-700 bg-green-100 border border-green-400 rounded-lg">
                  <p>{success}</p>
                </div>
              )}

              <div className="relative my-6">
                <Input
                  type="text"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-pink-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
              >Recover Password</Button>
            </form>
          </div>
        </React.Fragment>
      )}
      {success && (
        <React.Fragment>
          <h1 className="text-2xl font-bold">Request submitted</h1>
          <p>Check your email for a link that will allow you to securely reset your password.</p>
        </React.Fragment>
      )}
    </div>
  )
}
