'use client'

import React, { useState } from 'react'
import type { Page } from '@/payload-types'
import RichText from '@/components/RichText';

type Props = Extract<Page['layout'][0], { blockType: 'faq' }>

export const FaqTheme03: React.FC<
    Props & {
        id?: string
    }
> = ({ title, faqItems }) => {
    const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenAccordionIndex(openAccordionIndex === index ? null : index);
    };

    return (
        <section className="dark:bg-slate-900">
            <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                {/* Title */}
                <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
                    <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">{title}</h2>
                </div>
                {/* End Title */}

                <div className="max-w-2xl mx-auto">
                    {faqItems?.map((faq, index) => (
                        <div key={index}>
                            {/* <div>{faq}</div> */}
                            <div
                                className="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6 dark:hs-accordion-active:bg-white/10 active">
                                <button
                                    className="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    {faq.question}
                                    <svg
                                        className={`${openAccordionIndex === index ? 'hidden' : 'block'} shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                    <svg
                                        className={`${openAccordionIndex === index ? 'block' : 'hidden'} shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m18 15-6-6-6 6" />
                                    </svg>
                                </button>
                                <div
                                    className={`transition-all duration-300 ${openAccordionIndex === index
                                        ? 'h-auto'
                                        : 'h-0 overflow-hidden'
                                        } `}
                                >
                                    <p className="text-gray-800 dark:text-neutral-200">
                                        {faq.answer && <RichText data={faq.answer} enableGutter={false} />}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
