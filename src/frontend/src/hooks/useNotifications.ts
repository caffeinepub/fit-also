import { useEffect, useState, useCallback } from 'react';
import { useGetNotifications } from './useQueries';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

const LAST_SEEN_KEY = 'fitAlso_lastSeenNotification';

function getLastSeenTimestamp(): bigint {
  try {
    const stored = localStorage.getItem(LAST_SEEN_KEY);
    if (stored) return BigInt(stored);
  } catch {}
  return BigInt(0);
}

function saveLastSeenTimestamp(timestamp: bigint) {
  try {
    localStorage.setItem(LAST_SEEN_KEY, timestamp.toString());
  } catch {}
}

export function useNotifications() {
  const [lastSeen, setLastSeen] = useState<bigint>(getLastSeenTimestamp);
  const { data: notifications = [] } = useGetNotifications(lastSeen);
  const navigate = useNavigate();

  const handleNotificationClick = useCallback((notificationTitle: string) => {
    // Redirect based on notification title/content
    const lower = notificationTitle.toLowerCase();
    if (lower.includes('product') || lower.includes('catalog')) {
      navigate({ to: '/catalog' });
    } else if (lower.includes('order')) {
      navigate({ to: '/dashboard/customer' });
    } else if (lower.includes('tailor')) {
      navigate({ to: '/tailors' });
    }
  }, [navigate]);

  useEffect(() => {
    if (notifications.length > 0) {
      // Show toast for each new notification
      notifications.forEach(notification => {
        toast(notification.title, {
          description: notification.body,
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => handleNotificationClick(notification.title),
          },
        });
      });

      // Update last seen timestamp to the latest notification
      const latestTimestamp = notifications.reduce((max, n) => 
        n.timestamp > max ? n.timestamp : max, 
        lastSeen
      );
      
      setLastSeen(latestTimestamp);
      saveLastSeenTimestamp(latestTimestamp);
    }
  }, [notifications, handleNotificationClick, lastSeen]);

  return {
    notifications,
    lastSeen,
  };
}
