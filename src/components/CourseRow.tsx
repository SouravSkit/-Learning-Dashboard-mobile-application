import { Pressable, StyleSheet, Text } from 'react-native';
import { courseProgress, type Course } from '@/models/Course';

/// One course card: name, instructor, progress, lessons, continue button.
export function CourseRow({ course, onPress }: { course: Course; onPress: () => void }) {
  const progress = courseProgress(course);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.instructor}>{course.instructor}</Text>
      <Text style={styles.meta}>Progress: {progress}%</Text>
      <Text style={styles.meta}>Lessons: {course.lessons.length}</Text>
      <Text style={styles.continuePill}>Continue</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  rowPressed: {
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  instructor: {
    fontSize: 15,
    color: '#6D6D70',
  },
  meta: {
    fontSize: 16,
  },
  continuePill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    overflow: 'hidden',
  },
});
