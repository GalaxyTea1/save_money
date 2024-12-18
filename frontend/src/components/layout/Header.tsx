import { useState, useRef } from 'react'
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi'
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth/auth';

const Header = () => {
  const navigate = useNavigate();
  const user = useAuthStore.getState().user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    setIsMenuOpen(false);
    navigate("/settings");
  };

  return (
    <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-bold text-gray-900 dark:text-white'>Expense Manager</h1>

        <div className='relative' ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2'
          >
            <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white'>
              {user?.fullName?.[0] || "U"}
            </div>
          </button>

          {isMenuOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700'>
              <button 
                onClick={handleProfileClick}
                className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <FiUser className='mr-3' /> Profile
              </button>
              <button 
                onClick={handleSettingsClick}
                className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <FiSettings className='mr-3' /> Settings
              </button>
              <button
                className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={handleLogout}
              >
                <FiLogOut className='mr-3' /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header
