import { useState, useRef } from "react";
import { FiUser, FiSettings, FiLogOut, FiChevronRight } from "react-icons/fi";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/auth/auth";
import { useTranslation } from "react-i18next";

const Header = () => {
    const navigate = useNavigate();
    const user = useAuthStore.getState().user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const { t } = useTranslation();

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

    const getBreadcrumbTitle = () => {
        switch (location.pathname) {
            case "/":
                return "Home";
            case "/expenses":
                return "Expenses";
            case "/categories":
                return "Categories";
            case "/ai-advisor":
                return "AI Advisor";
            default:
                return "";
        }
    };

    const breadcrumbTitle = getBreadcrumbTitle();

    return (
        <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-4'>
                    <div className='flex items-center'>
                        <h1 className='text-xl font-bold text-gray-900 dark:text-white'>{t("header.headerTitle")}</h1>
                        {breadcrumbTitle && (
                            <>
                                <FiChevronRight className='mx-2 text-gray-400' />
                                <span className='text-xl text-blue-500 font-semibold'>{breadcrumbTitle}</span>
                            </>
                        )}
                    </div>
                </div>

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
                        <div className='absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-50'>
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
};

export default Header;
