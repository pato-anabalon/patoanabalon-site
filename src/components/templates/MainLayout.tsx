'use client'

import React from 'react'
import { useLenis } from '@/hooks/useLenis'
import { Preloader } from '@/components/atoms'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  useLenis()

  return (
    <div data-testid="template-main-layout" className="relative">
      <Preloader />
      {children}
    </div>
  )
}
