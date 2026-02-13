import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, Phone, Check, X, ChevronRight } from 'lucide-react-native';
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
    phone: '(11) 98765-4321',
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
    phone: '(11) 91234-5678',
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
    phone: '(11) 99876-5432',
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

export default function AgendaScreen() {
  const router = useRouter();
  const [services, setServices] = useState(mockServices);
  const newAppointments = services.filter(s => s.status === 'pending').length;

  const handleAccept = (id: number) => {
    Alert.alert(
      'Confirmar Serviço',
      'Deseja aceitar este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceitar',
          style: 'default',
          onPress: () => {
            setServices(prev =>
              prev.map(service =>
                service.id === id ? { ...service, status: 'confirmed' } : service
              )
            );
            Alert.alert('Sucesso', 'Serviço confirmado com sucesso!');
          },
        },
      ]
    );
  };

  const handleRefuse = (id: number) => {
    Alert.alert(
      'Recusar Serviço',
      'Deseja recusar este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recusar',
          style: 'destructive',
          onPress: () => {
            setServices(prev =>
              prev.map(service =>
                service.id === id ? { ...service, status: 'refused' } : service
              )
            );
          },
        },
      ]
    );
  };

  const handleCall = (phone: string) => {
    Alert.alert('Ligar', `Ligar para ${phone}?`);
  };

  const handleViewMap = (address: string) => {
    Alert.alert('Mapa', `Abrir mapa para: ${address}`);
  };

  const navigateToDetails = (service: any) => {
    router.push('/servico-detalhes');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
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
                    <Text className={`text-muted-foreground text-sm ${isRefused ? 'line-through' : ''}`}>
                      {service.address}
                    </Text>
                    <Text className="text-muted-foreground text-xs">
                      {service.city}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2">
                  <Phone color="#7CB342" size={18} />
                  <Pressable onPress={() => handleCall(service.phone)}>
                    <Text className="text-primary font-medium">{service.phone}</Text>
                  </Pressable>
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
                      className="bg-gray-200 px-4 py-2 rounded-xl flex-row items-center gap-1"
                    >
                      <X color="#757575" size={18} />
                      <Text className="text-gray-700 font-semibold text-sm">Recusar</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleAccept(service.id)}
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