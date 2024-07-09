import React from 'react'


import ListFiles from './list-files'
import { useProjectStore } from '@/lib/store/store'

const ProjectFiles = ({ }) => {
  
  const { projects, currentProjectId } = useProjectStore();

  let projectFiles
  if(currentProjectId) {
    projectFiles = projects[currentProjectId].files
  } else {
    return <div className='m-2 font-semibold'>Select a project!</div>
  }
  
  return (
    <div className="w-full px-4 mx-3">
      <div className="m-2 border border-gray-600/40 p-2 rounded-lg">
        <h3 className="font-medium">Meeting Transcripts</h3>
        <hr />
        <ul className="mt-2">
          <ListFiles files={projectFiles.meetingTranscripts} category={'meetingTranscripts'}  />
        </ul>
      </div>

      <div className="m-1 border border-gray-600/40 p-4 rounded-lg">
        <h3 className="font-medium">Emails</h3>
        <hr />
        <ul className="mt-2">
          <ListFiles files={projectFiles.emails} category={'emails'}  />
        </ul>
      </div>

      <div className="m-1 border border-gray-600/40 p-4 rounded-lg">
        <h3 className="font-medium">Jotforms</h3>
        <hr />
        <ul className="mt-2">
          <ListFiles files={projectFiles.jotforms} category={'jotforms'} />
        </ul>
      </div>

      <div className="m-1 border border-gray-600/40 p-4 rounded-lg">
        <h3 className="font-medium">Others</h3>
        <hr />
        <ul className="mt-2">
          <ListFiles files={projectFiles.other} category={'other'} />
        </ul>
      </div>
    </div>
  )
}

export default ProjectFiles
