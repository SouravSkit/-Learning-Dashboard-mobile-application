import type { Course } from '../models/Course';

/// Returns a copy of the course with the given lesson's completion flipped.
/// A lesson id that does not exist leaves the course untouched, and
/// `courseProgress()` is recomputed automatically from the lessons —
/// the shared store is never mutated, unlike the Swift value type version.
export function toggleLesson(course: Course, lessonId: number): Course {
  if (!course.lessons.some((lesson) => lesson.id === lessonId)) {
    return course;
  }
  return {
    ...course,
    lessons: course.lessons.map((lesson) =>
      lesson.id === lessonId ? { ...lesson, isCompleted: !lesson.isCompleted } : lesson,
    ),
  };
}
