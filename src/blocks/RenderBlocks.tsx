import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MediaContentSection } from '@/blocks/MediaContentSection/Component'
import { ServiceSection } from '@/blocks/ServiceSection/Component'
import { MediaSection } from '@/blocks/MediaSection/Component'
import { FeatureSection } from '@/blocks/FeatureSection/Component'
import { MapEmbed } from '@/blocks/MapEmbed/Component'
import { FaqBlock } from '@/blocks/FaqBlock/Component'
import { BreadcrumbBlock } from '@/blocks/BreadcrumbBlock/Component'
import { PricingBlock } from '@/blocks/PricingBlock/Component'
import { TeamBlock } from '@/blocks/TeamBlock/Component'
import { TestimonialBlock } from '@/blocks/TestimonialBlock/Component'
import { HeadingBlock } from '@/blocks/HeadingBlock/Component'
import { SpacerBlock } from '@/blocks/SpacerBlock/Component'
import { PdfBook } from './PdfBook/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  mediaContentSection: MediaContentSection,
  serviceSection: ServiceSection,
  mediaSection: MediaSection,
  featureSection: FeatureSection,
  mapEmbed: MapEmbed,
  faq: FaqBlock,
  breadcrumb: BreadcrumbBlock,
  pricing: PricingBlock,
  team: TeamBlock,
  testimonial: TestimonialBlock,
  headingBlock: HeadingBlock,
  spacer: SpacerBlock,
  pdfBook: PdfBook

}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-0" key={index}>
                  <Block {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
