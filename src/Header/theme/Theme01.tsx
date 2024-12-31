'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { Header } from '@/payload-types'
import { useAuth } from '@/providers/Auth'

interface HeaderTheme01Props {
  header: Header
}

const threshold = 1000

const HeaderTheme01: React.FC<HeaderTheme01Props> = ({ header }) => {
  const { user, logout } = useAuth()
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen)
  }

  // Sticky Navbar
  const [sticky, setSticky] = useState(false)
  const handleStickyNavbar = () => {
    if (window.scrollY >= 120) {
      setSticky(true)
    } else {
      setSticky(false)
    }
  }
  useEffect(() => {
    if (header?.scrolLSticky) {
      window.addEventListener('scroll', handleStickyNavbar)
    }
  }, [header?.scrolLSticky])

  // Close userMenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  if (pathname.includes('invoice') || pathname.includes('hajj-query')) {
    return
  }

  const doLogout = async () => {
    try {
      const start = Date.now()

      await logout()

      const end = Date.now()
      const time = end - start
      const delay = threshold - time
      if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay))
    } catch (e) {
      console.error(e) // eslint-disable-line no-console
    }
  }

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 w-full backdrop-blur-lg
        ${header?.sticky ? ' sticky' : ''}
        transition ${sticky ? 'bg-white/90 shadow-sticky' : 'bg-gray-500/60'}`}
      >
        {header?.callback && (
          <div className="block xl:hidden bg-black/90 backdrop-blur py-1.5">
            <div className="container">
              <div className="flex justify-between gap-4">
                {header?.callback.split(',').map((substring, idx) => {
                  return (
                    <div key={idx}>
                      <a
                        href={`tel:${substring}`}
                        className={`text-sm sm:text-base inline-flex items-center gap-2 font-medium text-white`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="bi bi-telephone-fill size-4"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                          />
                        </svg>
                        {substring}
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
        <div className="py-5">
          <div className="container">
            <div className="relative -mx-4 flex items-center justify-between">
              <div className="w-44 sm:w-60 md:w-80 lg:w-96 max-w-full px-4 xl:mr-12">
                <Link href="/" className="header-logo">
                  {header?.scrolLSticky ? (
                    <>
                      {sticky ? (
                        <>
                          {header?.logo && (
                            <Media
                              resource={header?.logo}
                              className="w-44 sm:w-52 md:w-56 lg:max-w-60 h-auto dark:brightness-200"
                              priority={false}
                              loading={'lazy'}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          {header?.logo_dark && (
                            <Media
                              resource={header?.logo_dark}
                              className="w-44 sm:w-52 md:w-56 lg:max-w-60 h-auto dark:brightness-200"
                              priority={false}
                              loading={'lazy'}
                            />
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {header?.logo && (
                        <Media
                          resource={header?.logo}
                          className="w-44 sm:w-52 md:w-56 lg:max-w-60 h-auto dark:brightness-200"
                          priority={false}
                          loading={'lazy'}
                        />
                      )}
                    </>
                  )}
                </Link>
              </div>
              <div className="flex w-full items-center justify-end px-4 gap-6">
                {/* desktop navbar */}
                <nav className="hidden lg:block">
                  <ul className="flex space-x-8">
                    {navItems.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        {menuItem.subNavItems && menuItem.subNavItems.length === 0 ? (
                          <>
                            <CMSLink
                              {...menuItem?.link}
                              appearance="link"
                              className={`font-medium block py-2 text-base lg:mr-0 lg:px-0 lg:py-6 no-underline hover:text-primary ${
                                sticky ? 'text-dark' : 'text-white'
                              } hover:text-primary`}
                            />
                          </>
                        ) : (
                          <>
                            <div
                              onClick={() => handleSubmenu(index)}
                              className={`font-medium flex cursor-pointer items-center justify-between py-2 text-base group-hover:text-primary dark:group-hover:text-white lg:mr-0 lg:px-0 lg:py-6 ${
                                sticky ? 'text-dark' : 'text-white'
                              }`}
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
                              className={`submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[280px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${openIndex === index ? 'block' : 'hidden'}`}
                            >
                              {menuItem.subNavItems &&
                                menuItem.subNavItems.map((submenuItem, subIndex) => (
                                  <CMSLink
                                    key={subIndex}
                                    {...submenuItem?.link}
                                    appearance="link"
                                    className="block rounded py-2.5 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                                    // onClick={() => {
                                    //   setOpenIndex(-1); // Close submenu
                                    //   setNavbarOpen(false); // Close mobile menu if open
                                    // }}
                                  />
                                ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="flex items-center justify-end">
                  {user && user?.id ? (
                    <div className="relative group" ref={userMenuRef}>
                      <div
                        onClick={() => setUserMenu(!userMenu)}
                        className="font-medium flex cursor-pointer items-center justify-between text-base group-hover:text-primary dark:group-hover:text-white"
                      >
                        <span
                          className={`py-3 text-base font-medium hover:opacity-70 block ${
                            sticky ? 'text-dark' : 'text-white'
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            className="bi bi-person-circle"
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
                        onClick={() => setUserMenu(!userMenu)}
                        className={`absolute border border-gray-100 py-2 top-full right-0 bg-white rounded-lg shadow-lg min-w-max transition-all duration-300 ease-in-out ${userMenu ? 'visible opacity-100' : 'invisible opacity-0'}`}
                      >
                        <Link
                          className="hover:bg-gray-100 flex gap-3 items-center rounded py-2.5 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white px-3"
                          href={'/user-dashboard/profile'}
                        >
                          <span className="text-base font-medium text-dark hover:opacity-70 dark:text-white block">
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
                          <span>My Profile</span>
                        </Link>
                        <Link
                          className="hover:bg-gray-100 flex gap-3 items-center rounded py-2.5 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white px-3"
                          href={'/projects'}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                d="M16 6.00008V4.2844C16 3.51587 16 3.13161 15.8387 2.88321C15.6976 2.66587 15.4776 2.5118 15.2252 2.45345C14.9366 2.38677 14.5755 2.51809 13.8532 2.78073L6.57982 5.4256C6.01064 5.63257 5.72605 5.73606 5.51615 5.91845C5.33073 6.07956 5.18772 6.28374 5.09968 6.51304C5 6.77264 5 7.07546 5 7.6811V12.0001M9 17.0001H15M9 13.5001H15M9 10.0001H15M8.2 21.0001H15.8C16.9201 21.0001 17.4802 21.0001 17.908 20.7821C18.2843 20.5903 18.5903 20.2844 18.782 19.9081C19 19.4802 19 18.9202 19 17.8001V9.20008C19 8.07997 19 7.51992 18.782 7.0921C18.5903 6.71577 18.2843 6.40981 17.908 6.21807C17.4802 6.00008 16.9201 6.00008 15.8 6.00008H8.2C7.0799 6.00008 6.51984 6.00008 6.09202 6.21807C5.71569 6.40981 5.40973 6.71577 5.21799 7.0921C5 7.51992 5 8.07997 5 9.20008V17.8001C5 18.9202 5 19.4802 5.21799 19.9081C5.40973 20.2844 5.71569 20.5903 6.09202 20.7821C6.51984 21.0001 7.07989 21.0001 8.2 21.0001Z"
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </g>
                          </svg>
                          <span>My Projects</span>
                        </Link>
                        <Link
                          className="hover:bg-gray-100 flex gap-3 items-center rounded py-2.5 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white px-3"
                          href={'/user-dashboard/project-assets'}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#000000"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z"></path>
                            </g>
                          </svg>
                          Project Assets
                        </Link>
                        <Link
                          className="hover:bg-gray-100 flex gap-3 items-center rounded py-2.5 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white px-3"
                          href={'/user-dashboard/payment-history'}
                        >
                          <svg
                            viewBox="0 0 48 48"
                            width="24"
                            height="24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#000000"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path d="M0 0h48v48H0z" fill="none"></path>
                              <g id="Shopicon">
                                <path d="M13,4h-3C7.8,4,6,5.8,6,8v23.955c0,2.2,1.8,4,4,4h3V4z"></path>
                                <path d="M40.228,21.494L30,11.267V8c0-2.2-1.8-4-4-4h-7v31.955h7c2.2,0,4-1.8,4-4v-3.712l2.12,2.12l2.829-2.828l-4.663-4.663 l-6.301-6.301c-0.378-0.378-0.585-0.884-0.584-1.424c0.001-0.534,0.207-1.033,0.584-1.408c0.754-0.755,2.079-0.753,2.832,0 L31,17.923l6.416,6.416l-0.072-0.022l0.109,0.072C37.584,24.586,38,25.337,38,26.955v13H22c-1.915,0-3.605-1.633-3.933-3.799 L18.044,36h-4.045l0.114,0.754c0.621,4.105,4.012,7.201,7.888,7.201h20v-17C42,23.483,40.656,21.907,40.228,21.494z"></path>
                              </g>
                            </g>
                          </svg>
                          Payment History
                        </Link>
                        <Link
                          className="hover:bg-gray-100 flex gap-3 items-center rounded py-2.5 text-base text-dark hover:text-primary dark:text-white/70 dark:hover:text-white px-3"
                          href={'/user-dashboard/inbox'}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.29664 4.72727V5.25342C6.60683 6.35644 4.7276 9.97935 4.79579 13.1192L4.79577 14.8631C3.4188 16.6333 3.49982 19.2727 6.93518 19.2727H9.29664C9.29664 19.996 9.57852 20.6897 10.0803 21.2012C10.582 21.7127 11.2625 22 11.9721 22C12.6817 22 13.3622 21.7127 13.8639 21.2012C14.3656 20.6897 14.6475 19.996 14.6475 19.2727H17.0155C20.4443 19.2727 20.494 16.6278 19.1172 14.8576L19.1555 13.1216C19.2248 9.97811 17.3419 6.35194 14.6475 5.25049V4.72727C14.6475 4.00395 14.3656 3.31026 13.8639 2.7988C13.3622 2.28734 12.6817 2 11.9721 2C11.2625 2 10.582 2.28734 10.0803 2.7988C9.57852 3.31026 9.29664 4.00395 9.29664 4.72727ZM12.8639 4.72727C12.8639 4.72727 12.8633 4.76414 12.8622 4.78246C12.5718 4.74603 12.2759 4.72727 11.9757 4.72727C11.673 4.72727 11.3747 4.74634 11.082 4.78335C11.0808 4.76474 11.0803 4.74603 11.0803 4.72727C11.0803 4.48617 11.1742 4.25494 11.3415 4.08445C11.5087 3.91396 11.7356 3.81818 11.9721 3.81818C12.2086 3.81818 12.4354 3.91396 12.6027 4.08445C12.7699 4.25494 12.8639 4.48617 12.8639 4.72727ZM11.0803 19.2727C11.0803 19.5138 11.1742 19.7451 11.3415 19.9156C11.5087 20.086 11.7356 20.1818 11.9721 20.1818C12.2086 20.1818 12.4354 20.086 12.6027 19.9156C12.7699 19.7451 12.8639 19.5138 12.8639 19.2727H11.0803ZM17.0155 17.4545C17.7774 17.4545 18.1884 16.5435 17.6926 15.9538C17.4516 15.6673 17.3233 15.3028 17.3316 14.9286L17.3723 13.0808C17.4404 9.99416 15.0044 6.54545 11.9757 6.54545C8.94765 6.54545 6.51196 9.99301 6.57898 13.0789L6.61916 14.9289C6.62729 15.303 6.49893 15.6674 6.25806 15.9538C5.76221 16.5435 6.17325 17.4545 6.93518 17.4545H17.0155ZM16.9799 3.20202C17.2945 2.74813 17.9176 2.63524 18.3715 2.94988C19.5192 3.74546 20.8956 5.65348 21.6471 7.9126C21.8214 8.43664 21.5379 9.00279 21.0139 9.17712C20.4898 9.35145 19.9237 9.06795 19.7493 8.5439C19.0892 6.55949 17.9221 5.07189 17.2321 4.59358C16.7782 4.27894 16.6653 3.65592 16.9799 3.20202ZM5.4303 2.94988C5.8842 2.63524 6.50722 2.74813 6.82185 3.20202C7.13649 3.65592 7.0236 4.27894 6.56971 4.59358C5.87969 5.07189 4.71256 6.55949 4.05242 8.5439C3.87809 9.06795 3.31194 9.35145 2.78789 9.17712C2.26384 9.00279 1.98034 8.43664 2.15467 7.9126C2.90619 5.65348 4.2826 3.74546 5.4303 2.94988Z"
                                fill="#000000"
                              ></path>
                            </g>
                          </svg>
                          My Inbox
                        </Link>
                        <span
                          className="hover:bg-gray-100 flex gap-2 items-center cursor-pointer rounded py-2.5 text-base text-danger hover:text-primary dark:text-white/70 dark:hover:text-white px-3"
                          onClick={() => doLogout()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                            />
                          </svg>
                          <span>Logout</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/signin"
                      className={`py-3 text-base font-medium hover:opacity-70 md:block ${
                        sticky ? 'text-dark' : 'text-white'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-person-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      </svg>
                    </Link>
                  )}
                </div>
                {header?.callback && (
                  <div className="bg-primary py-2 pl-3 pr-4 hidden xl:flex items-center justify-center gap-3 rounded-xl">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        fill="#ffffff"
                        className="bi bi-telephone-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                        />
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
                <button onClick={navbarToggleHandler} className="xl:hidden">
                  <span
                    className={`my-1.5 block h-0.5 w-[30px] ${sticky ? 'bg-black' : 'bg-white'}`}
                  />
                  <span
                    className={`my-1.5 block h-0.5 w-[30px]  ${sticky ? 'bg-black' : 'bg-white'}`}
                  />
                  <span
                    className={`my-1.5 block h-0.5 w-[30px]  ${sticky ? 'bg-black' : 'bg-white'}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* mobile navbar */}
      <div
        className={`block xl:hidden fixed top-0 end-0 w-full max-w-[320px] h-screen bg-black/50 backdrop-blur z-50 px-4 py-10 text-white transition-all duration-500 transform ${navbarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center px-5 rounded-lg bg-white/50 mb-8">
          <Link href="/" className={`header-logo block w-full max-w-[150px] py-6 lg:py-3`}>
            {header?.logo && (
              <Media
                resource={header?.logo}
                className="w-44 sm:w-52 md:w-56 lg:max-w-60 h-auto dark:brightness-200"
                priority={false}
                loading={'lazy'}
              />
            )}
          </Link>
          <button onClick={navbarToggleHandler}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-x-circle-fill size-6"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
            </svg>
          </button>
        </div>
        <nav>
          <ul className="flex flex-col gap-2">
            {navItems.map((menuItem, index) => (
              <li key={index} className="group relative">
                {menuItem.subNavItems && menuItem.subNavItems.length === 0 ? (
                  <>
                    <CMSLink
                      {...menuItem?.link}
                      appearance="link"
                      className={`font-medium block px-3 py-2 text-base no-underline ${
                        pathname === menuItem?.link?.url ? 'text-primary' : 'text-white/90'
                      }`}
                    />
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => handleSubmenu(index)}
                      className="font-medium flex cursor-pointer items-center justify-between py-2 px-3 text-base text-white group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:px-0 lg:py-6"
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
                      className={`submenu relative start-5 top-full rounded-sm bg-transparent transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark ${
                        openIndex === index ? 'block' : 'hidden'
                      }`}
                    >
                      {menuItem.subNavItems &&
                        menuItem.subNavItems.map((submenuItem, subIndex) => (
                          <CMSLink
                            key={subIndex}
                            {...submenuItem?.link}
                            appearance="link"
                            className="block rounded py-2 px-3 text-base text-white hover:text-primary dark:text-white/70 dark:hover:text-white"
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
      {navbarOpen && (
        <div
          className="fixed top-0 start-0 bg-black/50 h-screen w-full z-40"
          onClick={() => setNavbarOpen(false)}
        ></div>
      )}
    </>
  )
}

export default HeaderTheme01
