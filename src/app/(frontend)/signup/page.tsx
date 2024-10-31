import { Metadata } from 'next'
import { SignupClient } from './page.client'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Image from 'next/image'

export default async () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-70px)]">
      <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900">
            <Image
              src="/assets/signup.jpg"
              fill
              alt="Authentication"
              className="block object-cover"
            />
          </div>

          <div className="relative z-20 mb-auto">
            <p className="w-[40rem] leading-10 mx-auto text-3xl text-gray-800">
              Sign up today to gain access to cutting-edge software solutions, exclusive resources,
              and the latest industry insights.
            </p>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <SignupClient />
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Signup | Way-Wise Tech',
  description: 'Signup for Way-Wise Tech',
  openGraph: mergeOpenGraph({
    title: 'Signup | Way-Wise Tech',
    url: '/signup',
  }),
}
