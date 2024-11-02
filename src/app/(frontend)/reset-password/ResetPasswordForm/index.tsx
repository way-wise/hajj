'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/providers/Auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FormData = {
  password: string
  passwordConfirm: string
  token: string
}

export const ResetPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const { login } = useAuth()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>()

  const password = useRef<string>('')
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`,
        {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      )

      if (response.ok) {
        const json = await response.json()

        await login({ email: json.user.email, password: data.password })
      } else {
        setError('There was a problem while resetting your password. Please try again later.')
      }
    },
    [],
  )

  useEffect(() => {
    reset({ token: token || undefined })
  }, [reset, token])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {error && (
        <div className="mb-6 p-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      <div className='flex flex-col gap-6'>
        <Input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}

        <Input
          type="password"
          placeholder="Confirm Password"
          {...register("passwordConfirm", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === password.current || 'The passwords do not match',
          })}
        />
        {errors.passwordConfirm && (
          <p className="text-red-500 text-sm mt-1">
            {errors.passwordConfirm.message}
          </p>
        )}

        <input type="hidden" {...register('token')} />
        <Button
        className='bg-primary'
          type="submit"
        >{isLoading ? 'Processing...' : 'Reset Password'}</Button>
      </div>
    </form>
  )
}
