import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Linking, Animated, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, Check, X, ChevronRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react-native';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useRouter } from 'expo-router';

// Mock data for services
const mockServices = [
  {
    id: 1,
    date: '15/02/2025',
    time: '09:00',
    clientName: 'Maria Silva',
    address: 'Rua das Flores, 123, Apto 45',
    city: 'Centro - São Paulo/SP',
    price: 150.00,
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
    price: 120.00,
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
    price: 180.00,
    serviceType: 'Limpeza Pós-Obra',
    status: 'pending',
    observations: 'Chave na portaria',
  },
];

type ServiceStatus = 'pending' | 'confirmed' | 'completed' | 'refused';

const getStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case 'pending':
      return 'border-orange-500';
    case 'confirmed':
      return 'border-green-500';
    case 'completed':
      return 'border-gray-300';
    case 'refused':
      return 'border-gray-400';
    default:
      return 'border-gray-300';
  }
};

const getStatusBadge = (status: ServiceStatus) => {
  switch (status) {
    case 'pending':
      return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'NOVO' };
    case 'confirmed':
      return { bg: 'bg-green-100', text: 'text-green-700', label: 'CONFIRMADO' };
    case 'completed':
      return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'CONCLUÍDO' };
    case 'refused':
      return { bg: 'bg-gray-100', text: 'text-gray-500', label: 'RECUSADO' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600', label: '' };
  }
};

type ConfirmModalData = {
  visible: boolean;
  type: 'accept' | 'refuse';
  serviceId: number | null;
  serviceName: string;
};

type ToastData = {
  visible: boolean;
  type: 'success' | 'refused';
  message: string;
};

const fixedFull = Platform.OS === 'web'
  ? { position: 'fixed' as any, top: 0, left: 0, right: 0, bottom: 0 }
  : { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

function ConfirmModal({
  data,
  onConfirm,
  onCancel,
}: {
  data: ConfirmModalData;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (data.visible) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.85);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [data.visible]);

  if (!data.visible) return null;

  const isAccept = data.type === 'accept';

  return (
    <View style={[fixedFull, { zIndex: 9999, justifyContent: 'center', alignItems: 'center' }]}>
      {/* Backdrop semi-transparente */}
      <View
        style={[
          fixedFull,
          { backgroundColor: 'rgba(0,0,0,0.4)' },
        ]}
      />
      {/* Backdrop pressável transparente */}
      <Pressable
        style={[fixedFull, { zIndex: 1 }]}
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel="Fechar modal"
      />

      {/* Card do modal */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          backgroundColor: '#fff',
          borderRadius: 24,
          padding: 28,
          width: '85%',
          maxWidth: 360,
          zIndex: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.3,
          shadowRadius: 24,
          elevation: 20,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: isAccept ? '#dcfce7' : '#fee2e2',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isAccept ? (
              <CheckCircle color="#16a34a" size={40} />
            ) : (
              <AlertTriangle color="#dc2626" size={40} />
            )}
          </View>
        </View>

        <Text style={{ fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 8, color: '#1c1917' }}>
          {isAccept ? 'Confirmar Serviço' : 'Recusar Serviço'}
        </Text>
        <Text style={{ fontSize: 15, textAlign: 'center', color: '#78716c', marginBottom: 4, lineHeight: 22 }}>
          {isAccept
            ? 'Deseja aceitar o serviço de'
            : 'Tem certeza que deseja recusar o serviço de'}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 24, color: '#1c1917' }}>
          {data.serviceName}?
        </Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
            style={{
              flex: 1,
              backgroundColor: '#f3f4f6',
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#4b5563', fontWeight: '600', fontSize: 15 }}>Cancelar</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel={isAccept ? 'Confirmar aceitar' : 'Confirmar recusar'}
            style={{
              flex: 1,
              backgroundColor: isAccept ? '#16a34a' : '#ef4444',
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>
              {isAccept ? 'Aceitar' : 'Recusar'}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

function Toast({ data, onHide }: { data: ToastData; onHide: () => void }) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (data.visible) {
      slideAnim.setValue(-100);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 80, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => onHide());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [data.visible]);

  if (!data.visible) return null;

  const isSuccess = data.type === 'success';

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        zIndex: 10000,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderRadius: 16,
          backgroundColor: isSuccess ? '#16a34a' : '#52525b',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        {isSuccess ? (
          <CheckCircle color="white" size={22} />
        ) : (
          <XCircle color="white" size={22} />
        )}
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15, flex: 1 }}>{data.message}</Text>
      </View>
    </Animated.View>
  );
}

