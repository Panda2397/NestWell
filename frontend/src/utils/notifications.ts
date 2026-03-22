type Nullable<T> = T | null;

let Notifications: any = null;
let Device: any = null;

try {
  Notifications = require('expo-notifications');
  Device = require('expo-device');
} catch (err) {
}

export async function registerPermissions(): Promise<boolean> {
  if (!Device || !Notifications) {
    console.warn('expo-notifications or expo-device not available — notification calls are no-ops');
    return false;
  }

  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  const { status } = existing === 'granted' ? { status: existing } : await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyNotification(hour = 9, minute = 0): Promise<Nullable<string>> {
  if (!Notifications || !Device) {
    console.warn('expo-notifications or expo-device not available — scheduleDailyNotification is a no-op');
    return null;
  }

  const ok = await registerPermissions();
  if (!ok) return null;
  const id = await Notifications.scheduleNotificationAsync({
    content: { title: 'Daily check-in', body: 'How are you feeling today?' },
    trigger: { hour, minute, repeats: true },
  });
  return id;
}

export async function cancelScheduledNotification(id: string): Promise<void> {
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (err) {
  }
}

export default {
  registerPermissions,
  scheduleDailyNotification,
  cancelScheduledNotification,
};
