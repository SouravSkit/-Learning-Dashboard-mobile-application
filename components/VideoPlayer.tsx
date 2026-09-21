import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_WIDTH * 0.6;

interface VideoPlayerProps {
  url: string;
  poster?: string;
  isVisible?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  poster,
  isVisible = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const player = useVideoPlayer(url, (player) => {
    player.loop = false;
    player.muted = isMuted;
  });

  useEffect(() => {
    const subscription = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay') {
        // Get duration from player directly
        setDuration(player.duration ?? 0);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  useEffect(() => {
    const timeUpdate = player.addListener('timeUpdate', (status) => {
      setCurrentTime(status.currentTime);
    });

    return () => {
      timeUpdate.remove();
    };
  }, [player]);

  // Pause when not visible
  useEffect(() => {
    if (!isVisible && isPlaying) {
      player.pause();
      setIsPlaying(false);
    }
  }, [isVisible]);

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    player.muted = !player.muted;
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setShowControls(!showControls)}
        style={styles.videoContainer}
      >
        <VideoView
          style={styles.video}
          player={player}
          contentFit="contain"
        />

        {/* Controls Overlay */}
        {showControls && (
          <View style={styles.controlsOverlay}>
            <View style={styles.centerControls}>
              <TouchableOpacity
                onPress={togglePlay}
                style={styles.playButton}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={40}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.bottomControls}>
              <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
                <Ionicons
                  name={isMuted ? 'volume-mute' : 'volume-high'}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>

              <Text style={styles.timeText}>
                {formatTime(currentTime)}/{formatTime(duration)}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  centerControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  muteButton: {
    padding: Spacing.sm,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
