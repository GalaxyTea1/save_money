import { useState } from "react";
import useThemeStore from '../../stores/themeStore';
import { useTranslation } from 'react-i18next';

const Setting = () => {
    const [language, setLanguage] = useState('en');
    const [monthlySpendingLimit, setMonthlySpendingLimit] = useState(0);
    const [savingsGoal, setSavingsGoal] = useState(0);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [budgetAlerts, setBudgetAlerts] = useState(true);
    const { isDark, toggleDark } = useThemeStore();
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
    };

    return (
        <div className="p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">{t('settings.title')}</h2>

                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{t('settings.language')}</h3>
                    <select
                        className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 
                        rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        value={language}
                        onChange={handleLanguageChange}
                    >
                        <option value="en">{t('languages.english')}</option>
                        <option value="vi">{t('languages.vietnamese')}</option>
                        <option value="ja">{t('languages.japanese')}</option>
                    </select>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{t('settings.appearance')}</h3>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="darkMode"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                            checked={isDark}
                            onChange={toggleDark}
                        />
                        <label htmlFor="darkMode" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {t('settings.darkMode')}
                        </label>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{t('settings.financialGoals')}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('settings.monthlySpendingLimit')}
                            </label>
                            <input
                                type="number"
                                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 
                                rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder={t('settings.enterAmount')}
                                value={monthlySpendingLimit}
                                onChange={(e) => setMonthlySpendingLimit(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('settings.savingsGoal')}
                            </label>
                            <input
                                type="number"
                                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 
                                rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder={t('settings.enterAmount')}
                                value={savingsGoal}
                                onChange={(e) => setSavingsGoal(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{t('settings.notifications')}</h3>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="emailNotif"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                            />
                            <label htmlFor="emailNotif" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                {t('settings.emailNotifications')}
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="budgetAlert"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                                checked={budgetAlerts}
                                onChange={(e) => setBudgetAlerts(e.target.checked)}
                            />
                            <label htmlFor="budgetAlert" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                {t('settings.budgetAlerts')}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-500 mb-4">{t('settings.dangerZone')}</h3>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">{t('settings.deleteAccount')}</h4>
                        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                            {t('settings.deleteAccountWarning')}
                        </p>
                        <button
                            type="button"
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                            focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600"
                        >
                            {t('settings.deleteAccount')}
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                        text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {t('settings.cancel')}
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                        dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {t('settings.saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Setting;
