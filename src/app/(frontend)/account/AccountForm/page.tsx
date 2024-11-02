'use client'

import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from '@/payload-types'


type FormData = {
  email: string
  name: string
  password: string
  passwordConfirm: string
}

interface AccountFormProps {
  user: User
}

const AccountForm: React.FC<AccountFormProps> = ({ user }) => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [changePassword, setChangePassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
    watch,
  } = useForm<FormData>()

  const password = watch('password', '')

  const router = useRouter()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (user) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
          credentials: 'include',
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const json = await response.json()
          setSuccess('Successfully updated account.')
          setError('')
          setChangePassword(false)
          reset({
            email: json.doc.email,
            name: json.doc.name,
            password: '',
            passwordConfirm: '',
          })
        } else {
          setError('There was a problem updating your account.')
        }
      }
    },
    [user, reset],
  )

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent(
          'You must be logged in to view this page.',
        )}&redirect=${encodeURIComponent('/account')}`,
      )
    }

    if (user) {
      reset({
        email: user.email,
        name: user.name ?? '',
        password: '',
        passwordConfirm: '',
      })
    }
  }, [user, router, reset, changePassword])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto max-w-lg bg-white rounded-lg">
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

      {!changePassword ? (
        <Fragment>
          <p className="text-gray-700 mb-6">
            Change your account details below, or{' '}
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => setChangePassword(!changePassword)}
            >
              click here
            </button>{' '}
            to change your password.
          </p>

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

          <div className="relative my-6">
            <Input
              type="text"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-pink-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p className="text-gray-700 mb-6">
            Change your password below, or{' '}
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => setChangePassword(!changePassword)}
            >
              cancel
            </button>
            .
          </p>

          <div className="relative my-6">
            <Input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="relative my-6">
            <Input
              type="password"
              placeholder="Confirm Password"
              {...register("passwordConfirm", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || 'The passwords do not match',
              })}
            />
            {errors.passwordConfirm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>
        </Fragment>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary hover:text-black transition duration-200"
      >{isLoading ? 'Processing' : changePassword ? 'Change Password' : 'Update Account'}</Button>
    </form>
  )
}

export default AccountForm
