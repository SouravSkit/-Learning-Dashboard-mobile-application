import { courseProgress, type Course } from '@/models/Course';
import { toggleLesson } from '@/viewModels/CourseDetailsViewModel';

describe('Course', () => {
  /// Progress must be (completed / total) * 100, not a stored value.
  test('progress is completed over total lessons', () => {
    const course: Course = {
      id: 1,
      title: 'Test Course',
      instructor: 'Tester',
      lessons: [
        { id: 1, title: 'L1', isCompleted: true },
        { id: 2, title: 'L2', isCompleted: true },
        { id: 3, title: 'L3', isCompleted: false },
        { id: 4, title: 'L4', isCompleted: false },
      ],
    };

    expect(courseProgress(course)).toBe(50);
  });

  /// Marking the pending lesson complete must recalculate progress to 100%.
  test('completing last pending lesson updates progress', () => {
    const course: Course = {
      id: 1,
      title: 'Test Course',
      instructor: 'Tester',
      lessons: [
        { id: 1, title: 'L1', isCompleted: true },
        { id: 2, title: 'L2', isCompleted: false },
      ],
    };
    expect(courseProgress(course)).toBe(50);

    const updated = toggleLesson(course, 2);

    expect(updated.lessons[1].isCompleted).toBe(true);
    expect(courseProgress(updated)).toBe(100);
    // The original course is untouched — React state must never be mutated.
    expect(course.lessons[1].isCompleted).toBe(false);
  });

  /// A course without lessons must not divide by zero.
  test('empty course has zero progress', () => {
    const course: Course = { id: 9, title: 'Empty', instructor: '—', lessons: [] };
    expect(courseProgress(course)).toBe(0);
  });
});
