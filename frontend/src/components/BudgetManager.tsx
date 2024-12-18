import { useState } from 'react';
import useStore from '../stores/useStore';
import useBudgetStore from '../stores/budgetStore';

const BudgetManager = () => {
  const categories = useStore((state) => state.categories);
  const budgets = useBudgetStore((state) => state.budgets);
  const addBudget = useBudgetStore((state) => state.addBudget);
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBudget({
      id: Date.now().toString(),
      categoryId: selectedCategory,
      amount: Number(amount),
      spent: 0,
      month: new Date().toISOString().slice(0, 7)
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Budget
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Budget
        </button>
      </form>

      <div className="space-y-4">
        {budgets.map((budget) => {
          const category = categories.find(c => c.id === budget.categoryId);
          const progress = (budget.spent / budget.amount) * 100;
          const isOverBudget = progress > 100;

          return (
            <div key={budget.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{category?.name}</h4>
                <span className={isOverBudget ? 'text-red-500' : 'text-gray-500'}>
                  {budget.spent.toLocaleString()}đ / {budget.amount.toLocaleString()}đ
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded">
                <div
                  className={`h-full rounded ${
                    isOverBudget ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              {isOverBudget && (
                <p className="text-red-500 text-sm mt-1">
                  Over Budget {(progress - 100).toFixed(1)}%
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager; 