import React from 'react'

import { files } from '@/data/dummyData'
import ListFiles from './list-files'

interface ProjectFilesProps {
  currentProject: string
}

const ProjectFiles = ({ currentProject }: ProjectFilesProps) => {
  let projectFiles = files[currentProject]

  return (
    <div className="w-full px-4 mx-3">
      <div className="m-2 border border-gray-600/40 p-2 rounded-lg">
        <h3 className="font-medium">Meeting Transcripts</h3>
        <hr />
        <ul className="mt-2">
          <ListFiles files={projectFiles.meetingTranscripts}  />
        </ul>
      </div>

      <div className="m-1 border border-gray-600/40 p-4 rounded-lg">
        <h3 className="font-medium">Emails</h3>
        <hr />
        <ul className="mt-2">
          <ListFiles files={projectFiles.emails} />
        </ul>
      </div>

      <div className="m-1 border border-gray-600/40 p-4 rounded-lg">
        <h3 className="font-medium">Jotforms</h3>
        <hr />
        <ul className="mt-2">
          <ListFiles files={projectFiles.jotforms} />
        </ul>
      </div>

      <div className="m-1 border border-gray-600/40 p-4 rounded-lg">
        <h3 className="font-medium">Others</h3>
        <hr />
        <ul className="mt-2">
          <ListFiles files={projectFiles.other} />
        </ul>
      </div>
    </div>
  )
}

export default ProjectFiles
