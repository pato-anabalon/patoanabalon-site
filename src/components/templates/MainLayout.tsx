'use client'

import React from 'react'
import { useLenis } from '@/hooks/useLenis'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  useLenis()

  return (
    <div data-testid="template-main-layout" className="relative">
      {children}
    </div>
  )
}
