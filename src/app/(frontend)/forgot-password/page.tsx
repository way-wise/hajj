import React from 'react'
import { Metadata } from 'next'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export default async function RecoverPassword() {
  return (
    <div className='max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md space-y-6  my-16'>
      <ForgotPasswordForm />
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Recover Password',
  description: 'Enter your email address to recover your password.',
  openGraph: mergeOpenGraph({
    title: 'Recover Password',
    url: '/recover-password',
  }),
}
