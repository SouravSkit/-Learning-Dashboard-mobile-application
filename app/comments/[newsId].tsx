import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useComments } from '../../hooks/useComments';
import { CommentItem } from '../../components/CommentItem';
import { CommentInput } from '../../components/CommentInput';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { Colors } from '../../constants/colors';

export default function CommentsScreen() {
  const { newsId } = useLocalSearchParams<{ newsId: string }>();
  const { user } = useAuth();
  const {
    comments,
    loading,
    error,
    submitting,
    addComment,
    editComment,
    removeComment,
  } = useComments(newsId);

  const handleSubmitComment = async (content: string) => {
    if (!user) {
      throw new Error('Please login to comment');
    }
    await addComment(content);
  };

  const renderItem = ({ item }: { item: any }) => (
    <CommentItem
      comment={item}
      currentUserId={user?.id}
      onEdit={editComment}
      onDelete={removeComment}
    />
  );

  const keyExtractor = (item: any) => item.id;

  if (loading) {
    return <LoadingState message="Loading comments..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="chatbubbles-outline"
              title="No Comments Yet"
              message="Be the first to comment!"
            />
          ) : null
        }
      />

      {/* Comment Input */}
      {user ? (
        <CommentInput onSubmit={handleSubmitComment} loading={submitting} />
      ) : (
        <View style={styles.loginPrompt}>
          <EmptyState
            icon="log-in-outline"
            title="Login Required"
            message="Please login to leave a comment"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    flexGrow: 1,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
  },
});
