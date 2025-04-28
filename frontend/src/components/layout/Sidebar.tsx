import { NavLink } from "react-router-dom";
import { FiHome, FiDollarSign, FiGrid, FiMessageSquare } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const menuItems = [
    { icon: FiHome, label: "menu.home", path: "/" },
    { icon: FiDollarSign, label: "menu.expenses", path: "/expenses" },
    { icon: FiGrid, label: "menu.categories", path: "/categories" },
    { icon: FiMessageSquare, label: "menu.aiAdvisor", path: "/ai-advisor" },
];

const Sidebar = () => {
    const { t } = useTranslation();

    return (
        <div className='w-16 md:w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center md:items-start py-8'>
            <nav className='flex-1 space-y-1 w-full px-4'>
                {menuItems.map((item) => (
                    <NavLink key={item.path} to={item.path} className='relative group flex items-center justify-center w-full'>
                        {({ isActive }: { isActive: boolean }) => (
                            <div
                                className={`flex items-center justify-center md:justify-start py-3 px-6 rounded-lg w-full ${
                                    isActive
                                        ? "bg-blue-50 dark:bg-blue-900 text-blue-500"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-500"
                                }`}
                            >
                                <item.icon className='w-5 h-5 min-w-[20px]' />
                                <span className='hidden md:block ml-3 font-medium'>{t(item.label)}</span>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
