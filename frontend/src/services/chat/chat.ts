import { GoogleGenerativeAI } from '@google/generative-ai'
import { chatApi } from '../api/api'
import useStore from '../../stores/useStore'
import { AIMessage } from '../../types/type'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_PUBLIC_GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

export const chatService = {
  chat: model.startChat(),

  createMessage(role: AIMessage['role'], content: string, user_id: string): AIMessage {
    return {
      role,
      content,
      user_id: user_id
    }
  },

  async fetchChatHistory() {
    try {
      const response = await chatApi.getHistory()
      const messages = response.data.data
      useStore.setState({ messages })
      return messages
    } catch (error) {
      console.error('Error fetching chat history:', error)
      throw error
    }
  },

  async sendMessage(content: string, user_id: string) {
    try {
      // Add user message to the chat history
      const userMessage = this.createMessage('user', content, user_id)
      await chatApi.create({
        role: 'user',
        content: userMessage.content,
        user_id: userMessage.user_id
      })
      useStore.getState().addMessage(userMessage)

      const result = await this.chat.sendMessage(content)
      const aiResponse = await result.response

      // Add AI message to the chat history
      const aiMessage = this.createMessage('ai', aiResponse.text(), user_id)
      await chatApi.create({
        role: 'assistant',
        content: aiMessage.content,
        user_id: aiMessage.user_id
      })
      useStore.getState().addMessage(aiMessage)
      
      return aiMessage
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }
}
