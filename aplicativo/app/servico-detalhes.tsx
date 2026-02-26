import React from 'react';
import { View, Text, ScrollView, Pressable, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, Info, Check, X, Navigation } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const mockService = {
  id: 1,
  date: '15/02/2025',
  time: '09:00',
  endTime: '13:00',
  clientName: 'Maria Silva',
  address: 'Rua das Flores, 123',
  addressDetails: 'Apto 45, Bloco B',
  neighborhood: 'Centro',
  city: 'São Paulo/SP',
  zipCode: '01234-567',
  price: 150.0,
  serviceType: 'Limpeza Completa',
  status: 'confirmed',
  observations: 'Possui 2 cachorros. Deixar chave com porteiro. Trazer produtos próprios.',
};

export default function ServicoDetalhesScreen() {
  const router = useRouter();

  const handleOpenMap = () => {
    const address = `${mockService.address}, ${mockService.neighborhood}, ${mockService.city}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível detectar o aplicativo de mapas'));
  };

  const handleAccept = () => {
    Alert.alert('Confirmar Serviço', 'Deseja confirmar este agendamento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        style: 'default',
        onPress: () => {
          Alert.alert('Sucesso', 'Serviço confirmado!');
          router.back();
        },
      },
    ]);
  };

  const handleRefuse = () => {
    Alert.alert('Recusar Serviço', 'Tem certeza que deseja recusar este serviço?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Recusar',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Recusado', 'O serviço foi recusado.');
          router.back();
        },
      },
    ]);
  };

  const initials = mockService.clientName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="bg-primary px-5 pt-4 pb-6">
        <View className="flex-row items-center gap-4 mb-2">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft color="white" size={24} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">Detalhes do Serviço</Text>
            <Text className="text-orange-100 text-sm">#{mockService.id.toString().padStart(4, '0')}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="bg-card rounded-2xl p-4 mb-4 border border-border shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <Calendar color="#FF6B1A" size={20} />
            <Text className="text-foreground font-semibold">Data e Horário</Text>
          </View>
          <View className="bg-orange-50 rounded-xl p-4">
            <Text className="text-primary text-2xl font-bold mb-1">{mockService.date}</Text>
            <View className="flex-row items-center gap-2">
              <Clock color="#FF6B1A" size={16} />
              <Text className="text-foreground font-medium">
                {mockService.time}h - {mockService.endTime}h
              </Text>
              <Text className="text-muted-foreground text-sm ml-2">(4 horas)</Text>
            </View>
          </View>
        </View>

        <View className="bg-card rounded-2xl p-4 mb-4 border border-border shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-lg">👤</Text>
            <Text className="text-foreground font-semibold">Cliente</Text>
          </View>
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
              <Text className="text-white text-xl font-bold">{initials || 'C'}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-foreground text-lg font-bold">{mockService.clientName}</Text>
              <Text className="text-muted-foreground text-sm mt-1">Cliente Verificado</Text>
            </View>
          </View>
        </View>

        <View className="bg-card rounded-2xl p-4 mb-4 border border-border shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <MapPin color="#FF6B1A" size={20} />
              <Text className="text-foreground font-semibold">Endereço</Text>
            </View>
            <Pressable onPress={handleOpenMap} className="flex-row items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
              <Navigation color="#FF6B1A" size={14} />
              <Text className="text-primary text-xs font-semibold">VER NO MAPA</Text>
            </Pressable>
          </View>
          <View className="space-y-1">
            <Text className="text-foreground font-medium">{mockService.address}</Text>
            <Text className="text-muted-foreground text-sm">{mockService.addressDetails}</Text>
            <Text className="text-muted-foreground text-sm">
              {mockService.neighborhood} - {mockService.city}
            </Text>
            <Text className="text-muted-foreground text-xs">CEP: {mockService.zipCode}</Text>
          </View>

          <View className="mt-3 h-32 bg-gray-100 rounded-xl overflow-hidden relative items-center justify-center">
            <View className="bg-white px-4 py-2 rounded-full shadow-sm flex-row items-center gap-2">
              <MapPin color="#FF6B1A" size={16} />
              <Text className="text-foreground text-xs font-semibold">Localização do Serviço</Text>
            </View>
          </View>
        </View>

        <View className="bg-card rounded-2xl p-4 mb-4 border border-border shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <DollarSign color="#7CB342" size={20} />
            <Text className="text-foreground font-semibold">Valor a Receber</Text>
          </View>
          <Text className="text-green-600 text-3xl font-bold">R$ {mockService.price.toFixed(2)}</Text>
          <Text className="text-muted-foreground text-sm mt-1">Pagamento na entrega do serviço</Text>
        </View>

        <View className="bg-card rounded-2xl p-4 mb-4 border border-border shadow-sm">
          <View className="flex-row items-center gap-2 mb-3">
            <Info color="#3B82F6" size={20} />
            <Text className="text-foreground font-semibold">Detalhes do Serviço</Text>
          </View>

          <View className="mb-4">
            <Text className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Tipo de Serviço</Text>
            <Text className="text-foreground font-medium text-base">{mockService.serviceType}</Text>
          </View>

          <View>
            <Text className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Observações</Text>
            <View className="bg-orange-50 p-3 rounded-xl border border-orange-100">
              <Text className="text-foreground text-sm leading-relaxed">{mockService.observations}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-area-bottom">
        {mockService.status === 'pending' ? (
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleRefuse}
              className="flex-1 bg-gray-100 py-4 rounded-xl flex-row items-center justify-center gap-2"
            >
              <X color="#757575" size={20} />
              <Text className="text-gray-700 font-bold text-base">Recusar</Text>
            </Pressable>
            <Pressable
              onPress={handleAccept}
              className="flex-1 bg-green-600 py-4 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
            >
              <Check color="white" size={20} />
              <Text className="text-white font-bold text-base">Aceitar Serviço</Text>
            </Pressable>
          </View>
        ) : (
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleOpenMap}
              className="flex-1 bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
            >
              <Navigation color="white" size={20} />
              <Text className="text-white font-bold text-base">Como Chegar</Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              className="flex-1 bg-gray-100 py-4 rounded-xl flex-row items-center justify-center gap-2"
            >
              <ArrowLeft color="#757575" size={20} />
              <Text className="text-gray-700 font-bold text-base">Voltar</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
