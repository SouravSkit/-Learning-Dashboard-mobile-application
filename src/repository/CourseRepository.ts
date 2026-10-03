import type { Course } from '../models/Course';
import { CourseError, MockCourseAPI } from './MockCourseAPI';
import { NetworkMonitor } from './NetworkMonitor';
import * as CourseStorage from './CourseStorage';

/// Single source of course data for the app.
///
/// Flow: offline? → cached courses. Online? → mock API, then cache
/// the result so it is available the next time the device is offline.
const api = new MockCourseAPI();

/// Returns the courses plus a flag telling whether they came from the local cache.
async function fetchCourses(): Promise<{ courses: Course[]; isFromCache: boolean }> {
  if (!NetworkMonitor.isOnline) {
    const cached = await CourseStorage.load();
    if (!cached) {
      throw new CourseError('offlineNoCache');
    }
    return { courses: cached, isFromCache: true };
  }

  try {
    const courses = await api.fetchCourses();
    await CourseStorage.save(courses);
    return { courses, isFromCache: false };
  } catch (error) {
    // Network failed → fall back to whatever we cached before.
    const cached = await CourseStorage.load();
    if (!cached) {
      throw error;
    }
    return { courses: cached, isFromCache: true };
  }
}

/// Persists the latest course list (e.g. after a lesson is completed).
async function save(courses: Course[]): Promise<void> {
  await CourseStorage.save(courses);
}

export const CourseRepository = { fetchCourses, save };
