// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // editor-import
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import Categories from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import Users from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Invoices } from './collections/Invoices'
import Inboxes from './collections/Inboxes'
import Projects from './collections/Projects'
import { pageHandler } from './endpoints/pageHandler'
import { paymentHandler } from './endpoints/paymentHandler'
import Services from './collections/Services'
import Features from './collections/Features'
import ProjectDocumentations from './collections/ProjectDocumentations'
import EmailTemplate from './collections/emailTemplate'
import ProjectQueries from './collections/PorjectQuery'
import HajjQuery from './collections/HajjQueries'
import UpworkProjects from './collections/UpworkProjects'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
      graphics: {
        Icon: '@/components/Logo/Icon',
        Logo: '@/components/Logo/Logo',
      },
    },
    meta: {
      icons: [
        {
          url: '/assets/favicon.svg',
        },
      ],
      openGraph: {
        images: {
          url: '/assets/ogImage.png',
        },
      },
      titleSuffix: '- Way-Wise',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  email: nodemailerAdapter({
    defaultFromAddress: 'info@waywisetech.com',
    defaultFromName: 'Way-Wise',
    // Nodemailer transportOptions
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      // auth: {
      //   user: process.env.SMTP_USER,
      //   pass: process.env.SMTP_PASS,
      // },
    },
    skipVerify: process.env.SMTP_EMAIL_SERVICE === 'false' ? true : false,
  }),
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [
    Pages,
    Posts,
    Invoices,
    Media,
    Categories,
    Users,
    Services,
    Features,
    Inboxes,
    Projects,
    ProjectQueries,
    HajjQuery,
    ProjectDocumentations,
    EmailTemplate,
    UpworkProjects,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  endpoints: [
    // The seed endpoint is used to populate the database with some example data
    // You should delete this endpoint before deploying your site to production
    {
      handler: pageHandler,
      method: 'get',
      path: '/page-preview',
    },
    {
      handler: paymentHandler,
      method: 'post',
      path: '/checkout_sessions',
    },
  ],
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
