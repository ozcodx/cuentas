import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from 'firebase/auth';

export interface Transaction {
  id?: string;
  userId: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  date: Date;
  timestamp: Date;
}

export const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transaction,
      date: Timestamp.fromDate(transaction.date),
      timestamp: Timestamp.fromDate(transaction.timestamp)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al añadir transacción:', error);
    throw error;
  }
};

export const getTransactionsByMonth = async (user: User, month: Date) => {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);

  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      where('date', '>=', Timestamp.fromDate(startOfMonth)),
      where('date', '<=', Timestamp.fromDate(endOfMonth)),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      timestamp: doc.data().timestamp.toDate()
    })) as Transaction[];
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    throw error;
  }
};

export const getTransactionsByDateRange = async (user: User, startDate: Date, endDate: Date) => {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      timestamp: doc.data().timestamp.toDate()
    })) as Transaction[];
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    throw error;
  }
}; 