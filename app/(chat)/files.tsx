'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button' // Ensure your path to Button component is correct
import { cn } from '@/lib/utils'
import { files } from '@/data/dummyData'
import { TrashIcon } from '@radix-ui/react-icons'

const Files = () => {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className="fixed top-20 right-5 h-full z-50">
      <div
        className={cn(
          `flex flex-col gap-2 pt-4 rounded-xl items-center justify-center transition-all duration-200 ease-in-out`,
          {
            'w-30': collapsed,
            'w-96': !collapsed,
            'border-none': collapsed,
            'border border-gray-700/50 backdrop-blur-lg shadow-xl': !collapsed
          }
        )}
      >
        <Button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'p-2 text-black bg-gray-300 rounded-full focus:outline-none w-14'
          )}
        >
          {collapsed ? '◀' : '▶'}
        </Button>

        <div className="flex items-center justify-start h-full pl-2">
          <span className="text-white">Docs in memory</span>
        </div>
        {!collapsed && (
          <>
            <ul className="p-4 w-full text-center flex-wrap break-words text-wrap overflow-x-auto">
              {Object.values(files).map((file, index) => (
                <li
                  key={index}
                  className={cn(
                    `py-2 m-1 px-4 w-full hover:bg-white/10 rounded cursor-pointer break-words text-wrap overflow-x-auto flex-col gap-2`
                  )}
                  onClick={() => console.log(file)}
                >
                  {file.emails[0]}
                  {file.jotforms[0]}
                  {file.meetingTranscripts[0]}
                  {file.other[0]}

                  <Button className="" variant={'destructive'}>
                    <TrashIcon className="size-6 text-white" />
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default Files
