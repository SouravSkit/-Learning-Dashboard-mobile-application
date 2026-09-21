import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { ProfileHeader } from '../../components/ProfileHeader';
import { LoadingState } from '../../components/LoadingState';
import { Colors, Spacing, BorderRadius, FontSize } from '../../constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile, loading, updating, updateProfile, updateAvatar } =
    useProfile(user?.id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    gender: '',
    location: '',
    profession: '',
  });

  const handleEditPress = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        gender: profile.gender || '',
        location: profile.location || '',
        profession: profile.profession || '',
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to change your profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        await updateAvatar(blob);
        Alert.alert('Success', 'Profile picture updated');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload profile picture');
      }
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            router.replace('/auth/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to sign out');
          }
        },
      },
    ]);
  };

  if (loading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  if (isEditing) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Picture */}
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleImagePicker}
          >
            {profile.avatar_url ? (
              <View style={styles.imageWrapper}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.imageWrapper}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Text style={styles.cameraText}>📷</Text>
            </View>
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={formData.full_name}
                onChangeText={(text) =>
                  setFormData({ ...formData, full_name: text })
                }
                placeholder="Enter your name"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={(text) =>
                  setFormData({ ...formData, username: text })
                }
                placeholder="Enter username"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                value={formData.gender}
                onChangeText={(text) =>
                  setFormData({ ...formData, gender: text })
                }
                placeholder="Enter gender"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                placeholder="Enter location"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Profession</Text>
              <TextInput
                style={styles.input}
                value={formData.profession}
                onChangeText={(text) =>
                  setFormData({ ...formData, profession: text })
                }
                placeholder="Enter profession"
                placeholderTextColor={Colors.textLight}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={formData.bio}
                onChangeText={(text) =>
                  setFormData({ ...formData, bio: text })
                }
                placeholder="Tell us about yourself..."
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {formData.bio.length} words
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, updating && styles.disabledButton]}
              onPress={handleSave}
              disabled={updating}
            >
              <Text style={styles.saveText}>
                {updating ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader
          profile={profile}
          isOwnProfile={true}
          onEditPress={handleEditPress}
          onSignOut={handleSignOut}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: FontSize.lg,
    color: Colors.error,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    position: 'relative',
  },
  imageWrapper: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.large,
    fontWeight: '700',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    padding: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  cameraText: {
    fontSize: 16,
  },
  formSection: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
  },
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  bioInput: {
    minHeight: 100,
    paddingTop: Spacing.md,
  },
  charCount: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xxl,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textOnPrimary,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
