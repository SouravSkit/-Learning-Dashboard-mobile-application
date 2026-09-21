import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '../types/database';
import { Colors, Spacing, BorderRadius, FontSize } from '../constants/colors';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
  onEditPress?: () => void;
  onSignOut?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile = true,
  onEditPress,
  onSignOut,
}) => {
  return (
    <View style={styles.container}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        {profile.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        )}

        {isOwnProfile && (
          <TouchableOpacity style={styles.cameraButton} onPress={onEditPress}>
            <Ionicons name="camera" size={20} color={Colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Info */}
      <View style={styles.infoSection}>
        <Text style={styles.name}>{profile.full_name || 'No Name'}</Text>

        {profile.username && (
          <Text style={styles.username}>@{profile.username}</Text>
        )}

        {profile.bio && (
          <Text style={styles.bio}>{profile.bio}</Text>
        )}

        {profile.location && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{profile.location}</Text>
          </View>
        )}

        {profile.profession && (
          <View style={styles.infoRow}>
            <Ionicons name="briefcase-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.infoText}>{profile.profession}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {isOwnProfile && (
        <View style={styles.actionsSection}>
          {onEditPress && (
            <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
              <Ionicons name="pencil-outline" size={18} color={Colors.primary} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}

          {onSignOut && (
            <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
              <Ionicons name="log-out-outline" size={18} color={Colors.error} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    paddingBottom: Spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.large,
    fontWeight: '700',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    padding: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  username: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  bio: {
    fontSize: FontSize.md,
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  infoText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.round,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  editButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.round,
    borderWidth: 1.5,
    borderColor: Colors.error,
  },
  signOutText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.error,
  },
});
