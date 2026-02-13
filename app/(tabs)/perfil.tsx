import React from 'react';
import { View, Text, ScrollView, Image, Pressable, Alert } from 'react-native';
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
  Edit
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function PerfilScreen() {
  const router = useRouter();

  const handleWhatsAppHelp = () => {
    const whatsappUrl = 'https://api.whatsapp.com/send?phone=556198524612&text=Preciso%20de%20ajuda';
    // In a real app, you would use Linking.openURL(whatsappUrl)
    Alert.alert('WhatsApp', `Abrir WhatsApp: ${whatsappUrl}`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => {
          // Navigate to login
          router.replace('/login');
        }},
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-foreground">Meu Perfil</Text>
            <ThemeToggle />
          </View>
        </View>

        {/* Profile Card */}
        <View className="mx-4 mb-6">
          <LinearGradient
            colors={['#FF8C00', '#FF6B00']}
            style={{ borderRadius: 16, padding: 24 }}
          >
            <View className="flex-row items-center gap-4">
              <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center overflow-hidden">
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">João Silva</Text>
                <Text className="text-white/80 text-sm mt-1">Profissional Faxineiro</Text>
                <View className="flex-row items-center gap-1 mt-2">
                  <MapPin size={14} color="#fff" />
                  <Text className="text-white/90 text-xs">Brasília, DF</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Personal Info */}
        <View className="mx-4 mb-6">
          <Text className="text-foreground font-semibold text-lg mb-4">Informações Pessoais</Text>
          
          <View className="bg-card rounded-2xl overflow-hidden">
            <View className="flex-row items-center p-4 border-b border-border">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <User size={20} color="#FF8C00" />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-medium">Nome Completo</Text>
                <Text className="text-muted-foreground text-sm">João Silva Santos</Text>
              </View>
            </View>

            <View className="flex-row items-center p-4 border-b border-border">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Phone size={20} color="#FF8C00" />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-medium">Telefone</Text>
                <Text className="text-muted-foreground text-sm">(61) 98524-612</Text>
              </View>
            </View>

            <View className="flex-row items-center p-4">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <Mail size={20} color="#FF8C00" />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-medium">E-mail</Text>
                <Text className="text-muted-foreground text-sm">joao.silva@email.com</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View className="mx-4 mb-6">
          <Text className="text-foreground font-semibold text-lg mb-4">Menu</Text>
          
          <View className="bg-card rounded-2xl overflow-hidden">
            {/* Editar Perfil */}
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

            {/* Ajuda e Suporte */}
            <Pressable
              onPress={handleWhatsAppHelp}
              className="flex-row items-center p-4 active:bg-muted/50"
            >
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-4">
                <HelpCircle size={20} color="#FF8C00" />
              </View>
              <Text className="text-foreground flex-1 font-medium">Ajuda e Suporte</Text>
              <ChevronRight size={20} color="#94a3b8" />
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <View className="mx-4">
          <Pressable
            onPress={handleLogout}
            className="bg-destructive/10 rounded-2xl p-4 flex-row items-center justify-center"
          >
            <LogOut size={20} color="#dc2626" />
            <Text className="text-destructive font-semibold ml-2">Sair da Conta</Text>
          </Pressable>
        </View>

        {/* Version */}
        <Text className="text-center text-muted-foreground text-xs mt-6">
          Versão 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}