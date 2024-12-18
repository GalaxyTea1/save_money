import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiDollarSign, FiGrid, FiMessageSquare } from 'react-icons/fi'

const menuItems = [
  { icon: FiHome, label: 'Dashboard', path: '/' },
  { icon: FiDollarSign, label: 'Expenses', path: '/expenses' },
  { icon: FiGrid, label: 'Categories', path: '/categories' },
  { icon: FiMessageSquare, label: 'AI Advisor', path: '/ai-advisor' },
]

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-8">
      <nav className="flex-1 space-y-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="relative group"
          >
            <div
              className={`p-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 dark:bg-blue-900 text-blue-500'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
