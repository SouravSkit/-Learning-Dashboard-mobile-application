import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCourses } from '@/context/CoursesContext';
import { courseProgress, type Lesson } from '@/models/Course';
import { toggleLesson } from '@/viewModels/CourseDetailsViewModel';

export default function CourseDetailsScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { courses, updateCourse } = useCourses();
  const navigation = useNavigation();

  const course = courses.find((item) => item.id === Number(courseId));

  useEffect(() => {
    navigation.setOptions({ title: course?.title ?? 'Course' });
  }, [navigation, course?.title]);

  if (!course) {
    // Deep link or refresh without loaded data — go back to the dashboard.
    return <Redirect href="/dashboard" />;
  }

  const progress = courseProgress(course);
  const fillWidth = { width: `${progress}%` } as const;

  const handleToggle = (lesson: Lesson) => {
    // `progress` is recomputed from the lessons, and the shared store
    // is updated so the dashboard shows the new value immediately.
    updateCourse(toggleLesson(course, lesson.id));
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.summary}>
        <Text style={styles.instructor}>{course.instructor}</Text>
        <Text style={styles.progressTitle}>Progress: {progress}%</Text>
        <View style={styles.track}>
          <View style={[styles.fill, fillWidth]} />
        </View>
      </View>

      <Text style={styles.sectionHeader}>Lessons</Text>

      {course.lessons.map((lesson) => (
        <Pressable
          key={lesson.id}
          onPress={() => handleToggle(lesson)}
          style={({ pressed }) => [styles.lessonRow, pressed && styles.lessonPressed]}
        >
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <View style={styles.lessonStatus}>
            <Ionicons
              name={lesson.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={lesson.isCompleted ? '#34C759' : '#8E8E93'}
            />
            <Text style={styles.statusText}>{lesson.isCompleted ? 'Completed' : 'Pending'}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
  },
  summary: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  instructor: {
    fontSize: 15,
    color: '#6D6D70',
  },
  progressTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#007AFF',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6D6D70',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  lessonPressed: {
    backgroundColor: '#F2F2F7',
  },
  lessonTitle: {
    fontSize: 16,
    flexShrink: 1,
  },
  lessonStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#6D6D70',
  },
});
