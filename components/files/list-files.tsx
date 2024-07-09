import React from 'react'
import { Button } from '../ui/button'
import { FaRegTrashAlt } from 'react-icons/fa'

interface ListFilesProps {
  files: string[]
}

const ListFiles = ({ files }: ListFilesProps) => {
  if (!files || files.length === 0) return <div>No files</div>

  const handleDeleteClick = (fileName: string) => {
    console.log(fileName)
  }

  return (
    <>
      {files.map((file, index) => (
        <li
          key={index}
          className="flex justify-between items-center p-1 text-sm font-normal"
        >
          <span>{file}</span>

          <FaRegTrashAlt
            className="size-4 text-red-600 hover:text-red-900 cursor-pointer"
            onClick={() => handleDeleteClick(file)}
          />
        </li>
      ))}
    </>
  )
}

export default ListFiles