export default function AgendaScreen() {
  const router = useRouter();
  const [services, setServices] = useState(mockServices);
  const newAppointments = services.filter(s => s.status === 'pending').length;

  const [confirmModal, setConfirmModal] = useState<ConfirmModalData>({
    visible: false,
    type: 'accept',
    serviceId: null,
    serviceName: '',
  });

  const [toast, setToast] = useState<ToastData>({
    visible: false,
    type: 'success',
    message: '',
  });

  const showToast = (type: 'success' | 'refused', message: string) => {
    setToast({ visible: true, type, message });
  };

  const handleAccept = (id: number) => {
    const service = services.find(s => s.id === id);
    if (!service) return;
    setConfirmModal({
      visible: true,
      type: 'accept',
      serviceId: id,
      serviceName: service.clientName,
    });
  };

  const handleRefuse = (id: number) => {
    const service = services.find(s => s.id === id);
    if (!service) return;
    setConfirmModal({
      visible: true,
      type: 'refuse',
      serviceId: id,
      serviceName: service.clientName,
    });
  };

  const handleConfirmAction = () => {
    const { type, serviceId } = confirmModal;
    if (serviceId === null) return;

    const newStatus = type === 'accept' ? 'confirmed' : 'refused';
    setServices(prev =>
      prev.map(service =>
        service.id === serviceId ? { ...service, status: newStatus } : service
      )
    );

    setConfirmModal({ visible: false, type: 'accept', serviceId: null, serviceName: '' });

    if (type === 'accept') {
      showToast('success', 'Serviço confirmado com sucesso!');
    } else {
      showToast('refused', 'Serviço recusado.');
    }
  };

  const handleCancelAction = () => {
    setConfirmModal({ visible: false, type: 'accept', serviceId: null, serviceName: '' });
  };

  const handleViewMap = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const navigateToDetails = (service: any) => {
    router.push('/servico-detalhes');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Toast data={toast} onHide={() => setToast(prev => ({ ...prev, visible: false }))} />
      <ConfirmModal
        data={confirmModal}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />

      {/* Header */}
      <View className="bg-primary px-5 pt-4 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Minha Agenda</Text>
            <Text className="text-orange-100 text-sm mt-1">
              {services.length} serviços agendados
            </Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Stats Cards */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <View className="flex-row items-center gap-2">
              <View className="bg-orange-700 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-bold">{newAppointments}</Text>
              </View>
              <Text className="text-white text-sm font-medium">Novos</Text>
            </View>
          </View>
          <View className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <View className="flex-row items-center gap-2">
              <View className="bg-green-600 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-bold">
                  {services.filter(s => s.status === 'confirmed').length}
                </Text>
              </View>
              <Text className="text-white text-sm font-medium">Confirmados</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Services List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text className="text-foreground font-semibold text-lg mb-3">
          Próximos Serviços
        </Text>

        {services.map((service) => {
          const statusBadge = getStatusBadge(service.status);
          const isPending = service.status === 'pending';
          const isCompleted = service.status === 'completed';
          const isRefused = service.status === 'refused';

          return (
            <Pressable
              key={service.id}
              onPress={() => {
                if (!isPending) {
                  navigateToDetails(service);
                }
              }}
              className={`bg-card rounded-2xl p-4 mb-4 border-2 ${getStatusColor(service.status)} ${isCompleted ? 'opacity-60' : ''
                } ${isRefused ? 'opacity-50' : ''}`}
            >
              {/* Header with date and status */}
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center gap-2">
                  <Calendar color="#FF6B1A" size={20} />
                  <View>
                    <Text className="text-foreground font-semibold">
                      {service.date}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Clock color="#9E9E9E" size={14} />
                      <Text className="text-muted-foreground text-sm">
                        {service.time}h
                      </Text>
                    </View>
                  </View>
                </View>
                {statusBadge.label && (
                  <View
                    className={`${statusBadge.bg} ${statusBadge.text} px-3 py-1 rounded-full`}
                  >
                    <Text className="text-xs font-bold">{statusBadge.label}</Text>
                  </View>
                )}
              </View>

              {/* Client Info */}
              <View className="space-y-2 mb-3">
                <View className="flex-row items-start gap-2">
                  <Text className="text-lg">👤</Text>
                  <Text className={`text-foreground font-medium ${isRefused ? 'line-through' : ''}`}>
                    {service.clientName}
                  </Text>
                </View>

                <View className="flex-row items-start gap-2">
                  <MapPin color="#FF6B1A" size={18} />
                  <View className="flex-1">
                    <Text className={`text-foreground font-medium ${isRefused ? 'line-through' : ''}`}>
                      {service.address}
                    </Text>
                    <Text className="text-muted-foreground text-xs">
                      {service.city}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View className="h-px bg-gray-200 my-3" />

              {/* Price and Actions */}
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-muted-foreground text-xs">Valor a Receber</Text>
                  <Text className="text-green-600 text-xl font-bold">
                    R$ {service.price.toFixed(2)}
                  </Text>
                </View>

                {isPending && (
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => handleRefuse(service.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Recusar ${service.clientName}`}
                      className="bg-gray-200 px-4 py-2 rounded-xl flex-row items-center gap-1"
                    >
                      <X color="#757575" size={18} />
                      <Text className="text-gray-700 font-semibold text-sm">Recusar</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleAccept(service.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Aceitar ${service.clientName}`}
                      className="bg-green-600 px-4 py-2 rounded-xl flex-row items-center gap-1"
                    >
                      <Check color="white" size={18} />
                      <Text className="text-white font-semibold text-sm">Aceitar</Text>
                    </Pressable>
                  </View>
                )}

                {service.status === 'confirmed' && (
                  <Pressable
                    onPress={() => navigateToDetails(service)}
                    className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-1"
                  >
                    <Text className="text-white font-semibold text-sm">Ver Detalhes</Text>
                    <ChevronRight color="white" size={18} />
                  </Pressable>
                )}

                {isCompleted && (
                  <View className="bg-green-100 px-3 py-2 rounded-xl flex-row items-center gap-1">
                    <Check color="#7CB342" size={18} />
                    <Text className="text-green-700 font-semibold text-sm">Concluído</Text>
                  </View>
                )}

                {isRefused && (
                  <View className="bg-gray-200 px-3 py-2 rounded-xl flex-row items-center gap-1">
                    <X color="#9E9E9E" size={18} />
                    <Text className="text-gray-500 font-semibold text-sm">Recusado</Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}

        {services.length === 0 && (
          <View className="items-center justify-center py-16">
            <Calendar color="#D1D5DB" size={64} />
            <Text className="text-muted-foreground text-lg mt-4">
              Nenhum serviço agendado
            </Text>
            <Text className="text-muted-foreground text-sm">
              Novos serviços aparecerão aqui
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}