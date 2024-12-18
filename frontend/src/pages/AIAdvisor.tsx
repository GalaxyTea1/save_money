import { useState, useEffect } from 'react'
import { FiSend } from 'react-icons/fi'
import useStore from '../stores/useStore'
import { chatService } from '../services/chat/chat'
import { AIMessage } from '../types/type';
import { useAuthStore } from '../stores/authStore';

export interface ExpenseState {
  messages: AIMessage[];
  addMessage: (message: AIMessage) => void;
}

const AIAdvisor = () => {
  const messages = useStore((state) => state.messages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const user = useAuthStore.getState().user;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        await chatService.fetchChatHistory()
      } catch (error) {
        console.error("Error fetching chat history:", error)
      }
    }

    fetchMessages()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setInput('')
    setIsLoading(true)

    try {
      await chatService.sendMessage(input, user?.id || '');
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='h-[calc(100vh-12rem)] flex flex-col'>
      <div className='bg-white p-6 rounded-lg shadow-sm mb-6'>
        <h2 className='text-lg font-medium text-gray-900 mb-2'>AI Advisor</h2>
        <p className='text-gray-600'>Ask me anything</p>
      </div>

      <div className='flex-1 bg-white rounded-lg shadow-sm flex flex-col'>
        <div className='flex-1 p-6 overflow-y-auto space-y-4'>
          {!messages || messages.length === 0 ? (
            <div className='text-center text-gray-500 mt-8'>
              No messages yet. Start a conversation!
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[96%] rounded-lg px-4 py-2 my-2 whitespace-pre-line ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className='flex justify-start'>
              <div className='bg-gray-100 rounded-lg px-4 py-2 text-gray-500'>
                Thinking...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className='border-t border-gray-200 p-4 flex gap-2'
        >
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type your message...'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            type='submit'
            disabled={isLoading || !input.trim()}
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            <FiSend className='w-5 h-5' />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIAdvisor
