import React from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { useProjectStore } from '@/lib/store/store'
import { Category } from '@/lib/types'

interface ListFilesProps {
  files: string[]
  category?: Category
}

const ListFiles = ({ files, category }: ListFilesProps) => {
  const { deleteFile, currentProjectId } = useProjectStore()
  if (!files || files.length === 0) return <div className='text-xs font-light'>No files</div>

  const handleDeleteClick = (fileName: string) => {
    if (!fileName) return
    if (currentProjectId && category) {
      deleteFile(currentProjectId, category, fileName)
    }
  }

  return (
    <>
      {files.map((file, index) => (
        <li
          key={index}
          className="flex justify-between items-center p-1 text-sm font-normal"
        >
          <span className='truncate'>{file}</span>

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
