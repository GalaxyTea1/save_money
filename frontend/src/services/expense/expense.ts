import useStore from '../../stores/useStore'
import { expenseApi } from '../api/api'

export const expenseService = {
  async fetchExpenses() {
    try {
      const response = await expenseApi.getAll()
      const expenses = response.data.data
      useStore.getState().setExpenses(expenses)
      return expenses
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }
}
