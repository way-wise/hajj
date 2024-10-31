'use client'

import React from 'react'
import Link from 'next/link'

import { Footer as FooterType, Media as MediaType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { usePathname } from 'next/navigation'

const Theme01: React.FC<{ footer: FooterType | null | undefined }> = ({ footer }) => {
  const pathname = usePathname()

  if (pathname.includes('invoice')) {
    return
  }
  const navItems = footer?.footerNavItems || []
  const bg = footer?.footerBg ? (footer?.footerBg as MediaType).url : ''

  return (
    <footer
      className="relative z-10 bg-white pt-16 dark:bg-gray-dark md:pt-20 lg:pt-24"
      style={{
        backgroundImage: `url("${bg}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundColor: '#ddd',
      }}
    >
      <div className="absolute w-full h-full left-0 top-0 -z-10 bg-gradient-to-t from-white/10 via-white/90 to-white dark:from-dark/10 dark:via-dark/90 dark:to-dark"></div>
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
            <div className="mb-12 max-w-[360px] lg:mb-16">
              <Link href="/" className="mb-8 inline-block">
                {footer?.footerLogo && (
                  <Media
                    resource={footer?.footerLogo}
                    className="w-64 h-auto dark:brightness-200"
                    priority
                  />
                )}
              </Link>
              <p className="mb-9 text-base leading-relaxed text-black dark:text-white">
                {footer?.about}
              </p>
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

          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-8/12 xl:w-7/12">
            <div className="col-span-2 md:col-span-4 lg:col-span-7 grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
              {navItems &&
                navItems.map((navItem, nIndex) => (
                  <nav key={'navItems' + nIndex} className="col-span-2 md:col-span-4 lg:col-span-4">
                    <h2 className="mb-6 md:mb-10 text-xl font-medium text-black dark:text-white">
                      {navItem?.navTitle}
                    </h2>
                    <ul className="list-none m-0 p-0">
                      {navItem?.navItems &&
                        navItem?.navItems.map((linkItem, lIndex) => (
                          <li key={lIndex} className="mb-2 leading-6">
                            {linkItem?.link && (
                              <CMSLink
                                {...linkItem?.link}
                                className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                              />
                            )}
                          </li>
                        ))}
                    </ul>
                  </nav>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 bg-white/20 backdrop-blur">
        <p className="text-center text-base text-gray-900 dark:text-gray-300">
          <span className="text-lg font-light">©</span> {new Date().getFullYear()}{' '}
          {footer?.copyright}
        </p>
      </div>
    </footer>
  )
}

export default Theme01
