import { useEffect } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import useStore from '../stores/useStore'
import { categoryService } from '../services/category/category'
import { expenseService } from '../services/expense/expense'
import { useBudgetStore } from '../stores/budgetStore'
import DashboardHeader from '../components/DashboardHeader';

const Dashboard = () => {
  const expenses = useStore((state) => state.expenses)
  const categories = useStore((state) => state.categories)
  const budgets = useBudgetStore((state) => state.budgets)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        await categoryService.fetchCategories()
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
    
    loadCategories()
  }, [])

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
    }

    loadExpenses()
  }, [])

  const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  const expensesByCategory = categories?.map(category => ({
    name: category.name,
    value: expenses
      .filter(expense => expense.categoryId === category.id)
      .reduce((sum, expense) => sum + Number(expense.amount), 0)
  }))

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF99CC', '#99CCFF', '#FF99FF', '#FFCC99']

  const getTrendData = () => {
    const currentMonthTotal = totalExpense;
    const lastMonthTotal = expenses
      .filter(expense => {
        const date = new Date(expense.date);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return date.getMonth() === lastMonth.getMonth();
      })
      .reduce((sum, expense) => sum + Number(expense.amount), 0);

    let trend = 0;
    if (lastMonthTotal === 0) {
      trend = currentMonthTotal > 0 ? 100 : 0;
    } else {
      trend = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    }
    
    return {
      trend,
      data: [
        { month: 'Last Month', amount: lastMonthTotal },
        { month: 'This Month', amount: currentMonthTotal },
      ]
    };
  };

  return (
    <div className='space-y-8'>
      <DashboardHeader />
      
      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
            Total Expenses
          </h3>
          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
            {totalExpense.toLocaleString()}đ
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>This Month</p>
        </div>

        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
            Transactions
          </h3>
          <p className='text-2xl font-bold text-gray-900 dark:text-white'>{expenses.length}</p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>This Month</p>
        </div>

        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>Categories</h3>
          <p className='text-2xl font-bold text-gray-900 dark:text-white'>
            {categories.length}
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Total</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Trend Expenses
        </h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getTrendData().data}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis 
                width={80}
                tickFormatter={(value) => `${value.toLocaleString()}`}
                stroke="#888"
              />
              <Tooltip 
                formatter={(value) => [`${Number(value).toLocaleString()}đ`]}
                contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none', color: '#fff' }}
              />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={`mt-2 text-${getTrendData().trend > 0 ? 'red' : 'green'}-500`}>
          {getTrendData().trend > 0 ? '↑' : '↓'} {Math.abs(getTrendData().trend).toFixed(1)}% compared to last month
        </div>
      </div>

      {/* Pie Chart */}
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Expenses by Category
        </h3>
        <div className='h-[400px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, percent }) => {
                  if (percent > 0) {
                    return `${name} ${(percent * 100).toFixed(0)}%`;
                  }
                  return '';
                }}
                outerRadius={150}
                fill='#8884d8'
                dataKey='value'
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
          {expensesByCategory.map((category, index) => (
            <div key={category.name} className='flex items-center'>
              <div
                className='w-3 h-3 rounded-full mr-2'
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div>
                <p className='text-sm font-medium text-gray-900 dark:text-white'>
                  {category.name}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {category.value.toLocaleString()}đ
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-4'>
          Recent Transactions
        </h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Category
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Description
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
              {expenses.slice(0, 5).map((expense) => (
                <tr key={expense.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                    <div className='flex items-center'>
                      {categories.find((c) => c.id === expense.categoryId)
                        ?.icon && (
                        <span className='mr-2'>
                          {
                            categories.find((c) => c.id === expense.categoryId)
                              ?.icon
                          }
                        </span>
                      )}
                      {
                        categories.find((c) => c.id === expense.categoryId)
                          ?.name
                      }
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-900 dark:text-white'>
                    {expense.description}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-right'>
                    {Number(expense.amount).toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm'>
        <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>
          Ngân sách
        </h3>
        <p className='text-2xl font-bold text-gray-900 dark:text-white'>
          {totalSpent.toLocaleString()}đ / {totalBudget.toLocaleString()}đ
        </p>
        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Tháng này</p>
      </div>
    </div>
  );
}

export default Dashboard
