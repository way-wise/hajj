import { ToastContainer } from '@/providers/ToastContainer'
import type { ReactNode } from 'react'
import DashboardLayout from './dashboard-layout'
import 'chonky/style.css'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout>
      {children} <ToastContainer />
    </DashboardLayout>
  )
}
