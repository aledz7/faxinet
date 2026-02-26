import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, User, Phone, Mail, MapPin, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getAppState, updateProfile } from '@/lib/offline-first';

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const loadProfile = useCallback(async () => {
    const state = await getAppState();
    setName(state.profile.name);
    setPhone(state.profile.phone);
    setEmail(state.profile.email);
    setAddress(state.profile.address);
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleSave = async () => {
    if (!name || !phone || !email || !address) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    await updateProfile({
      name,
      fullName: name,
      phone,
      email,
      address,
    });

    Alert.alert('Sucesso', 'Perfil salvo localmente e será sincronizado automaticamente quando houver internet.', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="bg-primary px-5 pt-4 pb-6">
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft color="white" size={24} />
          </Pressable>
          <Text className="text-white text-xl font-bold flex-1">Editar Perfil</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="items-center mb-8">
          <View className="w-28 h-28 rounded-full bg-primary items-center justify-center">
            <Text className="text-white text-3xl font-bold">
              {(name || 'U')
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join('')}
            </Text>
          </View>
          <Text className="text-muted-foreground text-sm mt-3">Dados salvos offline automaticamente</Text>
        </View>

        <View className="space-y-5">
          <View className="space-y-2">
            <Text className="text-foreground font-medium text-base ml-1">Nome Completo</Text>
            <View className="flex-row items-center bg-card border border-input rounded-2xl px-4 h-14">
              <User color="#9E9E9E" size={20} />
              <TextInput
                className="flex-1 ml-3 text-foreground text-base"
                placeholder="Seu nome"
                placeholderTextColor="#9E9E9E"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View className="space-y-2">
            <Text className="text-foreground font-medium text-base ml-1">Telefone</Text>
            <View className="flex-row items-center bg-card border border-input rounded-2xl px-4 h-14">
              <Phone color="#9E9E9E" size={20} />
              <TextInput
                className="flex-1 ml-3 text-foreground text-base"
                placeholder="(00) 00000-0000"
                placeholderTextColor="#9E9E9E"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

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
            <Text className="text-foreground font-medium text-base ml-1">Endereço</Text>
            <View className="flex-row items-center bg-card border border-input rounded-2xl px-4 h-14">
              <MapPin color="#9E9E9E" size={20} />
              <TextInput
                className="flex-1 ml-3 text-foreground text-base"
                placeholder="Bairro - Cidade/UF"
                placeholderTextColor="#9E9E9E"
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>
        </View>

        <View className="mt-8 space-y-3">
          <Pressable
            onPress={handleSave}
            className="bg-primary rounded-2xl h-14 items-center justify-center flex-row shadow-sm"
          >
            <Save color="white" size={20} className="mr-2" />
            <Text className="text-white font-bold text-base">Salvar Alterações</Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="bg-card border border-border rounded-2xl h-14 items-center justify-center flex-row"
          >
            <X color="#9E9E9E" size={20} className="mr-2" />
            <Text className="text-muted-foreground font-semibold text-base">Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
