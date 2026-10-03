import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { CourseRow } from '@/components/CourseRow';
import { useCourses } from '@/context/CoursesContext';
import type { Course } from '@/models/Course';

export default function DashboardScreen() {
  const { state, courses, isShowingSavedData, isRefreshing, load, loadIfNeeded } = useCourses();

  useEffect(() => {
    void loadIfNeeded();
  }, [loadIfNeeded]);

  const handleRefresh = useCallback(() => {
    void load('refresh');
  }, [load]);

  const openCourse = useCallback((course: Course) => {
    router.push({
      pathname: '/course-details',
      params: { courseId: String(course.id) },
    });
  }, []);

  if (state.status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading courses…</Text>
      </View>
    );
  }

  if (state.status === 'failed') {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{state.message}</Text>
        <Pressable onPress={() => void load('initial')} style={styles.retryButton}>
          <Text style={styles.retryLabel}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (state.status === 'empty') {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No courses available</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={courses}
      keyExtractor={(course) => String(course.id)}
      renderItem={({ item }) => <CourseRow course={item} onPress={() => openCourse(item)} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        isShowingSavedData ? (
          <Text style={styles.offlineBanner}>Offline — showing saved courses</Text>
        ) : null
      }
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 15,
    color: '#6D6D70',
  },
  error: {
    color: '#FF3B30',
    fontSize: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryLabel: {
    fontSize: 17,
    color: '#007AFF',
  },
  empty: {
    fontSize: 15,
    color: '#6D6D70',
  },
  listContent: {
    backgroundColor: '#FFFFFF',
  },
  offlineBanner: {
    fontSize: 13,
    color: '#6D6D70',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6CC',
    marginLeft: 16,
  },
});
