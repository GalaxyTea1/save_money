import { useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import useStore from "../stores/useStore";
import { categoryService } from "../services/category/category";
import { expenseService } from "../services/expense/expense";
import { useBudgetStore } from "../stores/budgetStore";
import DashboardHeader from "../components/DashboardHeader";
import { useTranslation } from "react-i18next";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
}

interface TableHeaderProps {
    title: string;
    align?: "left" | "right" | "center";
}

interface TrendPoint {
    month: string;
    amount: number;
}

interface TrendData {
    trend: number;
    data: TrendPoint[];
}

const Dashboard = () => {
    const expenses = useStore((state) => state.expenses);
    const categories = useStore((state) => state.categories);
    const budgets = useBudgetStore((state) => state.budgets);
    const { t } = useTranslation();
    const thisMonth = t("dashboard.thisMonth");
    const lastMonth = t("dashboard.lastMonth");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                await categoryService.fetchCategories();
            } catch (error) {
                console.error("Error loading categories:", error);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadExpenses = async () => {
            const startDate = new Date();
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(0);
            endDate.setHours(23, 59, 59, 999);

            await expenseService.fetchExpenses(startDate, endDate);
        };
        loadExpenses();
    }, []);

    const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    const expensesByCategory = categories.map((category) => ({
        name: category.name,
        value: expenses.filter((expense) => expense.categoryId === category.id).reduce((sum, expense) => sum + Number(expense.amount), 0),
    }));

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF99CC", "#99CCFF", "#FF99FF", "#FFCC99"];

    const trendData: TrendData = (() => {
        const currentMonthTotal = totalExpense;
        const lastMonthTotal = expenses
            .filter((expense) => {
                const date = new Date(expense.date);
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                return date.getMonth() === lastMonth.getMonth();
            })
            .reduce((sum, expense) => sum + Number(expense.amount), 0);

        const trend = lastMonthTotal === 0 ? (currentMonthTotal > 0 ? 100 : 0) : ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

        return {
            trend,
            data: [
                { month: lastMonth, amount: lastMonthTotal },
                { month: thisMonth, amount: currentMonthTotal },
            ],
        };
    })();

    return (
        <div className='space-y-8'>
            <DashboardHeader />

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <StatCard title={t("dashboard.totalExpenses")} value={`${totalExpense.toLocaleString()}đ`} subtitle={t("dashboard.thisMonth")} />
                <StatCard title={t("dashboard.transactions")} value={expenses.length} subtitle={t("dashboard.thisMonth")} />
                <StatCard title={t("dashboard.categories")} value={categories.length} subtitle={t("dashboard.total")} />
            </div>

            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>{t("dashboard.trendExpenses")}</h3>
                <div className='h-[200px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <LineChart data={trendData.data}>
                            <XAxis dataKey='month' stroke='#888' />
                            <YAxis tickFormatter={(v) => `${v.toLocaleString()}`} stroke='#888' />
                            <Tooltip
                                formatter={(v) => [`${Number(v).toLocaleString()}đ`]}
                                contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none", color: "#fff" }}
                            />
                            <Line type='monotone' dataKey='amount' stroke='#8884d8' />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className={`mt-2 text-${trendData.trend > 0 ? "red" : "green"}-500`}>
                    {trendData.trend > 0 ? "↑" : "↓"} {Math.abs(trendData.trend).toFixed(1)}% {t("dashboard.comparedToLastMonth")}
                </div>
            </div>

            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>{t("dashboard.expensesByCategory")}</h3>
                <div className='h-[400px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <PieChart>
                            <Pie
                                data={expensesByCategory}
                                cx='50%'
                                cy='50%'
                                labelLine={false}
                                label={({ name, percent }) => (percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : "")}
                                outerRadius={150}
                                fill='#8884d8'
                                dataKey='value'
                            >
                                {expensesByCategory.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {expensesByCategory.map((category, index) => (
                        <div key={category.name} className='flex items-center'>
                            <div className='w-3 h-3 rounded-full mr-2' style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <div>
                                <p className='text-sm font-medium text-gray-900 dark:text-white'>{category.name}</p>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>{category.value.toLocaleString()}đ</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>{t("dashboard.recentTransactions")}</h3>
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                        <thead className='bg-gray-50 dark:bg-gray-700'>
                            <tr>
                                <TableHeader title={t("dashboard.date")} />
                                <TableHeader title={t("dashboard.category")} />
                                <TableHeader title={t("dashboard.description")} />
                                <TableHeader title={t("dashboard.amount")} align='right' />
                            </tr>
                        </thead>
                        <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                            {expenses.slice(0, 5).map((expense) => {
                                const category = categories.find((c) => c.id === expense.categoryId);
                                return (
                                    <tr key={expense.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                                        <td className='px-6 py-4 text-sm text-gray-900 dark:text-white'>
                                            {new Date(expense.date).toLocaleDateString()}
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-900 dark:text-white'>
                                            <div className='flex items-center'>
                                                {category?.icon && <span className='mr-2'>{category.icon}</span>}
                                                {category?.name}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-900 dark:text-white'>{expense.description}</td>
                                        <td className='px-6 py-4 text-sm text-right text-gray-900 dark:text-white'>
                                            {Number(expense.amount).toLocaleString()}đ
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
                <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>{t("dashboard.budget")}</h3>
                <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                    {totalSpent.toLocaleString()}đ / {totalBudget.toLocaleString()}đ
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{t("dashboard.thisMonth")}</p>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, subtitle }: StatCardProps) => (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
        <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>{title}</h3>
        <p className='text-2xl font-bold text-gray-900 dark:text-white'>{value}</p>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{subtitle}</p>
    </div>
);

const TableHeader = ({ title, align = "left" }: TableHeaderProps) => (
    <th className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`}>{title}</th>
);

export default Dashboard;
