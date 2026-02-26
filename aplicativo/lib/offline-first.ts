import AsyncStorage from '@react-native-async-storage/async-storage';

export type ServiceStatus = 'pending' | 'confirmed' | 'completed' | 'refused';

export type Service = {
  id: number;
  date: string;
  time: string;
  clientName: string;
  address: string;
  city: string;
  price: number;
  serviceType: string;
  status: ServiceStatus;
  observations?: string;
};

export type Profile = {
  name: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
};

export type Session = {
  email: string;
  loggedInAt: string;
};

type UpdateServiceStatusAction = {
  type: 'update_service_status';
  payload: {
    serviceId: number;
    status: ServiceStatus;
    updatedAt: string;
  };
  enqueuedAt: string;
};

type UpdateProfileAction = {
  type: 'update_profile';
  payload: {
    profile: Profile;
    updatedAt: string;
  };
  enqueuedAt: string;
};

export type SyncAction = UpdateServiceStatusAction | UpdateProfileAction;

export type AppState = {
  services: Service[];
  profile: Profile;
};

const APP_STATE_KEY = '@faxinet/app_state_v1';
const SYNC_QUEUE_KEY = '@faxinet/sync_queue_v1';
const SESSION_KEY = '@faxinet/session_v1';

const defaultServices: Service[] = [
  {
    id: 1,
    date: '15/02/2025',
    time: '09:00',
    clientName: 'Maria Silva',
    address: 'Rua das Flores, 123, Apto 45',
    city: 'Centro - São Paulo/SP',
    price: 150.0,
    serviceType: 'Limpeza Completa',
    status: 'pending',
    observations: 'Possui 2 cachorros',
  },
  {
    id: 2,
    date: '15/02/2025',
    time: '14:00',
    clientName: 'João Santos',
    address: 'Av. Paulista, 1000, Apto 12',
    city: 'Bela Vista - São Paulo/SP',
    price: 120.0,
    serviceType: 'Limpeza Padrão',
    status: 'confirmed',
    observations: 'Trazer produtos próprios',
  },
  {
    id: 3,
    date: '16/02/2025',
    time: '10:00',
    clientName: 'Ana Oliveira',
    address: 'Rua Augusta, 500, Casa 2',
    city: 'Consolação - São Paulo/SP',
    price: 180.0,
    serviceType: 'Limpeza Pós-Obra',
    status: 'completed',
    observations: 'Chave na portaria',
  },
  {
    id: 4,
    date: '12/02/2025',
    time: '08:30',
    clientName: 'Carlos Oliveira',
    address: 'Av. Brasil, 500',
    city: 'Jardins - São Paulo/SP',
    price: 180.0,
    serviceType: 'Limpeza Pós-Obra',
    status: 'completed',
  },
  {
    id: 5,
    date: '08/02/2025',
    time: '09:00',
    clientName: 'Fernanda Lima',
    address: 'Rua Augusta, 1200',
    city: 'Consolação - São Paulo/SP',
    price: 150.0,
    serviceType: 'Limpeza Completa',
    status: 'completed',
  },
];

const defaultProfile: Profile = {
  name: 'João Silva',
  fullName: 'João Silva Santos',
  phone: '(61) 98524-612',
  email: 'joao.silva@email.com',
  address: 'Brasília, DF',
};

const defaultState: AppState = {
  services: defaultServices,
  profile: defaultProfile,
};

async function readJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getAppState(): Promise<AppState> {
  const state = await readJson<AppState>(APP_STATE_KEY);
  if (state) return state;

  await writeJson(APP_STATE_KEY, defaultState);
  return defaultState;
}

export async function saveAppState(state: AppState): Promise<void> {
  await writeJson(APP_STATE_KEY, state);
}

export async function getSyncQueue(): Promise<SyncAction[]> {
  const queue = await readJson<SyncAction[]>(SYNC_QUEUE_KEY);
  return queue ?? [];
}

async function setSyncQueue(queue: SyncAction[]): Promise<void> {
  await writeJson(SYNC_QUEUE_KEY, queue);
}

export async function enqueueSyncAction(action: SyncAction): Promise<void> {
  const queue = await getSyncQueue();
  queue.push(action);
  await setSyncQueue(queue);
}

export async function updateServiceStatus(
  serviceId: number,
  status: ServiceStatus
): Promise<Service[] | null> {
  const state = await getAppState();
  const serviceExists = state.services.some((service) => service.id === serviceId);
  if (!serviceExists) return null;

  const updatedServices = state.services.map((service) =>
    service.id === serviceId ? { ...service, status } : service
  );

  await saveAppState({ ...state, services: updatedServices });
  await enqueueSyncAction({
    type: 'update_service_status',
    payload: {
      serviceId,
      status,
      updatedAt: new Date().toISOString(),
    },
    enqueuedAt: new Date().toISOString(),
  });

  return updatedServices;
}

export async function updateProfile(profile: Profile): Promise<Profile> {
  const state = await getAppState();
  await saveAppState({ ...state, profile });

  await enqueueSyncAction({
    type: 'update_profile',
    payload: {
      profile,
      updatedAt: new Date().toISOString(),
    },
    enqueuedAt: new Date().toISOString(),
  });

  return profile;
}

export async function getSession(): Promise<Session | null> {
  return readJson<Session>(SESSION_KEY);
}

export async function saveSession(session: Session): Promise<void> {
  await writeJson(SESSION_KEY, session);
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function flushSyncQueue(baseUrl: string): Promise<{
  synced: number;
  remaining: number;
}> {
  const queue = await getSyncQueue();
  if (!queue.length) return { synced: 0, remaining: 0 };
  if (!baseUrl) return { synced: 0, remaining: queue.length };

  const pending: SyncAction[] = [];
  let synced = 0;

  for (const action of queue) {
    try {
      const ok = await syncAction(baseUrl, action);
      if (ok) {
        synced += 1;
      } else {
        pending.push(action);
      }
    } catch {
      pending.push(action);
    }
  }

  await setSyncQueue(pending);
  return { synced, remaining: pending.length };
}

async function syncAction(baseUrl: string, action: SyncAction): Promise<boolean> {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');

  if (action.type === 'update_service_status') {
    const response = await fetch(
      `${normalizedBaseUrl}/services/${action.payload.serviceId}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action.payload.status,
          updatedAt: action.payload.updatedAt,
        }),
      }
    );
    return response.ok;
  }

  if (action.type === 'update_profile') {
    const response = await fetch(`${normalizedBaseUrl}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...action.payload.profile,
        updatedAt: action.payload.updatedAt,
      }),
    });
    return response.ok;
  }

  return false;
}
