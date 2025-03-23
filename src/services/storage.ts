import AsyncStorage from '@react-native-async-storage/async-storage';
import { Person } from '../types/models';

const PEOPLE_STORAGE_KEY = 'meetchain_people';

export const savePeople = async (people: Person[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(PEOPLE_STORAGE_KEY, JSON.stringify(people));
  } catch (error) {
    console.error('データ保存エラー:', error);
  }
};

export const loadPeople = async (): Promise<Person[]> => {
  try {
    const data = await AsyncStorage.getItem(PEOPLE_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('データ読み込みエラー:', error);
    return [];
  }
};
