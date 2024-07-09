import React from 'react'

import { files } from '@/data/dummyData'

interface ProjectFilesProps {
  currentProject: string
}

const ProjectFiles = ({ currentProject }: ProjectFilesProps) => {
  let projectFiles = files[currentProject]

  return (
    <div>
      <div>
        Meeting Transcripts
        <ul>
          {projectFiles.meetingTranscripts.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </div>

      <div>
        Emails
        <ul>
          {projectFiles.emails.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </div>

      <div>
        Jotforms
        <ul>
          {projectFiles.jotforms.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </div>

      <div>
        Other
        <ul>
          {projectFiles.other.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProjectFiles
