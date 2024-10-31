'use client'
import { CopyToClipboard, TextField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'
import * as React from 'react'

const LinkToPaymentIntent: React.FC<TextFieldClientProps> = ({field}) => {
  const { label } = field

  const { value: stripePaymentIntentID } = useFormFields(([fields]) => fields.stripePaymentIntentID) || {}

  const href = `https://dashboard.stripe.com/${
    process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
  }payments/${stripePaymentIntentID}`

  return (
    <div>
      <p style={{ marginBottom: '0' }}>
        {typeof label === 'string' ? label : 'Stripe Payment Intent ID'}
      </p>
      <TextField field={field } />
      {Boolean(stripePaymentIntentID) && (
        <div>
          <div>
            <span
              className="label"
              style={{
                color: '#9A9A9A',
              }}
            >
              Manage in Stripe
            </span>
            <CopyToClipboard value={href} />
          </div>
          <div
            style={{
              fontWeight: '600',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <a
              href={`https://dashboard.stripe.com/${
                process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
              }customers/${stripePaymentIntentID}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              {href}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkToPaymentIntent
