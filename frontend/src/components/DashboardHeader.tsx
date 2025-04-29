import { useState } from "react";
import ExportReports from "./ExportReports";
import BudgetManager from "./BudgetManager";
import { useTranslation } from "react-i18next";

const DashboardHeader = () => {
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const { t } = useTranslation();

    return (
        <div className='mb-8 flex justify-between items-center'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{t("dashboard.dashboard")}</h1>

            <div className='flex items-center gap-4'>
                <ExportReports />

                <button onClick={() => setShowBudgetModal(true)} className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'>
                    {t("dashboard.setupBudget")}
                </button>

                {/* Modal setup budget */}
                {showBudgetModal && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md'>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-xl font-bold'>{t("dashboard.setupBudget")}</h2>
                                <button onClick={() => setShowBudgetModal(false)} className='text-gray-500 hover:text-gray-700'>
                                    ✕
                                </button>
                            </div>
                            <BudgetManager />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHeader;
