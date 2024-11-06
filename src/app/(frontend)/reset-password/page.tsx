import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { ResetPasswordForm } from './ResetPasswordForm'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export default async function ResetPassword() {
  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md space-y-6  my-16">
      <h1 className="text-center text-4xl">Reset Password</h1>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Enter a new password.',
  openGraph: mergeOpenGraph({
    title: 'Reset Password',
    url: '/reset-password',
  }),
}
