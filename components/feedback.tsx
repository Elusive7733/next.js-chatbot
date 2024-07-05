'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { HeartFilledIcon, DoubleArrowDownIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

const Feedback = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center space-x-4 mt-3">
      <Button
        variant="secondary"
        className="gap-2 h-8"
        onClick={() => toast.success('Thank you for your feedback!')}
      >
        <HeartFilledIcon className="text-red-500" />
        Like
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="gap-2 h-8">
            <DoubleArrowDownIcon className="text-white" />
            Dislike
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              What the actual response should be?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please provide feedback on how we can improve our service.
            </AlertDialogDescription>
            <Textarea/>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toast.success('Thank you for your feedback!')}
            >
              Send Feedback
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Feedback
