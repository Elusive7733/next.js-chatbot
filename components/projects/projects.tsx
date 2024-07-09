'use client'
import React, { useState } from 'react';
import { useProjectStore } from '@/lib/store/store'; // Ensure this path is correct
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IoAddCircle } from 'react-icons/io5';
import { FaRegTrashAlt } from 'react-icons/fa';

const Projects = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const { projects, currentProjectId, addProject, deleteProject, setCurrentProjectId } = useProjectStore();

  // Updated to use projectName directly, not passing projectId or generating it here
  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName, {
        meetingTranscripts: [],
        emails: [],
        jotforms: [],
        other: []
      });
      setNewProjectName(''); // Clear the input after adding the project
    }
  };

  const handleDeleteProject = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, projectId: string) => {
    event.stopPropagation(); // Stop event propagation to prevent triggering the parent onClick
    deleteProject(projectId);
    if (projectId === currentProjectId) {
      const nextProjectId = Object.keys(projects).find(id => id !== projectId) || null;
      setCurrentProjectId(nextProjectId); // Set the next project or null
    }
  };

  const changeProject = (projectId: string) => {
    setCurrentProjectId(projectId); // Update the current project globally
    setCollapsed(true); // Collapse the project list
  };

  return (
    <div className="fixed top-20 left-5 h-full z-50">
      <div
        className={cn(
          `flex flex-col gap-2 pt-4 rounded-xl items-center justify-center transition-all duration-200 ease-in-out`,
          {
            'w-24': collapsed,
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
          <div className="flex items-center justify-start h-full pl-2 truncate">
            <span className="text-white">
              {currentProjectId && projects[currentProjectId]?.projectName || 'No Projects'}
            </span>
          </div>
        ) : (
          <ul className="p-4 w-full text-center">
            {Object.keys(projects).map((projectId) => (
              <li
                key={projectId}
                className={cn(
                  `flex justify-between items-center py-2 m-1 px-4 w-full hover:bg-white/10 rounded cursor-pointer`,
                  currentProjectId === projectId && 'bg-white/10'
                )}
                onClick={() => changeProject(projectId)}
              >
                <span className='truncate'>{projects[projectId].projectName}</span>
                <Button
                  onClick={(e) => handleDeleteProject(e, projectId)}
                  className="text-white hover:text-gray-300"
                  variant={'destructive'}
                >
                  <FaRegTrashAlt />
                </Button>
              </li>
            ))}
            <li>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="New Project Name"
                className="mt-4 p-2 w-full rounded-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
              />
              <Button
                onClick={handleAddProject}
                className="mt-2 p-2 w-full gap-2"
                variant={'secondary'}
              >
                <IoAddCircle className="size-6" />
                Add Project
              </Button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Projects;
