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
    let isMounted = true;
    
    const fetchMessages = async () => {
      try {
        if (isMounted) {
          await chatService.fetchChatHistory()
        }
      } catch (error) {
        console.error("Error fetching chat history:", error)
      }
    }

    fetchMessages()
    
    return () => {
      isMounted = false;
    }
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
    <div className='h-[calc(100vh-12rem)] flex flex-col relative'>
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>AI Advisor</h2>
        <p className='text-gray-600 dark:text-gray-300'>Ask me anything</p>
      </div>

      <div className='flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col'>
        <div className='flex-1 p-6 overflow-y-auto space-y-4 pb-16 max-h-[calc(100vh-20rem)]'>
          {!messages || messages.length === 0 ? (
            <div className='text-center text-gray-500 dark:text-gray-400 mt-8'>
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
                  className={`max-w-[98%] rounded-lg px-4 py-2 my-2 whitespace-pre-line ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className='flex justify-start'>
              <div className='bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 text-gray-500 dark:text-gray-400'>
                Thinking...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className='sticky bottom-0 left-0 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-2 w-full bg-white dark:bg-gray-800'
        >
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type your message...'
            className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
          />
          <button
            type='submit'
            disabled={isLoading || !input.trim()}
            className='px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            <FiSend className='w-5 h-5' />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIAdvisor
