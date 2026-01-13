'use client'

import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isLogin = pathname === '/login'

  return (
    <main
      className={clsx(
        'min-h-screen',
        isLogin && 'login-page'
      )}
    >
      {children}
    </main>
  )
}
