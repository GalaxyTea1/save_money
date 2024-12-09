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
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-8">
      <nav className="flex-1 space-y-8">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="relative group"
            title={item.label}
          >
            <div
              className={`p-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-500'
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
