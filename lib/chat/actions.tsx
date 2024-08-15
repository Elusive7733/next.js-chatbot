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

      Question: Can you provide a detailed analysis of our top competitors’ strengths and weaknesses, and how does our smart storage box compare to these existing solutions?
      
      Answer:
        Direct Competitors:
      
          Collectibles Vaults (e.g., PWCC Vault, Goldin Vault):
            Strengths: Established market reputation, offering comprehensive services including secure physical storage, card grading, and marketplace integration.
            Weaknesses: Users lack personal ownership experience due to no physical control over their cards and there's an absence of advanced technology like real-time security monitoring or digital cataloging.
        
          Card Sorting Apps (e.g., CollX, Cardbase):
            Strengths: Strong digital capabilities with OCR for card identification and cataloging, user-friendly for personal collection management.
            Weaknesses: No physical storage solutions and limited security features for the high-value collectible market.

        Indirect Competitors:
        
          RFID-Based Inventory Systems (e.g., TrackR, Tile):
            Strengths: Widely adopted, proven technology for general item tracking.
            Weaknesses: Not tailored for collectibles like trading cards, missing features such as detailed cataloging or condition monitoring.

          Smart Home Security Systems (e.g., Ring, Nest):
            Strengths: High brand recognition, robust security features, and broad market penetration.
            Weaknesses: General features not customized for the specific needs of trading card collectors, such as precise item tracking.

          Our Smart Storage Box:
            Unique Selling Points: Integrates RFID/NFC for secure and personalized tracking, utilizes OCR for digital cataloging, incorporates real-time security sensors and tamper alerts, providing a more secure solution compared to both direct and indirect competitors. Offers a holistic solution by combining secure storage with advanced digital management capabilities, effectively addressing market gaps.

        -------------------

        Question: What are the trends in the trading card market that could influence the development of our smart storage solution?
        
        Answer: The trading card market is increasingly embracing digital integration and security enhancements. Trends include the use of advanced inventory systems for better organization, as well as RFID and NFC technologies for improved security and traceability. There's also a growing interest in sustainable materials for storage solutions, mirroring broader environmental concerns.

        -------------------
        
        Question: Draft an analysis section focusing on the integration of security features in our smart storage solution?
        Answer: Integrating state-of-the-art security features such as biometric access, real-time tamper alerts, and RFID tracking differentiates our smart storage box from conventional options. These features not only enhance the security of valuable trading cards but also provide users with peace of mind, knowing their investments are safeguarded against theft and unauthorized access

        -------------------

        Question: What are the key selling points that should be highlighted in the proposal for the smart storage box?
        Answer: The proposal should distinctly highlight the integration of cutting-edge technologies such as RFID/NFC, OCR, and security sensors that uniquely position our smart storage box in the market. These technologies enable precise tracking and management of trading card collections, ensuring high security and ease of access. RFID/NFC technology provides real-time location tracking of individual cards, while OCR technology allows for quick cataloging and retrieval of information from cards. The integration of sensors offers added security, alerting users to any unauthorized access or environmental hazards. Additionally, the product is supported by a user-friendly mobile application, which facilitates real-time monitoring, management, and remote access, making it a comprehensive solution that addresses both digital and physical storage needs comprehensively.

        -------------------
        
        Question: What are the market expansion and product development goals for companies looking for smart storage solutions?
        Answer: Companies targeting the smart storage market are focusing on expanding their reach by developing products that cater to the needs of high-end collectors and investors. These clients demand exceptional security features coupled with sophisticated organizational tools. The goals are to innovate products that lead the market in terms of technology and user experience, thereby attracting a broader customer base looking for premium solutions. Emphasizing the development of intuitive digital interfaces and robust security measures is crucial, as these features will likely set industry standards and help companies gain significant market share in a growing niche of collectible enthusiasts.

        -------------------

        Question: What technology stack is recommended for developing the software component of our smart storage solution?
        Answer: For the software component of our smart storage solution, the ideal technology stack would include using React Native for the mobile application to ensure smooth functionality across Android and iOS platforms. This choice supports a consistent user experience and reduces development time. Node.js is recommended for backend services due to its efficiency in handling asynchronous operations and its scalability, which is crucial for managing potentially large data loads and user interactions in real time. On the cloud infrastructure side, AWS services offer the reliability and scalability needed for deploying a robust application. Integrating AWS Textract for its advanced OCR capabilities will allow our solution to accurately process and digitize text from trading cards, enhancing the digital cataloging process. This stack not only ensures top performance but also maintains flexibility for future enhancements and integration with other technologies.

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
