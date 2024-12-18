import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import useStore from '../stores/useStore';

const ExportReports = () => {
  const { expenses, categories } = useStore();

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.addFont('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap', 'Times New Roman', 'normal');
    doc.setFont('Times New Roman');
    
    const columns = {
      date: { x: 20, width: 30 },
      category: { x: 55, width: 40 },
      description: { x: 100, width: 50 },
      amount: { x: 155, width: 35 }
    };
    
    doc.setFontSize(16);
    doc.text('Report Expense', 20, 20);
    
    doc.setFontSize(12);
    let y = 40;

    doc.text('Date', columns.date.x, y);
    doc.text('Category', columns.category.x, y);
    doc.text('Description', columns.description.x, y);
    doc.text('Amount', columns.amount.x, y);
    
    y += 2;
    doc.line(20, y, 190, y);
    y += 8;

    const truncateText = (text: string, maxWidth: number) => {
      if (!text) return '';
      if (doc.getTextWidth(text) <= maxWidth) return text;
      
      let truncated = text;
      while (doc.getTextWidth(truncated + '...') > maxWidth && truncated.length > 0) {
        truncated = truncated.slice(0, -1);
      }
      return truncated + '...';
    };

    expenses.forEach((expense) => {
      if (y >= 280) {
        doc.addPage();
        y = 20;
      }

      const category = categories.find(c => c.id === expense.categoryId);
      const date = new Date(expense.date).toLocaleDateString('vi-VN');
      const amount = expense.amount.toLocaleString('vi-VN') + 'đ';

      doc.text(date, columns.date.x, y);
      doc.text(
        truncateText(category?.name || '', columns.category.width), 
        columns.category.x, 
        y
      );
      doc.text(
        truncateText(expense.description || '', columns.description.width),
        columns.description.x,
        y
      );
      doc.text(
        amount,
        columns.amount.x + columns.amount.width - doc.getTextWidth(amount),
        y
      );

      y += 10;
    });
    
    y += 2;
    doc.line(20, y, 190, y);
    y += 8;

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalText = `Total: ${total.toLocaleString('vi-VN')}đ`;
    doc.setFont('Times New Roman', 'bold');
    doc.text(
      totalText,
      columns.amount.x + columns.amount.width - doc.getTextWidth(totalText),
      y
    );
    
    doc.save('report-expense.pdf');
  };

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
      <button
        onClick={exportToPDF}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Export PDF
      </button>
      <button
        onClick={exportToExcel}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Export Excel
      </button>
    </div>
  );
};

export default ExportReports;