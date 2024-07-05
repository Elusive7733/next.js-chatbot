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
import { Textarea } from './ui/textarea'

const Feedback = () => {
  const [open, setOpen] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState('')
  const [dislikeAnimation, setDislikeAnimation] = useState('')

  const handleLike = () => {
    setLikeAnimation('animate-bounce-up')
    setTimeout(() => setLikeAnimation(''), 1000) // Reset animation after 1s
    toast.success('Thank you for your feedback!')
  }

  const handleDislike = () => {
    setDislikeAnimation('animate-bounce-down')
    setTimeout(() => setDislikeAnimation(''), 1000) // Reset animation after 1s
    setOpen(true);
  }

  return (
    <div className="flex items-center space-x-4 mt-3">
      <Button
        variant="secondary"
        className={`gap-2 h-8`}
        onClick={handleLike}
      >
        <HeartFilledIcon className={`text-red-500 ${likeAnimation}`} />
        Like
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className={`gap-2 h-8`}
            onClick={handleDislike}
          >
            <DoubleArrowDownIcon className={`text-white ${dislikeAnimation}`} />
            Dislike
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>What the actual response should be?</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide feedback on how we can improve our service.
            </AlertDialogDescription>
            <Textarea />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.success('Thank you for your feedback!')
                setOpen(false);
              }}
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
