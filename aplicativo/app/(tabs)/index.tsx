import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ThemeToggle } from '@/components/ThemeToggle';
import { type Service, type ServiceStatus, getAppState } from '@/lib/offline-first';

type StatusDisplay = {
  label: string;
  border: string;
  badgeBg: string;
  badgeText: string;
};

const WEEK_DAYS = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'];

const STATUS_DISPLAY: Record<ServiceStatus, StatusDisplay> = {
  pending: {
    label: 'AGENDADO',
    border: 'border-l-blue-500',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
  },
  confirmed: {
    label: 'CONFIRMADO',
    border: 'border-l-emerald-500',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
  },
  completed: {
    label: 'FINALIZADO',
    border: 'border-l-green-600',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
  },
  refused: {
    label: 'RECUSADO',
    border: 'border-l-gray-400',
    badgeBg: 'bg-gray-200',
    badgeText: 'text-gray-600',
  },
};

function parseDate(date: string): Date {
  const [day, month, year] = date.split('/').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function toMinutes(time: string): number {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function getDurationByType(serviceType: string): number {
  const normalized = serviceType.toLowerCase();
  if (normalized.includes('pós-obra')) return 8;
  if (normalized.includes('completa')) return 6;
  if (normalized.includes('padrão')) return 4;
  return 6;
}

function formatTimeRange(start: string, serviceType: string): string {
  const startMinutes = toMinutes(start);
  const endMinutes = startMinutes + getDurationByType(serviceType) * 60;
  const endHour = Math.floor((endMinutes % (24 * 60)) / 60);
  const endMinute = endMinutes % 60;
  const startLabel = `${start}`;
  const endLabel = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  return `${startLabel} - ${endLabel}`;
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

export default function AgendaScreen() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);

  const loadAgenda = useCallback(async () => {
    const state = await getAppState();
    setServices(state.services);
  }, []);

  useEffect(() => {
    void loadAgenda();
  }, [loadAgenda]);

  useFocusEffect(
    useCallback(() => {
      void loadAgenda();
    }, [loadAgenda])
  );

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => {
      const dateDiff = parseDate(a.date).getTime() - parseDate(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return toMinutes(a.time) - toMinutes(b.time);
    });
  }, [services]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="bg-primary px-5 pt-4 pb-6">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Agenda</Text>
            <Text className="text-orange-100 text-sm mt-1">
              Visualize sua programação por dia e horário
            </Text>
          </View>
          <ThemeToggle />
        </View>

        <View className="bg-white/20 rounded-xl px-3 py-2 self-start mt-2">
          <Text className="text-white text-sm font-semibold">
            {sortedServices.length} compromisso(s)
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-3 pt-4" contentContainerStyle={{ paddingBottom: 28 }}>
        {sortedServices.map((service) => {
          const parsedDate = parseDate(service.date);
          const dayLabel = WEEK_DAYS[parsedDate.getDay()];
          const dayMonthLabel = `${String(parsedDate.getDate()).padStart(2, '0')}/${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
          const status = STATUS_DISPLAY[service.status];

          return (
            <View key={service.id} className="flex-row mb-3">
              <View className="w-14 items-center pt-1">
                <Text className="text-foreground font-semibold text-xl">{dayLabel}</Text>
                <Text className="text-muted-foreground text-xs">{dayMonthLabel}</Text>
                {isToday(parsedDate) && (
                  <View className="bg-muted mt-1 px-2 py-0.5 rounded-full">
                    <Text className="text-muted-foreground text-[10px] font-semibold">Hoje</Text>
                  </View>
                )}
              </View>

              <Pressable
                onPress={() => router.push('/servico-detalhes')}
                className={`flex-1 bg-card border border-border rounded-xl p-3 border-l-4 ${status.border}`}
              >
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center gap-1">
                    <Clock color="#737373" size={15} />
                    <Text className="text-muted-foreground text-base">
                      {formatTimeRange(service.time, service.serviceType)}
                    </Text>
                  </View>
                  <View className={`${status.badgeBg} px-2.5 py-1 rounded-full`}>
                    <Text className={`${status.badgeText} text-xs font-bold`}>{status.label}</Text>
                  </View>
                </View>

                <Text className="text-foreground text-lg font-medium">
                  {service.clientName} - {service.serviceType}
                </Text>

                <View className="flex-row items-center justify-between mt-1">
                  <View className="flex-row items-center gap-1">
                    <Calendar color="#9E9E9E" size={14} />
                    <Text className="text-muted-foreground text-sm">{service.city}</Text>
                  </View>
                  <ChevronRight color="#A3A3A3" size={18} />
                </View>
              </Pressable>
            </View>
          );
        })}

        {sortedServices.length === 0 && (
          <View className="items-center justify-center py-16">
            <Calendar color="#D1D5DB" size={64} />
            <Text className="text-muted-foreground text-lg mt-4">
              Nenhum compromisso na agenda
            </Text>
            <Text className="text-muted-foreground text-sm">
              Seus próximos horários aparecerão aqui
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}