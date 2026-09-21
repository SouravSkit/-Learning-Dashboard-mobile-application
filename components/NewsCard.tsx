import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoPlayer } from './VideoPlayer';
import { News } from '../types/database';
import { Colors, Spacing, BorderRadius, FontSize } from '../constants/colors';
import { formatRelativeTime } from '../utils/dateUtils';

interface NewsCardProps {
  news: News;
  commentCount: number;
  onCommentPress: () => void;
  isVisible?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  commentCount,
  onCommentPress,
  isVisible = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleShare = async () => {
    try {
      const shareContent = {
        message: `Check out this news:\n\n${news.title}\n\nRead more: ${news.source_url || 'https://example.com/news/' + news.id}`,
        title: news.title,
      };

      if (news.source_url) {
        (shareContent as any).url = news.source_url;
      }

      await Share.share(shareContent);
    } catch (error) {
      Alert.alert('Error', 'Failed to share news');
    }
  };

  const renderMedia = () => {
    if (news.video_url) {
      return (
        <VideoPlayer
          url={news.video_url}
          poster={news.image_url || undefined}
          isVisible={isVisible}
        />
      );
    }

    if (news.image_url && !imageError) {
      return (
        <Image
          source={{ uri: news.image_url }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Media Section */}
      {renderMedia()}

      {/* Content Section */}
      <View style={styles.content}>
        {/* Date and Source */}
        <View style={styles.metaRow}>
          <Text style={styles.date}>
            {formatRelativeTime(news.published_at)}
          </Text>
          {news.source_name && (
            <Text style={styles.source}>{news.source_name}</Text>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {news.title}
        </Text>

        {/* Description */}
        {news.description && (
          <Text style={styles.description} numberOfLines={3}>
            {news.description}
          </Text>
        )}

        {/* Actions Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color={Colors.textSecondary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onCommentPress}
          >
            <Ionicons name="chatbubble-outline" size={22} color={Colors.textSecondary} />
            <Text style={styles.actionText}>
              {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  date: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  source: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: 26,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
