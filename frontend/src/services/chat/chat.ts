import { GoogleGenerativeAI } from '@google/generative-ai'
import { chatApi } from '../api/api'
import useStore from '../../stores/useStore'
import { AIMessage } from '../../types/type'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_PUBLIC_GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export const chatService = {
  chat: model.startChat(),

  createMessage(role: AIMessage['role'], content: string): AIMessage {
    return {
      role,
      content,
      timestamp: new Date()
    }
  },

  async fetchChatHistory() {
    try {
      const response = await chatApi.getHistory()
      const messages = response.data
      useStore.setState({ messages })
      return messages
    } catch (error) {
      console.error('Error fetching chat history:', error)
      throw error
    }
  },

  async sendMessage(content: string) {
    try {
      const userMessage = this.createMessage('user', content)
      await chatApi.create({
        role: 'user',
        content: userMessage.content
      })
      useStore.getState().addMessage(userMessage)

      const result = await this.chat.sendMessage(content)
      const aiResponse = await result.response
      
      const aiMessage = this.createMessage('ai', aiResponse.text())
      await chatApi.create({
        role: 'assistant',
        content: aiMessage.content
      })
      useStore.getState().addMessage(aiMessage)
      
      return aiMessage
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }
}
