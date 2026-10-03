import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Course } from '../models/Course';

/// Saves/loads the course list as JSON in AsyncStorage.
/// Simple offline cache — no database needed for this app.
const KEY = 'cached_courses';

export async function save(courses: Course[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(courses));
  } catch {
    // Best effort — mirrors Swift's `guard let data = try? JSONEncoder().encode(...)`.
  }
}

export async function load(): Promise<Course[] | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw === null ? null : (JSON.parse(raw) as Course[]);
  } catch {
    return null;
  }
}
