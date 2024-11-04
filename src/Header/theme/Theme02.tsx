'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

interface HeaderTheme02Props {
  header: Header
}

const HeaderTheme02: React.FC<HeaderTheme02Props> = ({ header }) => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen)
  }

  // Sticky Navbar
  const [sticky, setSticky] = useState(false)
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true)
    } else {
      setSticky(false)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleStickyNavbar)
  })

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1)
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1)
    } else {
      setOpenIndex(index)
    }
  }

  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const navItems = header?.navItems || []

  if (pathname.includes('invoice')) {
    return
  }

  return (
    <header>
      <div className="container">
        <div className="flex justify-between items-center py-2.5">
          {/* mobile navigation */}
          <nav className="block md:!hidden">
            <button
              onClick={navbarToggleHandler}
              id="navbarToggler"
              aria-label="Mobile Menu"
              className=""
            >
              <span
                className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                  navbarOpen ? ' top-[7px] rotate-45' : ' '
                }`}
              />
              <span
                className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                  navbarOpen ? 'opacity-0 ' : ' '
                }`}
              />
              <span
                className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                  navbarOpen ? ' top-[-8px] -rotate-45' : ' '
                }`}
              />
            </button>
            <ul className="fixed z-[999] top-0 start-0 w-full h-screen max-w-[90%] bg-white/10 dark:bg-slate-900/70 backdrop-blur">
              {navItems.map((menuItem, index) => (
                <li key={index} className="group relative">
                  {menuItem.subNavItems && menuItem.subNavItems.length === 0 ? (
                    <>
                      <CMSLink
                        {...menuItem?.link}
                        appearance="link"
                        className={`font-medium flex justify-start px-5 py-2 text-base no-underline ${
                          pathname === menuItem?.link?.url
                            ? 'text-primary dark:text-white'
                            : 'text-dark hover:text-primary dark:text-white/70 dark:hover:text-white'
                        }`}
                      />
                    </>
                  ) : (
                    <>
                      <p
                        onClick={() => handleSubmenu(index)}
                        className="font-medium flex gap-3 px-5 cursor-pointer items-center justify-start py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-3"
                      >
                        {menuItem?.link?.label}
                        <span className="pl-1">
                          <svg width="25" height="24" viewBox="0 0 25 24">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </p>
                      <div
                        className={`submenu rounded-sm bg-white z-[999] transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark absolute top-full start-20 ${
                          openIndex === index ? 'visible' : 'invisible'
                        }`}
                      >
                        {menuItem.subNavItems &&
                          menuItem.subNavItems.map((submenuItem, index) => (
                            <CMSLink
                              key={index}
                              {...submenuItem?.link}
                              appearance="link"
                              className="block rounded-md p-2.5 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                            />
                          ))}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          {/* desktop navigation */}
          <nav className="hidden md:!block">
            <ul className="hidden md:!flex items-center gap-3 md:!gap-5">
              {navItems.map((menuItem, index) => (
                <li key={index} className="group relative">
                  {menuItem.subNavItems && menuItem.subNavItems.length === 0 ? (
                    <>
                      <CMSLink
                        {...menuItem?.link}
                        appearance="link"
                        className={`font-medium flex py-2 text-base lg:mr-0 lg:!inline-flex lg:!px-0 lg:!py-3 no-underline ${
                          pathname === menuItem?.link?.url
                            ? 'text-primary dark:text-white'
                            : 'text-dark hover:text-primary dark:text-white/70 dark:hover:text-white'
                        }`}
                      />
                    </>
                  ) : (
                    <>
                      <p
                        onClick={() => handleSubmenu(index)}
                        className="font-medium flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-3"
                      >
                        {menuItem?.link?.label}
                        <span className="pl-1">
                          <svg width="25" height="24" viewBox="0 0 25 24">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </p>
                      <div
                        className={`submenu relative left-0 top-full rounded-sm bg-white z-[999] transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[280px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                          openIndex === index ? 'block' : 'hidden'
                        }`}
                      >
                        {menuItem.subNavItems &&
                          menuItem.subNavItems.map((submenuItem, index) => (
                            <CMSLink
                              key={index}
                              {...submenuItem?.link}
                              appearance="link"
                              className="block rounded py-2.5 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                            />
                          ))}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex gap-3 items-center">
            {header?.callback &&
              header?.callback.split(',').map((substring, idx) => {
                return (
                  <a
                    href={`tel:${substring}`}
                    className="inline-flex gap-1.5 items-center font-medium text-xs sm:text-base"
                    key={idx}
                  >
                    <svg
                      className="w-4 h-4 sm:w-6 sm:h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 18V12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12V18M5.5 21C4.11929 21 3 19.8807 3 18.5V16.5C3 15.1193 4.11929 14 5.5 14C6.88071 14 8 15.1193 8 16.5V18.5C8 19.8807 6.88071 21 5.5 21ZM18.5 21C17.1193 21 16 19.8807 16 18.5V16.5C16 15.1193 17.1193 14 18.5 14C19.8807 14 21 15.1193 21 16.5V18.5C21 19.8807 19.8807 21 18.5 21Z"
                        stroke="currentColor"
                        stroke-width="2"
                        strokeLinecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <span>{substring}</span>
                  </a>
                )
              })}
          </div>
        </div>
      </div>
      <div className="bg-primary">
        <div className="container">
          <div className="py-2 flex justify-between items-center">
            <div>
              <Link href="/" className={`header-logo block w-full max-w-[200px] py-3`}>
                {header?.logo && (
                  <Media
                    resource={header?.logo}
                    className="w-44 sm:w-52 md:w-56 lg:max-w-60 h-auto dark:brightness-200"
                    priority
                  />
                )}
              </Link>
            </div>
            <div className="flex gap-4 items-center">
              <Link
                href="/signin"
                className="py-3 text-base font-medium text-white hover:opacity-70 dark:text-black block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-person-circle fill-gray-600 dark:fill-gray-300"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                  />
                </svg>
              </Link>
              <a
                href="#"
                className="hidden sm:inline-flex justify-center items-center bg-white px-4 py-2.5 rounded-lg text-black"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderTheme02
