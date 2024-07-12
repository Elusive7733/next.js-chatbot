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

Questions and Answers:
    Question 1: What are John Smith's main concerns for the mobile app project?

    Answer 1: 
    John Smith is primarily concerned with AI integration for personalized insights, high-level security for user data, and comprehensive data analytics to understand user behavior.

    --------------------

    Question 2: What budget did John Smith outline for the project?

    Answer 2: 
    John Smith's budget range for the project is between $500,000 and $750,000.

    --------------------

    Question 3: What did our tech lead say about our experience with similar AI projects?

    Answer 3: 
    Bob Chen mentioned our extensive experience with AI integration, highlighting a past project that involved developing an AI-powered e-commerce app focusing on personalized shopping experiences.

    --------------------

    Question 4: What specific AI capabilities is the client interested in for the finance management app?

    Answer 4:
    The client is interested in AI capabilities that provide personalized financial insights to users, which could include predictive analytics regarding spending habits and financial recommendations based on individual user data.

    --------------------

    Question 5: What are the client's requirements for data security in the app?

    Answer 5: 
    The client emphasized that security and data protection are top priorities, indicating the need for robust encryption, secure data storage solutions, and compliance with data protection regulations such as GDPR.

    --------------------

    Question 6: What platforms does the client want the app to support?

    Answer 6: 
    The client specified that the app should support multi-platform functionality, including both iOS and Android, to ensure broad accessibility for all users.

    --------------------

    Question 7: What is the desired launch date for the app?

    Answer 7: 
    The client aims to launch the finance management app in the second quarter of 2025.

    --------------------

    Question 8: Does the client require any post-launch support services?

    Answer 8: 
    Yes, the client requested information on post-launch support options, indicating a need for ongoing maintenance, updates, and possibly user support services after the app's initial release.

    --------------------

    Question 9: What is the client's budget range for the entire project?

    Answer 9: 
    The client's budget for the project ranges from $500,000 to $750,000, as outlined in the project requirements form.

    --------------------

    Question 10: Can you provide details from the feedback in the initial consultation?

    Answer 10: 
    During the initial consultation, the client praised the prototype's user interface but requested additional features such as more detailed financial tracking and analysis tools.

    --------------------

    Question 11: What additional features did the client suggest during the JotForm submission?

    Answer 11: 
    In addition to the core features, the client suggested that the app should include capabilities to track sleep patterns and other health metrics that can impact financial decisions.

    --------------------

    Question 12: How many users does the client anticipate will use the app?

    Answer 12: 
    While the specific number wasn't stated, the client expects a significant user base, as indicated by the requirement for robust scalability and multi-platform support.

    --------------------

    Question 13: What were the main takeaways from the latest communication with the client?

    Answer 13: 
    The latest communication highlighted the client's satisfaction with the proposed project timeline and approach but requested a more detailed breakdown of costs and a clearer description of the technical specifications.

    --------------------

    Question 14: What are Sophia Mendoza’s main objectives with the AI implementation?
    
    Answer 14: Sophia's main objectives are to enhance real-time data processing, improve forecasting accuracy, and automate inventory management at LogiTech Solutions.

    --------------------

    Question 15: What concerns does Sophia have about AI integration?
    
    Answer 15: Sophia is concerned about ensuring the AI solution integrates seamlessly with their existing ERP systems without significant downtime.

    --------------------

    Question 16: What solutions did Bob Chen suggest for LogiTech Solutions?
    
    Answer 16: Bob suggested implementing AI-driven analytics to predict demand patterns and automate inventory management, aiming to reduce operational costs and improve service levels.

    --------------------

    Question 17: Can you summarize the discussion points from our initial meeting with Sophia Mendoza?

    Answer 17: In the initial meeting, Sophia Mendoza expressed the need for AI to enhance real-time data processing and forecasting capabilities. We discussed integrating AI-driven analytics to optimize supply chain operations, including demand prediction and inventory management automation. Sophia was particularly interested in ensuring that the AI solution could integrate seamlessly with their existing ERP systems.

    --------------------

    Question 18: What examples of similar projects will be included in the proposal for LogiTech Solutions?

    Answer 18: The proposal will include case studies of successful implementations where we optimized supply chain operations for other companies by integrating AI analytics. These examples will highlight past projects that involved enhancing data processing speeds, improving forecasting accuracy, and automating inventory systems, specifically mentioning any similar industry applications.

    --------------------

    Question 19: What are the expected outcomes for LogiTech Solutions with the AI integration as discussed in the meeting?

    Answer 19: The expected outcomes for LogiTech Solutions with the AI integration include reduced operational costs due to more efficient inventory management, improved efficiency of the supply chain, and enhanced decision-making capabilities through better forecasting and real-time data analytics.

    --------------------

    Question 20: What concerns did Sophia express about system integration and how did we address them?
    
    Answer 20: Sophia expressed concerns about potential disruptions during system integration. We addressed these concerns by proposing a phased integration plan that includes thorough testing and validation stages to ensure compatibility with their existing ERP and custom logistics software, minimizing any potential downtime.
    
    --------------------

    Question 21: What specific AI technologies did we propose to implement for LogiTech Solutions and why?
    
    Answer: We proposed to implement machine learning algorithms for predictive analytics and natural language processing for automating data input and queries. These technologies were chosen because they are well-suited to enhance real-time data processing capabilities and improve the accuracy of forecasting models, which are critical for optimizing supply chain operations in the logistics industry.

    --------------------

    Question 22: What are the key steps in our proposed integration plan for LogiTech Solutions?

    Answer 22: The key steps in our proposed integration plan include an initial system assessment, integration of AI modules with existing ERP and logistics software, followed by a series of pilot tests to ensure seamless functionality. This will be accompanied by training sessions for staff and ongoing support to handle any emerging issues post-integration.

    --------------------

    Question 23: How did we propose to handle data security and privacy concerns during the AI integration?

    Answer 23: We proposed to handle data security and privacy concerns by implementing state-of-the-art encryption methods and strict access controls throughout the integration process. Additionally, all AI implementations will comply with relevant data protection regulations to ensure that customer and company data are safeguarded.

    --------------------
    
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
