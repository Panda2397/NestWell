type Nullable<T> = T | null;

import { Platform } from 'react-native';

let Notifications: any = null;
let Device: any = null;
let notificationsAvailable = false;
let warnedMissing = false;

const isWeb = Platform.OS === 'web';

try {
  if (!isWeb) {
    Notifications = require('expo-notifications');
    Device = require('expo-device');
    notificationsAvailable = !!Notifications && !!Device;
  }
} catch (err) {
}

if (notificationsAvailable && typeof Notifications.setNotificationHandler === 'function') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function registerPermissions(): Promise<boolean> {
  if (isWeb) {
    if (typeof Notification === 'undefined') {
      console.warn('Browser Notification API unavailable');
      return false;
    }
    const perm = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
    return perm === 'granted';
  }

  if (!notificationsAvailable) {
    if (!warnedMissing) {
      console.warn('expo-notifications or expo-device not available — notification calls are no-ops');
      warnedMissing = true;
    }
    return false;
  }

  if (!Device?.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  const { status } = existing === 'granted' ? { status: existing } : await Notifications.requestPermissionsAsync();
  return status === 'granted';
}


export async function sendImmediateNotification(): Promise<Nullable<string>> {
  if (isWeb) {
    if (typeof Notification === 'undefined') {
      console.warn('Browser Notification API unavailable — cannot send notification');
      return null;
    }
    const permGranted = await registerPermissions();
    if (!permGranted) return null;
    try {
      // show a browser notification
      // eslint-disable-next-line no-new
      new (window as any).Notification('Daily check-in', { body: 'How are you feeling today?' });
      return 'web-notification';
    } catch (err) {
      console.warn('failed to show browser notification', err);
      return null;
    }
  }

  const ok = await registerPermissions();
  if (!ok) return null;
  return '1';
}

export default {
  registerPermissions,
};

