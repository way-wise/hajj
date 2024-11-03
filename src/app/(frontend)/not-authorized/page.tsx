'use client'

import Link from 'next/link'

const NotAuthorizedPage = () => {
  return (
    <div className="flex flex-col gap-3 my-10 max-w-5xl mx-auto">
      <h2>Access denied</h2>
      <p>You are not permitted to visit this page</p>
      <Link href="/projects" className="bg-primary px-5 py-2 self-start text-white">
        Go Back
      </Link>
    </div>
  )
}

export default NotAuthorizedPage
