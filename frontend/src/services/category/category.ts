import { categoryApi } from '../api/api'
import useStore from '../../stores/useStore'

interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export const categoryService = {
  fetchCategories: async () => {
    try {
      const response = await categoryApi.getAll()
      const categories = response.data.data
      useStore.setState({ categories })
      return categories
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  addCategory: async (category: Category) => {
    try {
      const response = await categoryApi.create(category)
      const newCategory = response.data.data
      useStore.getState().addCategory(newCategory)
      return newCategory
    } catch (error) {
      console.error('Error adding category:', error)
      throw error
    }
  },

  updateCategory: async (category: Category) => {
    try {
      const response = await categoryApi.update(category.id, category)
      const updatedCategory = response.data.data
      useStore.getState().updateCategory(updatedCategory)
      return updatedCategory
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await categoryApi.delete(id)
      useStore.getState().deleteCategory(id)
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  },
}
