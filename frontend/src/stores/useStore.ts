import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Category, Expense } from '../types/type'

interface Store {
  categories: Category[]
  expenses: Expense[]
  
  addCategory: (category: Category) => void
  updateCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  addExpense: (expense: Expense) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
}

const useStore = create<Store>()(
  persist(
    (set) => ({
      categories: [],
      expenses: [],
      
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
    }),
    {
      name: 'expense-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export default useStore