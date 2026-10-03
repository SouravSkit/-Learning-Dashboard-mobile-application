import NetInfo from '@react-native-community/netinfo';

/// Tiny wrapper around NetInfo so the repository can check
/// whether the device is online before hitting the (mock) API.
let isOnline = true;

NetInfo.addEventListener((state) => {
  // `isConnected` is null while the state is unknown — assume online,
  // matching NWPathMonitor's optimistic start value.
  isOnline = state.isConnected !== false;
});

export const NetworkMonitor = {
  get isOnline(): boolean {
    return isOnline;
  },
};
