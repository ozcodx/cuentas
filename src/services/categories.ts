import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from 'firebase/auth';

export interface Category {
  id?: string;
  userId: string;
  name: string;
  type: 'expense' | 'income';
  color?: string;
  icon?: string;
}

export const addCategory = async (category: Omit<Category, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), category);
    return docRef.id;
  } catch (error) {
    console.error('Error al añadir categoría:', error);
    throw error;
  }
};

export const getCategories = async (user: User) => {
  try {
    const q = query(
      collection(db, 'categories'),
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    await updateDoc(categoryRef, updates);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    throw error;
  }
}; 