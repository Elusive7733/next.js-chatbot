'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { SiMicrosoftexcel, SiMicrosoftword } from 'react-icons/si'
import { FaRegFilePdf } from 'react-icons/fa'
import { BsFiletypeRaw } from 'react-icons/bs'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [fileExtension, setFileExtension] = useState('')
  const router = useRouter()

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      const extension = file.name.split('.').pop()
      setFileExtension(extension)
    }
  }

  const handleSubmission = async () => {
    toast.success('Data uploaded successfully')
    setTimeout(() => {
      router.push('/')
    }, 1000)
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
      <div className="flex flex-col gap-8 items-center w-3/4 p-4 rounded-lg shadow-lg border-2 border-gray-700 shadow-white/10">
        <div className="w-full">
          <label htmlFor="prompt" className="font-semibold text-lg block">
            Prompt
          </label>
          <Textarea
            id="prompt"
            placeholder="Enter your prompt here..."
            className="w-full"
          />
        </div>

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
            className="flex gap-2 h-6 w-fit m-4 text-sm items-center"
            variant={'secondary'}
          >
            {getFileIcon(fileExtension)}
            {fileExtension.toUpperCase()}
          </Badge>
        )}
        </div>

        <Button
          className="mt-4 px-4 py-2 text-white rounded hover:bg-gray-200 bg-gray-700"
          onClick={handleSubmission}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
