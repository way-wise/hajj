'use client'

import React from 'react'

import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'

type Props = Extract<Page['layout'][0], { blockType: 'pricing' }>

export const PricingTheme01: React.FC<
  Props & {
    id?: string
  }
> = ({ introContent, priceCards }) => {
  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          {introContent && (
            <RichText className="pricing-theme1" content={introContent} enableGutter={false} />
          )}
        </div>
        <div className="flex flex-wrap -m-4">
          {priceCards?.map((priceCard, index) => {
            const { title, description, highlightText, price, priceType, features } = priceCard
            return (
              <div className="p-4 xl:w-1/4 md:w-1/2 w-full" key={index}>
                <div className="h-full p-6 rounded-lg border-2 border-gray-300 dark:border-gray-700 flex flex-col relative overflow-hidden">
                  {highlightText && (
                    <span className="bg-indigo-500 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">
                      {highlightText}
                    </span>
                  )}

                  <h2 className="text-sm tracking-widest title-font mb-1 font-medium">{title}</h2>
                  <h1 className="text-5xl text-gray-900 dark:text-gray-300 pb-4 mb-4 border-b border-gray-200 leading-none">
                    {price} / <span className="text-xl">{priceType ? 'Year' : 'Month'}</span>
                  </h1>
                  {features &&
                    features.map((feature, index) => {
                      return (
                        <p
                          className="flex items-center text-gray-600 dark:text-gray-300 mb-2"
                          key={index}
                        >
                          <span className="w-4 h-4 mr-2 p-0.5 inline-flex items-center justify-center bg-gray-400 dark:bg-gray-700 text-white rounded-full flex-shrink-0">
                            <svg
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              className="w-3 h-3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20 6L9 17l-5-5"></path>
                            </svg>
                          </span>
                          <span>{feature.feature}</span>
                        </p>
                      )
                    })}

                  <button className="flex items-center mt-auto text-white bg-gray-400 border-0 py-2 px-4 w-full focus:outline-none hover:bg-gray-500 rounded">
                    Get Started
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 ml-auto"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </button>
                  <p className="text-xs text-gray-500 mt-3">{description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
