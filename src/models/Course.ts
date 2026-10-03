/// A single lesson inside a course.
export interface Lesson {
  id: number;
  title: string;
  isCompleted: boolean;
}

/// A course offered in the app.
///
/// `progress` is always derived from the lessons so it can never
/// get out of sync when a lesson is marked as completed.
export interface Course {
  id: number;
  title: string;
  instructor: string;
  lessons: Lesson[];
}

/// completed lessons / total lessons * 100
export function courseProgress(course: Course): number {
  if (course.lessons.length === 0) {
    return 0;
  }
  const completed = course.lessons.filter((lesson) => lesson.isCompleted).length;
  return Math.floor((completed * 100) / course.lessons.length);
}
