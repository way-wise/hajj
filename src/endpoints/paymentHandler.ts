import { type PayloadHandler } from 'payload'
import Stripe from 'stripe';

const stripe_key = process.env.STRIPE_SECRET_KEY || ''
const stripe = new Stripe(stripe_key, {
  apiVersion: '2024-11-20.acacia',
});

export const paymentHandler: PayloadHandler = async (req): Promise<Response> => {
  const { payload } = req

  if (req.method === 'POST') {
    try {

      const { slug } = req.query

      const result = await payload.find({
        collection: 'invoices',
        limit: 1,
        overrideAccess: true,
        where: {
          slug: {
            equals: slug,
          },
        },
      })
      const invoice = result.docs?.[0] || null
      if(invoice){
        const customer_email = invoice?.billingAddress?.billingTo?.email || ''
        let items: any = []
        if(invoice?.invoiceItems?.items){
          invoice?.invoiceItems?.items.map(item => {
            const itemData = {
              currency: 'usd',
              product_data: {
                name: item.name,
              },
              unit_amount: (item.total as number) * 100,
            }
            items.push({ price_data: itemData, quantity: 1 })
        })
        }
        const session = await stripe.checkout.sessions.create({
          customer_email: customer_email,
          line_items: items,
          mode: 'payment',
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/invoices/${slug}?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/invoices/${slug}?canceled=true`,
        });
        return Response.redirect(session.url || '/', 303);
      }
      return Response.json({ error: 'invoice not found' }, { status: 404 })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(message)
      return Response.json({ error: message }, { status: 500 })
    }
  }else{
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 })
  }
}
