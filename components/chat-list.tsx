import { Separator } from '@/components/ui/separator'
import { UIState } from '@/lib/chat/actions'
import { Session } from '@/lib/types'
import Feedback from './feedback'

export interface ChatList {
  messages: UIState
  session?: Session
  isShared: boolean
}

export function ChatList({ messages, session, isShared }: ChatList) {
  if (!messages.length) {
    return null
  }

  const lastMessageIsFromBot = (messages.length - 1) % 2 !== 0;

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={message.id}>
          {message.display}
          {index === messages.length - 1 && lastMessageIsFromBot ? (
            <Feedback />
          ) : (
            <Separator className="my-4" />
          )}
        </div>
      ))}
    </div>
  )
}
