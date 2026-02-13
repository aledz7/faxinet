import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, validate credentials here
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      router.replace('/(tabs)'); // Navigate to main tabs
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        
        {/* Header with Theme Toggle */}
        <View className="absolute top-4 right-4">
          <ThemeToggle />
        </View>

        {/* Logo Section */}
        <View className="items-center mb-10">
          <View className="bg-primary w-24 h-24 rounded-full items-center justify-center mb-4 shadow-lg">
            <Text className="text-white text-4xl font-bold">F</Text>
          </View>
          <Text className="text-foreground text-3xl font-bold tracking-tight">FaxiNet</Text>
          <Text className="text-muted-foreground text-sm mt-1">Sua plataforma de serviços</Text>
        </View>

        {/* Form Section */}
        <View className="space-y-4">
          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Forgot Password Link */}
          <View className="items-end mt-1">
            <Pressable onPress={() => Alert.alert('Recuperar Senha', 'Funcionalidade em desenvolvimento')}>
              <Text className="text-primary font-semibold text-sm">Esqueci minha senha</Text>
            </Pressable>
          </View>

          {/* Login Button */}
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

        {/* Footer Info */}
        <View className="mt-12 items-center">
          <Text className="text-muted-foreground text-xs">
            Ao entrar, você concorda com nossos{' '}
            <Text className="text-primary font-semibold">Termos de Uso</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}