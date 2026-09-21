import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNews } from '../../hooks/useNews';
import { NewsCard } from '../../components/NewsCard';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { Colors } from '../../constants/colors';
import { News } from '../../types/database';

export default function NewsFeedScreen() {
  const router = useRouter();
  const { news, loading, error, refreshing, loadMore, refresh, hasMore } =
    useNews();

  const handleCommentPress = useCallback(
    (newsId: string) => {
      router.push(`/comments/${newsId}`);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: News & { comment_count: number }; index: number }) => (
      <NewsCard
        news={item}
        commentCount={item.comment_count}
        onCommentPress={() => handleCommentPress(item.id)}
        isVisible={true}
      />
    ),
    [handleCommentPress]
  );

  const keyExtractor = useCallback((item: News) => item.id, []);

  const renderFooter = () => {
    if (!hasMore || loading) return null;
    return <View style={styles.footer} />;
  };

  if (loading && news.length === 0) {
    return <LoadingState message="Loading news..." />;
  }

  if (error && news.length === 0) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Error Loading News"
        message={error}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="No News Available"
              message="Check back later for updates"
            />
          ) : null
        }
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
  },
  footer: {
    height: 20,
  },
});
