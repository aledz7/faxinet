import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  LogOut,
  HelpCircle,
  Edit,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useFocusEffect } from '@react-navigation/native';
import { clearSession, getAppState, type Profile } from '@/lib/offline-first';

export default function PerfilScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(async () => {
    const state = await getAppState();
    setProfile(state.profile);
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile])
  );

  const handleWhatsAppHelp = async () => {
    const whatsappUrl = 'https://wa.me/556198524612?text=Preciso%20de%20ajuda';
    const supported = await Linking.canOpenURL(whatsappUrl);

    if (supported) {
      await Linking.openURL(whatsappUrl);
    } else {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado.');
    }
  };

  const handleLogout = () => {
    const onConfirmLogout = async () => {
      await clearSession();
      router.replace('/login');
    };

    if (Platform.OS === 'web') {
      if (confirm('Deseja realmente sair da sua conta?')) {
        void onConfirmLogout();
      }
    } else {
      Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => void onConfirmLogout() },
      ]);
    }
  };

  const initials = (profile?.name ?? 'Usuário')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">Meu Perfil</Text>
            <ThemeToggle />
          </View>
        </View>

        <View className="mx-4 mb-6">
          <LinearGradient colors={['#FF8C00', '#FF6B00']} style={{ borderRadius: 16, padding: 24 }}>
            <View className="flex-row items-center gap-4">
              <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center">
                <Text className="text-white text-2xl font-bold">{initials || 'U'}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">{profile?.name ?? 'Usuário'}</Text>
                <Text className="text-white/80 text-sm mt-1">Profissional Faxineiro</Text>
                <View className="flex-row items-center gap-1 mt-2">
                  <MapPin size={14} color="#fff" />
                  <Text className="text-white/90 text-xs">{profile?.address ?? 'Sem endereço'}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="mx-4 mb-6">
          <Text className="text-foreground font-semibold text-lg mb-4">Informações Pessoais</Text>

          <View className="bg-card rounded-2xl overflow-hidden">
            <View className="flex-row items-center p-4 border-b border-border">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <User size={20} color="#FF8C00" />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-medium">Nome Completo</Text>
                <Text className="text-muted-foreground text-sm">{profile?.fullName ?? '-'}</Text>
              </View>
            </View>

            <View className="flex-row items-center p-4 border-b border-border">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Phone size={20} color="#FF8C00" />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-medium">Telefone</Text>
                <Text className="text-muted-foreground text-sm">{profile?.phone ?? '-'}</Text>
              </View>
            </View>

            <View className="flex-row items-center p-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Mail size={20} color="#FF8C00" />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-medium">E-mail</Text>
                <Text className="text-muted-foreground text-sm">{profile?.email ?? '-'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mx-4 mb-6">
          <Text className="text-foreground font-semibold text-lg mb-4">Menu</Text>

          <View className="bg-card rounded-2xl overflow-hidden">
            <Pressable
              onPress={() => router.push('/editar-perfil')}
              className="flex-row items-center p-4 border-b border-border active:bg-muted/50"
            >
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Edit size={20} color="#FF8C00" />
              </View>
              <Text className="text-foreground flex-1 font-medium">Editar Perfil</Text>
              <ChevronRight size={20} color="#94a3b8" />
            </Pressable>

            <Pressable onPress={handleWhatsAppHelp} className="flex-row items-center p-4 active:bg-muted/50">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <HelpCircle size={20} color="#FF8C00" />
              </View>
              <Text className="text-foreground flex-1 font-medium">Ajuda e Suporte</Text>
              <ChevronRight size={20} color="#94a3b8" />
            </Pressable>
          </View>
        </View>

        <View className="mx-4">
          <Pressable
            onPress={handleLogout}
            className="bg-destructive/10 rounded-2xl p-4 flex-row items-center justify-center"
          >
            <LogOut size={20} color="#dc2626" />
            <Text className="text-destructive font-semibold ml-2">Sair da Conta</Text>
          </Pressable>
        </View>

        <Text className="text-center text-muted-foreground text-xs mt-6">Versão 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
