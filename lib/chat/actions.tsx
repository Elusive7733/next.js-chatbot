import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { openai } from '@ai-sdk/openai'

import { spinner, BotMessage, SystemMessage } from '@/components/stocks'

import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat, Message } from '@/lib/types'
import { auth } from '@/auth'

async function confirmPurchase(symbol: string, price: number, amount: number) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{' '}
          {formatNumber(amount * price)}
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
            amount * price
          }]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

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
    // tools: {
    //   listStocks: {
    //     description: 'List three imaginary stocks that are trending.',
    //     parameters: z.object({
    //       stocks: z.array(
    //         z.object({
    //           symbol: z.string().describe('The symbol of the stock'),
    //           price: z.number().describe('The price of the stock'),
    //           delta: z.number().describe('The change in price of the stock')
    //         })
    //       )
    //     }),
    //     generate: async function* ({ stocks }) {
    //       yield (
    //         <BotCard>
    //           <StocksSkeleton />
    //         </BotCard>
    //       )

    //       await sleep(1000)

    //       const toolCallId = nanoid()

    //       aiState.done({
    //         ...aiState.get(),
    //         messages: [
    //           ...aiState.get().messages,
    //           {
    //             id: nanoid(),
    //             role: 'assistant',
    //             content: [
    //               {
    //                 type: 'tool-call',
    //                 toolName: 'listStocks',
    //                 toolCallId,
    //                 args: { stocks }
    //               }
    //             ]
    //           },
    //           {
    //             id: nanoid(),
    //             role: 'tool',
    //             content: [
    //               {
    //                 type: 'tool-result',
    //                 toolName: 'listStocks',
    //                 toolCallId,
    //                 result: stocks
    //               }
    //             ]
    //           }
    //         ]
    //       })

    //       return (
    //         <BotCard>
    //           <Stocks props={stocks} />
    //         </BotCard>
    //       )
    //     }
    //   },
    //   showStockPrice: {
    //     description:
    //       'Get the current stock price of a given stock or currency. Use this to show the price to the user.',
    //     parameters: z.object({
    //       symbol: z
    //         .string()
    //         .describe(
    //           'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
    //         ),
    //       price: z.number().describe('The price of the stock.'),
    //       delta: z.number().describe('The change in price of the stock')
    //     }),
    //     generate: async function* ({ symbol, price, delta }) {
    //       yield (
    //         <BotCard>
    //           <StockSkeleton />
    //         </BotCard>
    //       )

    //       await sleep(1000)

    //       const toolCallId = nanoid()

    //       aiState.done({
    //         ...aiState.get(),
    //         messages: [
    //           ...aiState.get().messages,
    //           {
    //             id: nanoid(),
    //             role: 'assistant',
    //             content: [
    //               {
    //                 type: 'tool-call',
    //                 toolName: 'showStockPrice',
    //                 toolCallId,
    //                 args: { symbol, price, delta }
    //               }
    //             ]
    //           },
    //           {
    //             id: nanoid(),
    //             role: 'tool',
    //             content: [
    //               {
    //                 type: 'tool-result',
    //                 toolName: 'showStockPrice',
    //                 toolCallId,
    //                 result: { symbol, price, delta }
    //               }
    //             ]
    //           }
    //         ]
    //       })

    //       return (
    //         <BotCard>
    //           <Stock props={{ symbol, price, delta }} />
    //         </BotCard>
    //       )
    //     }
    //   },
    //   showStockPurchase: {
    //     description:
    //       'Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency.',
    //     parameters: z.object({
    //       symbol: z
    //         .string()
    //         .describe(
    //           'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
    //         ),
    //       price: z.number().describe('The price of the stock.'),
    //       numberOfShares: z
    //         .number()
    //         .optional()
    //         .describe(
    //           'The **number of shares** for a stock or currency to purchase. Can be optional if the user did not specify it.'
    //         )
    //     }),
    //     generate: async function* ({ symbol, price, numberOfShares = 100 }) {
    //       const toolCallId = nanoid()

    //       if (numberOfShares <= 0 || numberOfShares > 1000) {
    //         aiState.done({
    //           ...aiState.get(),
    //           messages: [
    //             ...aiState.get().messages,
    //             {
    //               id: nanoid(),
    //               role: 'assistant',
    //               content: [
    //                 {
    //                   type: 'tool-call',
    //                   toolName: 'showStockPurchase',
    //                   toolCallId,
    //                   args: { symbol, price, numberOfShares }
    //                 }
    //               ]
    //             },
    //             {
    //               id: nanoid(),
    //               role: 'tool',
    //               content: [
    //                 {
    //                   type: 'tool-result',
    //                   toolName: 'showStockPurchase',
    //                   toolCallId,
    //                   result: {
    //                     symbol,
    //                     price,
    //                     numberOfShares,
    //                     status: 'expired'
    //                   }
    //                 }
    //               ]
    //             },
    //             {
    //               id: nanoid(),
    //               role: 'system',
    //               content: `[User has selected an invalid amount]`
    //             }
    //           ]
    //         })

    //         return <BotMessage content={'Invalid amount'} />
    //       } else {
    //         aiState.done({
    //           ...aiState.get(),
    //           messages: [
    //             ...aiState.get().messages,
    //             {
    //               id: nanoid(),
    //               role: 'assistant',
    //               content: [
    //                 {
    //                   type: 'tool-call',
    //                   toolName: 'showStockPurchase',
    //                   toolCallId,
    //                   args: { symbol, price, numberOfShares }
    //                 }
    //               ]
    //             },
    //             {
    //               id: nanoid(),
    //               role: 'tool',
    //               content: [
    //                 {
    //                   type: 'tool-result',
    //                   toolName: 'showStockPurchase',
    //                   toolCallId,
    //                   result: {
    //                     symbol,
    //                     price,
    //                     numberOfShares
    //                   }
    //                 }
    //               ]
    //             }
    //           ]
    //         })

    //         return (
    //           <BotCard>
    //             <Purchase
    //               props={{
    //                 numberOfShares,
    //                 symbol,
    //                 price: +price,
    //                 status: 'requires_action'
    //               }}
    //             />
    //           </BotCard>
    //         )
    //       }
    //     }
    //   },
    //   getEvents: {
    //     description:
    //       'List funny imaginary events between user highlighted dates that describe stock activity.',
    //     parameters: z.object({
    //       events: z.array(
    //         z.object({
    //           date: z
    //             .string()
    //             .describe('The date of the event, in ISO-8601 format'),
    //           headline: z.string().describe('The headline of the event'),
    //           description: z.string().describe('The description of the event')
    //         })
    //       )
    //     }),
    //     generate: async function* ({ events }) {
    //       yield (
    //         <BotCard>
    //           <EventsSkeleton />
    //         </BotCard>
    //       )

    //       await sleep(1000)

    //       const toolCallId = nanoid()

    //       aiState.done({
    //         ...aiState.get(),
    //         messages: [
    //           ...aiState.get().messages,
    //           {
    //             id: nanoid(),
    //             role: 'assistant',
    //             content: [
    //               {
    //                 type: 'tool-call',
    //                 toolName: 'getEvents',
    //                 toolCallId,
    //                 args: { events }
    //               }
    //             ]
    //           },
    //           {
    //             id: nanoid(),
    //             role: 'tool',
    //             content: [
    //               {
    //                 type: 'tool-result',
    //                 toolName: 'getEvents',
    //                 toolCallId,
    //                 result: events
    //               }
    //             ]
    //           }
    //         ]
    //       })

    //       return (
    //         <BotCard>
    //           <Events props={events} />
    //         </BotCard>
    //       )
    //     }
    //   }
    // }
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
    submitUserMessage,
    confirmPurchase
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

// message.role === 'tool' ? (
//   message.content.map(tool => {
//     return tool.toolName === 'listStocks' ? (
//       <BotCard>
//         {/* TODO: Infer types based on the tool result*/}
//         {/* @ts-expect-error */}
//         <Stocks props={tool.result} />
//       </BotCard>
//     ) : tool.toolName === 'showStockPrice' ? (
//       <BotCard>
//         {/* @ts-expect-error */}
//         <Stock props={tool.result} />
//       </BotCard>
//     ) : tool.toolName === 'showStockPurchase' ? (
//       <BotCard>
//         {/* @ts-expect-error */}
//         <Purchase props={tool.result} />
//       </BotCard>
//     ) : tool.toolName === 'getEvents' ? (
//       <BotCard>
//         {/* @ts-expect-error */}
//         <Events props={tool.result} />
//       </BotCard>
//     ) : null
//   })
// ) :
