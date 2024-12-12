import { useState } from 'react'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import useStore from '../stores/useStore'
import CategoryModal from '../components/category/CategoryModal'
import { Category } from '../types/type'

export interface ExpenseState {
  categories: Category[];
  deleteCategory: (categoryId: string) => void;
}

const Categories = () => {
  const categories = useStore((state) => state.categories)
  const deleteCategory = useStore((state) => state.deleteCategory)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setSelectedCategory(null)
    setIsModalOpen(false)
  }

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId)
        toast.success('Category deleted successfully')
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Failed to delete category')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-6 rounded-lg shadow-sm relative group"
            style={{ 
              borderLeft: `4px solid ${category.color || '#000000'}` 
            }}
          >
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(category.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4">
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              {category.icon && (
                <span className="text-2xl mb-2 block">{category.icon}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen ? (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleClose}
          category={selectedCategory}
          key={selectedCategory?.id || 'new'}
        />
      ) : null}
    </div>
  )
}

export default Categories
