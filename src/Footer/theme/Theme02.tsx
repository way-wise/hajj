'use client'

import React from 'react'
import Link from 'next/link'

import { Footer as FooterType, Media as MediaType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { usePathname } from 'next/navigation'

const Theme02: React.FC<{ footer: FooterType | null | undefined }> = ({ footer }) => {
    const pathname = usePathname()

    if (pathname.includes('invoice')) {
        return
    }
    const navItems = footer?.footerNavItems || []
    const bg = footer?.footerBg ? (footer?.footerBg as MediaType).url : ''

    return (
        <footer className="bg-primary dark:bg-slate-900 mt-auto">
            <div className="container pt-10">
                <div className="w-full sm:flex justify-between items-center pb-[35px]">
                    <Link href="/" className="mb-8 inline-block">
                        {footer?.footerLogo && (
                            <Media
                                resource={footer?.footerLogo}
                                className="w-64 h-auto dark:brightness-200"
                                priority
                            />
                        )}
                    </Link>
                    <div className="flex items-center">
                        {footer?.socialLinks &&
                            footer?.socialLinks.map(
                                (socialLink, sIndex) =>
                                    socialLink?.link?.url && (
                                        <Link
                                            key={'social' + sIndex}
                                            href={socialLink?.link?.url}
                                            className="mr-5 text-black duration-300 hover:text-primary dark:text-white dark:hover:text-primary"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {socialLink?.socialLogo && (
                                                <Media
                                                    resource={socialLink?.socialLogo}
                                                    className="w-8 h-8 dark:invert dark:brightness-200"
                                                    priority
                                                />
                                            )}
                                        </Link>
                                    ),
                            )}
                    </div>
                </div>
            </div>
            <hr className="border-white/10" />
            <div className="container">
                <div className="footer-top pb-14 grid grid-cols-2 gap-5 md:grid-cols-4 pt-10">
                    {navItems &&
                        navItems.map((navItem, nIndex) => (
                            <nav key={'navItems' + nIndex} className="flex-grow col-span-full md:col-span-1">
                                <h2 className="mb-6 md:mb-10 text-xl font-medium text-white dark:text-white">
                                    {navItem?.navTitle}
                                </h2>
                                <ul className="list-none m-0 p-0">
                                    {navItem?.navItems &&
                                        navItem?.navItems.map((linkItem, lIndex) => (
                                            <li key={lIndex} className="mb-2 leading-6">
                                                {linkItem?.link && (
                                                    <CMSLink
                                                        {...linkItem?.link}
                                                        className="mb-1 md:mb-4 inline-block text-base text-white duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                                                    />
                                                )}
                                            </li>
                                        ))}
                                </ul>
                            </nav>
                        ))}
                    <div className="flex-grow col-span-full md:col-span-1">
                        <h3 className="widget-title mb-3 text-base-600 text-white">
                            Subscribe to our blog
                        </h3>
                        <ul>
                            <li>
                                <form action="https://jobflix.templatecookie.com/subscribe" method="POST" className="pt-2 space-y-3">
                                    <input type="hidden" name="_token" value="LX7ZxIad6FThbCthYkZzy1zXD638AU1kbL93kxlW" autoComplete="off" />
                                    <div className="w-full flex items-center gap-3 px-[18px] rounded-lg border border-white/40 shadow-gray-base-1 hover:border-secondary-500 focus-within:border-secondary-500 transition duration-200 ease-linear">
                                        <span className="text-secondary-500">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.744 2.63297L21.272 7.52618C21.538 7.69908 21.671 7.78554 21.7674 7.90085C21.8527 8.00293 21.9167 8.12101 21.9558 8.24816C22 8.3918 22 8.55043 22 8.86769V16.1994C22 17.8796 22 18.7196 21.673 19.3614C21.3854 19.9259 20.9265 20.3848 20.362 20.6724C19.7202 20.9994 18.8802 20.9994 17.2 20.9994H6.8C5.11984 20.9994 4.27976 20.9994 3.63803 20.6724C3.07354 20.3848 2.6146 19.9259 2.32698 19.3614C2 18.7196 2 17.8796 2 16.1994V8.86769C2 8.55043 2 8.3918 2.04417 8.24816C2.08327 8.12101 2.14735 8.00293 2.23265 7.90085C2.32901 7.78554 2.46201 7.69908 2.72802 7.52618L10.256 2.63297M13.744 2.63297C13.1127 2.22266 12.7971 2.01751 12.457 1.93768C12.1564 1.86713 11.8436 1.86713 11.543 1.93768C11.2029 2.01751 10.8873 2.22266 10.256 2.63297M13.744 2.63297L19.9361 6.65788C20.624 7.10498 20.9679 7.32854 21.087 7.61203C21.1911 7.85978 21.1911 8.139 21.087 8.38676C20.9679 8.67025 20.624 8.8938 19.9361 9.3409L13.744 13.3658C13.1127 13.7761 12.7971 13.9813 12.457 14.0611C12.1564 14.1317 11.8436 14.1317 11.543 14.0611C11.2029 13.9813 10.8873 13.7761 10.256 13.3658L4.06386 9.3409C3.37601 8.8938 3.03209 8.67025 2.91297 8.38676C2.80888 8.139 2.80888 7.85978 2.91297 7.61203C3.03209 7.32854 3.37601 7.10498 4.06386 6.65788L10.256 2.63297M21.5 18.9994L14.8572 12.9994M9.14282 12.9994L2.5 18.9994" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                        </span>
                                        <input type="email" name="email" placeholder="Email address" className="w-full bg-transparent placeholder:text-white/40 text-white border-0 outline-none focus:ring-0 py-[10px]" />
                                    </div>
                                    <button type="submit" className="bg-rose-500 px-5 py-2 rounded-lg text-white"> Subscribe </button>
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom py-3 flex gap-4 flex-wrap-reverse justify-center items-center border-t border-white/10">
                    <div className="flex-grow">
                        <p className="body-base-400 text-white/40 flex justify-center">
                            {footer?.copyright}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}


export default Theme02