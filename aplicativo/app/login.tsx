import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ThemeToggle } from '@/components/ThemeToggle';
import { saveSession } from '@/lib/offline-first';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    // Fluxo mock com persistência local para permitir uso offline.
    setTimeout(async () => {
      await saveSession({
        email,
        loggedInAt: new Date().toISOString(),
      });

      setIsLoading(false);
      Alert.alert('Sucesso', 'Login realizado com sucesso! Você pode usar o app offline.');
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        <View className="absolute top-4 right-4">
          <ThemeToggle />
        </View>

        <View className="items-center mb-10">
          <View className="mb-4 shadow-lg overflow-hidden" style={{ borderRadius: 20 }}>
            <Image
              source={require('../assets/images/logo-faxinet.jpeg')}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-foreground text-3xl font-bold tracking-tight">FaxiNet</Text>
          <Text className="text-muted-foreground text-sm mt-1">Sua plataforma de serviços</Text>
          <Text className="text-muted-foreground text-xs mt-1">Modo offline sempre disponível</Text>
        </View>

        <View className="space-y-4">
          <View className="space-y-2">
            <Text className="text-foreground font-medium text-base ml-1">Email</Text>
            <View className="flex-row items-center bg-card border border-input rounded-2xl px-4 h-14">
              <Mail color="#9E9E9E" size={20} />
              <TextInput
                className="flex-1 ml-3 text-foreground text-base"
                placeholder="seu@email.com"
                placeholderTextColor="#9E9E9E"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="space-y-2">
            <Text className="text-foreground font-medium text-base ml-1">Senha</Text>
            <View className="flex-row items-center bg-card border border-input rounded-2xl px-4 h-14">
              <Lock color="#9E9E9E" size={20} />
              <TextInput
                className="flex-1 ml-3 text-foreground text-base"
                placeholder="••••••••"
                placeholderTextColor="#9E9E9E"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} className="ml-2 p-1">
                {showPassword ? (
                  <EyeOff color="#9E9E9E" size={20} />
                ) : (
                  <Eye color="#9E9E9E" size={20} />
                )}
              </Pressable>
            </View>
          </View>

          <View className="items-end mt-1">
            <Pressable onPress={() => router.push('/recuperar-senha')}>
              <Text className="text-primary font-semibold text-sm">Esqueci minha senha</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            className={`mt-4 bg-primary rounded-2xl h-14 items-center justify-center flex-row shadow-sm ${isLoading ? 'opacity-70' : ''}`}
          >
            {isLoading ? (
              <Text className="text-white font-bold text-base">Entrando...</Text>
            ) : (
              <>
                <LogIn color="white" size={20} className="mr-2" />
                <Text className="text-white font-bold text-base">Entrar</Text>
              </>
            )}
          </Pressable>
        </View>

        <View className="mt-12 items-center">
          <Text className="text-muted-foreground text-xs">
            Ao entrar, você concorda com nossos{' '}
            <Pressable onPress={() => router.push('/termos')}>
              <Text className="text-primary font-semibold">Termos de Uso</Text>
            </Pressable>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
