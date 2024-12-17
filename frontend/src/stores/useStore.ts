import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AIMessage, Category, Expense } from '../types/type'

interface Store {
  categories: Category[]
  expenses: Expense[]
  messages: AIMessage[]
  
  addCategory: (category: Category) => void
  updateCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  addExpense: (expense: Expense) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
  addMessage: (message: AIMessage) => void
}

const useStore = create<Store>()(
  persist(
    (set) => ({
      categories: [],
      expenses: [],
      messages: [],
      
      addCategory: (category) => 
        set((state) => ({ categories: [...state.categories, category] })),
      
      updateCategory: (category) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === category.id ? category : c
          ),
        })),
      
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),


      addExpense: (expense) =>
        set((state) => ({ expenses: [...state.expenses, expense] })),
      
      updateExpense: (expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === expense.id ? expense : e
          ),
        })),
      
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export default useStore