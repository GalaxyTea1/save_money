import useStore from '../../stores/useStore'
import { Expense } from '../../types/type'
import { expenseApi } from '../api/api'

export const expenseService = {
  async fetchExpenses(startDate?: Date, endDate?: Date, categoryId?: string) {
    try {
      const response = await expenseApi.getAll(startDate, endDate, categoryId)
      const expenses = response.data.data
      useStore.setState({expenses})
      return expenses
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  async addExpense(expense: Expense) {
    try {
      const response = await expenseApi.create(expense)
      const newExpense = response.data.data
      useStore.getState().addExpense(newExpense)
      return newExpense
    } catch (error) {
      console.error('Error adding expense:', error)
      throw error
    }
  },

  async updateExpense(expense: Expense) {
    try {
      const response = await expenseApi.update(expense.id, expense)
      const updatedExpense = response.data.data
      useStore.getState().updateExpense(updatedExpense)
      return updatedExpense
    } catch (error) {
      console.error('Error updating expense:', error)
      throw error
    }
  },

  async deleteExpense(id: string) {
    try {
      await expenseApi.delete(id)
      useStore.getState().deleteExpense(id)
    } catch (error) {
      console.error('Error deleting expense:', error)
      throw error
    }
  }
}
