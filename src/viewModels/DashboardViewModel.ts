import { useCallback, useRef, useState } from 'react';
import type { Course } from '../models/Course';
import { CourseRepository } from '../repository/CourseRepository';

export type DashboardState =
  | { status: 'loading' }
  | { status: 'loaded' }
  | { status: 'empty' }
  | { status: 'failed'; message: string };

/// Dashboard state: initial load / retry / pull-to-refresh, the offline
/// banner, and updating a course after a lesson is toggled.
///
/// A single instance lives in CoursesContext so the dashboard and the
/// details screen always share the same list (the Swift app kept this
/// view model on the dashboard and passed an `onUpdate` closure down).
export function useDashboardViewModel() {
  const [state, setState] = useState<DashboardState>({ status: 'loading' });
  const [courses, setCourses] = useState<Course[]>([]);
  const [isShowingSavedData, setIsShowingSavedData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const coursesRef = useRef<Course[]>([]);
  const hasLoadedRef = useRef(false);

  /// Initial load / retry (`mode: 'initial'` shows the full-screen spinner)
  /// or pull-to-refresh (`mode: 'refresh'` keeps the list visible).
  const load = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'initial') {
      setState({ status: 'loading' });
    } else {
      setIsRefreshing(true);
    }
    try {
      const { courses: fetched, isFromCache } = await CourseRepository.fetchCourses();
      coursesRef.current = fetched;
      setCourses(fetched);
      setIsShowingSavedData(isFromCache);
      setState(fetched.length === 0 ? { status: 'empty' } : { status: 'loaded' });
      hasLoadedRef.current = true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load course data';
      setState({ status: 'failed', message });
    } finally {
      if (mode === 'refresh') {
        setIsRefreshing(false);
      }
    }
  }, []);

  /// Loads once, then keeps the in-memory list (e.g. when returning
  /// from the details screen).
  const loadIfNeeded = useCallback(async () => {
    if (hasLoadedRef.current) {
      return;
    }
    await load('initial');
  }, [load]);

  /// Called by the details screen after a lesson is toggled,
  /// so the dashboard shows the updated progress and caches it.
  const updateCourse = useCallback((updated: Course) => {
    const current = coursesRef.current;
    if (!current.some((course) => course.id === updated.id)) {
      return;
    }
    const next = current.map((course) => (course.id === updated.id ? updated : course));
    coursesRef.current = next;
    setCourses(next);
    void CourseRepository.save(next);
  }, []);

  return { state, courses, isShowingSavedData, isRefreshing, load, loadIfNeeded, updateCourse };
}

export type DashboardViewModel = ReturnType<typeof useDashboardViewModel>;
