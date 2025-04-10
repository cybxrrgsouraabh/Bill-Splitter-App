export interface User {
  id: string;
  name: string;
}

export interface Split {
  userId: string;
  percentage: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  currency: string;
  splits: Split[];
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  currency: string;
  users: User[];
  expenses: Expense[];
}