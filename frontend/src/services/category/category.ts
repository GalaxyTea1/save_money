import { categoryApi } from '../api/api'
import useStore from '../../stores/useStore'

export const categoryService = {
  async fetchCategories() {
    try {
      const response = await categoryApi.getAll()
      const categories = response.data.data
      useStore.getState().setCategories(categories)
      return categories
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }
}
