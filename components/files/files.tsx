'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ProjectFiles from '@/components/files/project-files'
import { useProjectStore } from '@/lib/store/store'


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
          <ProjectFiles/>
        )}
      </div>
    </div>
  )
}

export default Files
