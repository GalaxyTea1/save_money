import * as XLSX from 'xlsx';
import useStore from '../stores/useStore';

const ExportReports = () => {
  const { expenses, categories } = useStore();

  const exportToExcel = () => {
    const data = expenses.map(expense => ({
      'Date': new Date(expense.date).toLocaleDateString('vi-VN'),
      'Category': categories.find(c => c.id === expense.categoryId)?.name,
      'Description': expense.description,
      'Amount': `${expense.amount.toLocaleString('vi-VN')}đ`
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expense');
    XLSX.writeFile(wb, 'report-expense.xlsx');
  };

  return (
    <div className="flex gap-2">
      {/* <button
        onClick={exportToExcel}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Export Excel
      </button> */}
    </div>
  );
};

export default ExportReports;