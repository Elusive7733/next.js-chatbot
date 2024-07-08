'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button' // Ensure your path to Button component is correct
import { cn } from '@/lib/utils'
import { files } from '@/data/dummyData'

const Projects = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [currentProject, setCurrentProject] = useState('Project 1') // Start with the first project
  const changeProject = (project: string) => {
    setCurrentProject(project)
    setCollapsed(true)
  }

  return (
    <div className="fixed top-20 left-5 h-full z-50">
      <div
        className={cn(
          `flex flex-col gap-2 pt-4 rounded-xl items-center justify-center transition-all duration-200 ease-in-out`,
          {
            'w-20': collapsed,
            'w-60': !collapsed,
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
          {collapsed ? '▶' : '◀'}
        </Button>

        {collapsed ? (
          <div className="flex items-center justify-start h-full pl-2">
            <span className="text-white">{currentProject}</span>
          </div>
        ) : (
          <ul className="p-4 w-full text-center">
            {Object.keys(files).map((project, index) => (
              <li
                key={index}
                className={cn(
                  `py-2 m-1 px-4 w-full hover:bg-white/10 rounded cursor-pointer`,
                  currentProject === project && 'bg-white/10'
                )}
                onClick={() => changeProject(project)}
              >
                {project}
              </li>
            ))}

            <li>
              <Button
                onClick={() => alert('Add project functionality')}
                className="mt-4 p-2 w-full"
                variant={'secondary'}
              >
                Add Project
              </Button>
            </li>
          </ul>
        )}
      </div>
    </div>
  )
}

export default Projects
