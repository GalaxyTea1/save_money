export interface User {
    id: string;
    email: string;
    fullName: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  }
  
  export interface Expense {
    id: string;
    amount: string;
    description: string;
    categoryId: string;
    date: Date;
    userId: string;
  }
  
  export interface AIMessage {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }