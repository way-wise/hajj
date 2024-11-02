import React from 'react'
import { getMeUser } from '@/utilities/getMeUser'
import { RenderParams } from '@/components/RenderParams'
import AccountForm from './AccountForm/page'
import { LogoutPage } from '../logout/LogoutPage'

export default async function Account() {

    const { user } = await getMeUser({
        nullUserRedirect: `/signin?error=${encodeURIComponent(
            'You must be logged in to access your account.',
        )}&redirect=${encodeURIComponent('/account')}`,
    })

    return (
        <div className='max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md space-y-6  my-16'>
            <div className="mb-8">
                <RenderParams className="mt-4" />
            </div>

            <div className="my-8">
                <h1 className='text-center text-4xl'>Update your profile</h1>
                <AccountForm user={user} />
                <div className="flex justify-end my-4">
                    <LogoutPage />
                </div>
            </div>
        </div>
    )
}
