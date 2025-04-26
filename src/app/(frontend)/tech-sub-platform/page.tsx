import Link from "next/link"

const TechSubPlatform = () => {
  return (
    <div className="container py-28">
        <h1 className="text-center text-3xl font-bold">Tech Sub Platform</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <a href="https://github.com/way-wise" target="_blank" rel="noopener noreferrer" className="block">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-gray-800 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </div>
                    <h3 className="text-xl text-white font-semibold text-center mb-2">GitHub</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center max-w-[260px] mx-auto">Access your code repositories and collaborate with other developers</p>
                </div>
            </a>

            <Link href="https://preview--project-zenflow-manager.lovable.app/" className="block">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-xl text-white font-semibold text-center mb-2">Upwork Contracts</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center max-w-[260px] mx-auto">Browse our Upwork active contracts and get updates</p>
                </div>
            </Link>

            <a href="https://bids.waywisetech.com/" target="_blank" rel="noopener noreferrer" className="block">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-gray-800 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z"/>
                        </svg>
                    </div>
                    <h3 className="text-xl text-white font-semibold text-center mb-2">Upwork Bids</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center max-w-[260px] mx-auto">Browse our Upwork bids list and get updates</p>
                </div>
            </a>

            <Link href="https://jobs.waywisetech.com/" className="block">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-xl text-white font-semibold text-center mb-2">Local Jobs</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center max-w-[260px] mx-auto">Browse our local jobs list and get updates</p>
                </div>
            </Link>
        </div>
    </div>
  )
}

export default TechSubPlatform

