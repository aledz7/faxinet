import { type ReactNode, useEffect } from 'react';
import { AppState } from 'react-native';
import { flushSyncQueue } from '@/lib/offline-first';

const SYNC_INTERVAL_MS = 15000;


export function OfflineSyncProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
    if (!baseUrl) return;

    let running = false;

    const sync = async () => {
      if (running) return;
      running = true;

      try {
        await flushSyncQueue(baseUrl);
      } finally {
        running = false;
      }
    };

    void sync();
    const intervalId = setInterval(() => {
      void sync();
    }, SYNC_INTERVAL_MS);

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void sync();
      }
    });

    return () => {
      clearInterval(intervalId);
      appStateSubscription.remove();
    };
  }, []);

  return <>{children}</>;
}
