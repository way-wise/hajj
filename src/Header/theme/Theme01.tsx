'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { useAuth } from '@/providers/Auth'

interface HeaderTheme01Props {
  header: Header
}

const threshold = 1000

const HeaderTheme01: React.FC<HeaderTheme01Props> = ({ header }) => {
  const { user, logout } = useAuth()
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
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

  const doLogout = async () => {
    try {
      const start = Date.now()

      await logout()

      const end = Date.now()
      const time = end - start
      const delay = threshold - time

      // give the illusion of a delay, so that the content doesn't blink on fast networks
      if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay))
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
    }
  }

  return (
    <header className="header left-0 top-0 z-40 py-3 flex w-full items-center dark:bg-gray-dark dark:shadow-sticky-dark sticky bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition">
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-44 sm:w-60 md:w-80 lg:96 max-w-full px-4 xl:mr-12">
            <Link href="/" className={`header-logo block w-full max-w-[200px] py-6 lg:py-3`}>
              {header?.logo && (
                <Media
                  resource={header?.logo}
                  className="w-44 sm:w-52 md:w-56 lg:max-w-60 h-auto dark:brightness-200"
                  priority
                />
              )}
            </Link>
          </div>
          <div className="flex w-full items-center justify-end px-4">
            <div>
              <button
                onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                className="rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
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
              <nav
                id="navbarCollapse"
                className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-dark lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                  navbarOpen ? 'visibility top-full opacity-100' : 'invisible top-[120%] opacity-0'
                }`}
              >
                <ul className="block lg:flex lg:space-x-8">
                  {navItems.map((menuItem, index) => (
                    <li key={index} className="group relative">
                      {menuItem.subNavItems && menuItem.subNavItems.length === 0 ? (
                        <>
                          <CMSLink
                            {...menuItem?.link}
                            appearance="link"
                            className={`font-medium block py-2 text-base lg:mr-0 lg:px-0 lg:py-6 no-underline ${
                              pathname === menuItem?.link?.url
                                ? 'text-primary dark:text-white'
                                : 'text-dark hover:text-primary dark:text-white/70 dark:hover:text-white'
                            }`}
                          />
                        </>
                      ) : (
                        <>
                          <div
                            onClick={() => handleSubmenu(index)}
                            className="font-medium flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:px-0 lg:py-6"
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
                          </div>
                          <div
                            className={`submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[280px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
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
            </div>
            <div className="flex items-center justify-end">
              <div>
                <ThemeSelector />
              </div>
              {user && user?.id ? (
                <div className="relative group">
                  <div
                    onMouseEnter={() => setUserMenu(true)}
                    className="font-medium flex cursor-pointer items-center justify-between text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white"
                  >
                    <span className="py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white block">
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
                    </span>
                  </div>
                  <div
                    className={`submenu relative -right-4 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[280px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                      !userMenu ? 'block' : 'hidden'
                    }`}
                  >
                    <Link
                      className="block rounded py-2.5 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                      href={'/profile'}
                    >
                      My Profile
                    </Link>
                    <Link
                      className="block rounded py-2.5 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                      href={'/projects'}
                    >
                      My Projects
                    </Link>
                    <span
                      className="block cursor-pointer rounded py-2.5 text-base text-danger hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                      onClick={() => doLogout()}
                    >
                      Logout
                    </span>
                  </div>
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="hidden py-3 text-base font-medium text-dark hover:opacity-70 dark:text-white md:block"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="bi bi-person-circle fill-gray-600 dark:fill-gray-300"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </svg>
                </Link>
              )}

              {/* <Link
                  href="/signup"
                  className="ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-sm bg-primary px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
                >
                  Sign Up
                </Link> */}
            </div>
            {header?.callback && (
              <div className="bg-primary py-2 pl-3 pr-4 hidden xl:flex items-center justify-center gap-3 ml-6 rounded-xl">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    fill="#ffffff"
                    className="bi bi-telephone"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                  </svg>
                </div>
                <div>
                  {header?.callback.split(',').map((substring, idx) => {
                    return (
                      <div key={idx}>
                        <a
                          href={`tel:${substring}`}
                          className="text-lg block font-semibold text-white"
                        >
                          {substring}
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderTheme01
