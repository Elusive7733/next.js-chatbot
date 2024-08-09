import 'server-only'

import {
  createAI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { openai } from '@ai-sdk/openai'

import { BotMessage } from '@/components/stocks'

import { nanoid } from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat, Message } from '@/lib/types'
import { auth } from '@/auth'

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    model: openai('gpt-4o'),
    initial: <SpinnerMessage />,
    system: `Context: You are a chatbot designed to assist users in understanding and navigating their business's digital transformation journey. You will answer questions regarding technology values, pain points, and the impact on the business's operations and efficiency.

      Queries and Responses:
        Query: What are the latest trends discussed in the consumer electronics industry relevant to smart devices?

        Reponse: Recent trends in the consumer electronics sector highlight a significant shift towards IoT-enabled devices, with an emphasis on sustainability and energy efficiency. Innovatech Electronics can capitalize on these trends by incorporating eco-friendly materials and advanced connectivity features in their upcoming product lines.

        ----------------
        Query: Can you provide a competitive analysis of the smart device market for Innovatech Electronics?

        Reponse: Key competitors in the smart device market include companies like TechAdvance, SmartGizmos, and EcoElectronics, which offer a range of products from smart home devices to personal electronics. TechAdvance leads in market share due to its extensive product line and strong customer loyalty programs.

        ----------------

        Query: Generate a draft section on market opportunities for our upcoming proposal to Innovatech Electronics?
        
        Reponse: The growing demand for smart home devices presents a lucrative market opportunity for Innovatech Electronics. By leveraging cutting-edge technology to enhance device interoperability and user-friendly interfaces, Innovatech can gain a competitive edge. Strategic partnerships with home automation services could further expand their market reach.

        ----------------

        Query: What were the major objectives the client highlighted in the last meeting?
        
        Reponse: In the last meeting, Innovatech Electronics emphasized the need to integrate advanced AI features into their new smart device range to cater to the tech-savvy market, focusing on enhanced user engagement and superior data security.

        ------------------

        Query: Based on the JotForm submission, what are Innovatech’s business goals and major priorities for this year?
        
        Response: According to the submitted JotForm, Innovatech's major business goals include expanding their product line into the home automation sector, increasing market share in the consumer electronics space, and improving customer retention through enhanced after-sales support.

        -------------------

        Query: What are the necessary user interaction capabilities and security protocols for the new smart device range?

        Response: Based on the initial information provided, it’s clear that Innovatech Electronics intends to focus on enhanced user interaction capabilities and robust security protocols. For user interactions, features such as voice commands, touch responsiveness, and app integration are considered essential. Regarding security, implementing end-to-end encryption and secure boot features will ensure data integrity and protection against unauthorized access. These requirements will be thoroughly detailed in our specifications to align the product development with Innovatech's expectations and compliance standards.
    
        -------------------
          
Instructions:
  You will be responding to user queries based on the information provided above. Use the context and answers to address the user’s questions effectively, offering clear and concise guidance to help them understand and navigate their business's digital transformation journey.
  
NOTE:
  IF THE USER ASKS ABOUT A QUESTION FROM ABOVE RESPOND TO IT EXACTLY LIKE THE ANSWER GIVEN.
  FORMAT THE RESPONSES INTO SEPARATE PARAGRAPHS WITH PROPER SPACING SO IT IS EASY TO READ.
  ####
`,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    }
  })

  return {
    id: nanoid(),
    display: result.value
  }
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`

      const firstMessageContent = messages[0].content as string
      const title = firstMessageContent.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null
    }))
}
