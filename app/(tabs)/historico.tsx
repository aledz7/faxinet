import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, TrendingUp, DollarSign, Filter, ChevronRight } from 'lucide-react-native';
import { ThemeToggle } from '@/components/ThemeToggle';

// Mock data for historical services
const mockHistoryServices = [
  {
    id: 1,
    date: '10/02/2025',
    time: '14:00',
    clientName: 'Carlos Oliveira',
    address: 'Av. Brasil, 500',
    city: 'Jardins - São Paulo/SP',
    price: 180.00,
    serviceType: 'Limpeza Pós-Obra',
    status: 'completed',
  },
  {
    id: 2,
    date: '08/02/2025',
    time: '09:00',
    clientName: 'Fernanda Lima',
    address: 'Rua Augusta, 1200',
    city: 'Consolação - São Paulo/SP',
    price: 150.00,
    serviceType: 'Limpeza Completa',
    status: 'completed',
  },
  {
    id: 3,
    date: '05/02/2025',
    time: '10:30',
    clientName: 'Roberto Santos',
    address: 'Rua das Palmeiras, 45',
    city: 'Pinheiros - São Paulo/SP',
    price: 120.00,
    serviceType: 'Limpeza Padrão',
    status: 'completed',
  },
  {
    id: 4,
    date: '01/02/2025',
    time: '08:00',
    clientName: 'Juliana Costa',
    address: 'Alameda Santos, 2000',
    city: 'Bela Vista - São Paulo/SP',
    price: 200.00,
    serviceType: 'Limpeza Completa',
    status: 'completed',
  },
  {
    id: 5,
    date: '28/01/2025',
    time: '13:00',
    clientName: 'Marcos Pereira',
    address: 'Rua Haddock Lobo, 900',
    city: 'Jardins - São Paulo/SP',
    price: 160.00,
    serviceType: 'Limpeza Padrão',
    status: 'completed',
  },
];

type FilterPeriod = 'all' | 'month' | 'quarter';

export default function HistoricoScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterPeriod>('all');
  const [services] = useState(mockHistoryServices);

  // Calculate totals
  const totalServices = services.length;
  const totalEarned = services.reduce((sum, service) => sum + service.price, 0);

  const filters = [
    { id: 'all', label: 'Tudo' },
    { id: 'month', label: 'Este Mês' },
    { id: 'quarter', label: '3 Meses' },
  ];

  const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${parseInt(day)} de ${months[parseInt(month) - 1]}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary px-5 pt-4 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Histórico</Text>
            <Text className="text-orange-100 text-sm mt-1">
              Seus serviços realizados
            </Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Filter Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {filters.map((filter) => (
            <Pressable
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id as FilterPeriod)}
              className={`px-4 py-2 rounded-full border ${
                selectedFilter === filter.id
                  ? 'bg-white border-white'
                  : 'bg-transparent border-white/30'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  selectedFilter === filter.id ? 'text-primary' : 'text-white'
                }`}
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Summary Cards */}
      <View className="px-5 -mt-3 flex-row gap-3">
        <View className="flex-1 bg-card rounded-2xl p-4 border border-border shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-primary/10 p-2 rounded-full">
              <TrendingUp color="#FF6B1A" size={20} />
            </View>
            <Text className="text-muted-foreground text-sm">Serviços</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground">{totalServices}</Text>
          <Text className="text-muted-foreground text-xs">Realizados</Text>
        </View>

        <View className="flex-1 bg-card rounded-2xl p-4 border border-border shadow-sm">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-green-100 p-2 rounded-full">
              <DollarSign color="#7CB342" size={20} />
            </View>
            <Text className="text-muted-foreground text-sm">Total</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground">
            R$ {totalEarned.toFixed(2)}
          </Text>
          <Text className="text-muted-foreground text-xs">Recebido</Text>
        </View>
      </View>

      {/* Services List */}
      <ScrollView
        className="flex-1 px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-foreground font-semibold text-lg">
            Serviços Concluídos
          </Text>
          <Pressable className="flex-row items-center gap-1">
            <Filter color="#FF6B1A" size={16} />
            <Text className="text-primary text-sm font-medium">Filtrar</Text>
          </Pressable>
        </View>

        {services.map((service) => (
          <Pressable
            key={service.id}
            className="bg-card rounded-2xl p-4 mb-4 border border-border"
          >
            {/* Header with date and status */}
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-row items-center gap-2">
                <Calendar color="#FF6B1A" size={18} />
                <View>
                  <Text className="text-foreground font-semibold">
                    {formatDate(service.date)}
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    {service.time}h
                  </Text>
                </View>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 text-xs font-bold">CONCLUÍDO</Text>
              </View>
            </View>

            {/* Service Info */}
            <View className="space-y-2 mb-3">
              <View className="flex-row items-start gap-2">
                <Text className="text-lg">👤</Text>
                <Text className="text-foreground font-medium">{service.clientName}</Text>
              </View>

              <Text className="text-muted-foreground text-sm ml-7">
                {service.address}
              </Text>
              <Text className="text-muted-foreground text-xs ml-7">
                {service.city}
              </Text>
            </View>

            {/* Divider */}
            <View className="h-px bg-border my-3" />

            {/* Price and Action */}
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-muted-foreground text-xs">Valor Recebido</Text>
                <Text className="text-green-600 text-xl font-bold">
                  R$ {service.price.toFixed(2)}
                </Text>
              </View>

              <Pressable className="flex-row items-center gap-1 bg-muted px-3 py-2 rounded-xl">
                <Text className="text-foreground font-medium text-sm">Ver Detalhes</Text>
                <ChevronRight color="#9E9E9E" size={16} />
              </Pressable>
            </View>
          </Pressable>
        ))}

        {services.length === 0 && (
          <View className="items-center justify-center py-16">
            <Calendar color="#D1D5DB" size={64} />
            <Text className="text-muted-foreground text-lg mt-4">
              Nenhum serviço realizado
            </Text>
            <Text className="text-muted-foreground text-sm">
              Seus serviços concluídos aparecerão aqui
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}