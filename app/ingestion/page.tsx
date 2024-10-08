'use client'
import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/lib/store/store'
import { SiMicrosoftexcel, SiMicrosoftword } from 'react-icons/si'
import { FaRegFilePdf } from 'react-icons/fa'
import { BsFiletypeRaw } from 'react-icons/bs'
import { Category } from '@/lib/types'




export default function Page() {
  const [fileExtension, setFileExtension] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState<Category | ''>('')
  const router = useRouter()
  const { currentProjectId, addFile } = useProjectStore()

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      const extension = file.name.split('.').pop()
      setFileExtension(extension)
      setFile(file)
    }
  }

  const handleSubmission = async () => {
    if (currentProjectId && category && file) {
      // Ensure category is not empty and is a valid key of ProjectFiles
      addFile(currentProjectId, category, file.name) // Note: passing file.name instead of file object
      toast.success('Data uploaded successfully')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      toast.error('Please select a file and category')
    }
  }

  const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case 'xls':
      case 'xlsx':
        return <SiMicrosoftexcel className="text-green-700" />
      case 'doc':
      case 'docx':
      case 'txt':
        return <SiMicrosoftword className="text-blue-500" />
      case 'pdf':
        return <FaRegFilePdf className="text-red-700" />
      default:
        return <BsFiletypeRaw className="text-gray-500" />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center my-12 p-12">
      <h1 className="text-3xl font-bold text-white mb-8">Data Ingestion</h1>
      <div className="flex flex-col gap-8 items-center w-1/2 p-4 rounded-lg shadow-lg border-2 border-gray-700 shadow-white/10">
        <div className="w-full">
          <label htmlFor="file" className="font-semibold text-base mt-4 block">
            File Upload
          </label>
          <Input
            type="file"
            id="file"
            onChange={handleFileUpload}
            className="file:mr-4 file:py-2 h-fit file:px-4 file:rounded-full file:border file:border-gray-300 file:text-sm 
                       file:font-medium file:bg-transparent file:text-white file:shadow-sm hover:file:bg-gray-100/10"
          />
          {fileExtension && (
            <Badge
              className="flex gap-2 h-6 w-fit mt-4 text-sm items-center"
              variant={'secondary'}
            >
              {getFileIcon(fileExtension)}
              {fileExtension.toUpperCase()}
            </Badge>
          )}
          <p className="mt-6 font-semibold text-base block">Category</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mt-2 w-1/6" variant="secondary">
                {category || 'Select Category'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={category}
                onValueChange={value => setCategory(value as Category)}
              >
                <DropdownMenuRadioItem value="meetingTranscripts">
                  Meeting Transcription
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="emails">
                  Email
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="jotforms">
                  Jotform
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="other">
                  Other
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          className="mt-4 px-4 py-2 w-1/6"
          variant={'default'}
          onClick={handleSubmission}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
