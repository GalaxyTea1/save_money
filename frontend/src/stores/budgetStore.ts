import { create } from "zustand";

interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  month: string; // Format: 'YYYY-MM'
}

interface BudgetStore {
  budgets: Budget[];
  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
}

export const useBudgetStore = create<BudgetStore>((set) => ({
  budgets: [],
  setBudgets: (budgets) => set({ budgets }),
  addBudget: (budget) => set((state) => ({ 
    budgets: [...state.budgets, budget] 
  })),
  updateBudget: (id, budget) => set((state) => ({
    budgets: state.budgets.map(b => 
      b.id === id ? { ...b, ...budget } : b
    )
  }))
}));

export default useBudgetStore; 