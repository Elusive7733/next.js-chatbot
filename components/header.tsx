import * as React from 'react'
import Link from 'next/link'

import { auth } from '@/auth'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'
import Image from 'next/image'

async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/new" rel="nofollow" className='flex justify-center items-center'>
          <Image
            className="mr-2 dark:hidden"
            src={'/BleedAI_logo.svg'}
            alt="BleedAI"
            width={24}
            height={24}
          />
          <Image
            className="mr-2"
            src={'/BleedAI_logo.svg'}
            alt="BleedAI"
            width={28}
            height={28}
          />
        <p className='text-sm mt-2 font-semibold'>Bleed AI</p>
        </Link>
      )}
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
    </header>
  )
}
