'use client'
import React from 'react'



type Theme01HeroType =
    | {
        subTitle?: React.ReactNode
        title?: React.ReactNode
        brief: React.ReactNode
        links: React.ReactNode
    }

export const Theme03Hero: React.FC<Theme01HeroType> = ({ subTitle, title, brief, links }) => {
    // console.log(children)
    return (
        // < !--Hero -- >
        <div className="bg-gradient-to-b from-violet-600/10 via-transparent">
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
                {/* <!-- Announcement Banner --> */}
                <div className="flex justify-center">
                    <a className="group inline-flex items-center bg-white/10 hover:bg-white/10 border border-white/10 p-1 ps-4 rounded-full shadow-md focus:outline-none focus:bg-white/10" href="../figma.html">
                        <p className="me-2 text-white text-sm">
                            {subTitle}
                        </p>
                        <span className="group-hover:bg-white/10 py-1.5 px-2.5 flex justify-center items-center gap-x-2 rounded-full bg-white/10 font-semibold text-white text-sm">
                            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </span>
                    </a>
                </div>
                {/* <!-- End Announcement Banner --> */}

                {/* <!-- Title --> */}
                <div className="max-w-3xl text-center mx-auto">
                    <h1 className="block font-medium text-gray-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                        {title}
                    </h1>
                </div>
                {/* <!-- End Title --> */}

                <div className="max-w-3xl text-center mx-auto">
                    <p className="text-lg text-white/70">{brief}</p>
                </div>

                {/* <!-- Buttons --> */}
                {Array.isArray(links) && links.length > 0 && (
                    <ul className="mt-8 gap-3 flex justify-center">
                        {links.map(({ link }, i) => {
                            console.log(link)
                            return (
                                <li key={i}>
                                    <a className={`inline-flex justify-center items-center gap-x-3 text-center hover:from-violet-600 hover:to-blue-600 focus:outline-none focus:from-violet-600 focus:to-blue-600 border border-transparent text-white text-sm font-medium rounded-full py-3 px-4 ${link.appearance === 'default' ? 'bg-gradient-to-tl from-blue-600 to-violet-600' : 'bg-transparent border border-violet-600'}`} href={link.url}>
                                        {link.label}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                )}

                {/* <!-- End Buttons --> */}
            </div>
        </div>
        // <!--End Hero-- >
    )
}