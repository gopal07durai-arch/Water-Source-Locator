// app/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Function to schedule a local notification
export async function scheduleAlertNotification(title: string, body: string) {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alerts', {
      name: 'Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // null = send immediately
  });
}
