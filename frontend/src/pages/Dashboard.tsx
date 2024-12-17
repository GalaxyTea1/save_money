import { useEffect } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import useStore from '../stores/useStore'
import { categoryService } from '../services/category/category'
import { expenseService } from '../services/expense/expense'

const Dashboard = () => {
  const expenses = useStore((state) => state.expenses)
  const categories = useStore((state) => state.categories)
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF99CC', '#99CCFF', '#FF99FF', '#FFCC99']

  return (
    <div className='space-y-8'>
      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 mb-1'>
            Total Expenses
          </h3>
          <p className='text-2xl font-bold text-gray-900'>
            {totalExpense.toLocaleString()}đ
          </p>
          <p className='text-sm text-gray-500 mt-1'>This Month</p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 mb-1'>
            Transactions
          </h3>
          <p className='text-2xl font-bold text-gray-900'>{expenses.length}</p>
          <p className='text-sm text-gray-500 mt-1'>This Month</p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500 mb-1'>Categories</h3>
          <p className='text-2xl font-bold text-gray-900'>
            {categories.length}
          </p>
          <p className='text-sm text-gray-500 mt-1'>Total</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className='bg-white p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
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
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
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
                <p className='text-sm font-medium text-gray-900'>
                  {category.name}
                </p>
                <p className='text-sm text-gray-500'>
                  {category.value.toLocaleString()}đ
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className='bg-white p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Recent Transactions
        </h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Category
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Description
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {expenses.slice(0, 5).map((expense) => (
                <tr key={expense.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
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
                  <td className='px-6 py-4 text-sm text-gray-900'>
                    {expense.description}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right'>
                    {Number(expense.amount).toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard
