import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, Camera, User, Phone, Mail, MapPin, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock initial data matching the perfil screen
const initialProfile = {
  name: 'Ana Oliveira',
  phone: '(11) 99876-5432',
  email: 'ana.oliveira@email.com',
  address: 'Pinheiros - São Paulo/SP',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U21pbGluZyUyMGhhcHB5JTIwam95ZnVsJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D',
};

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [name, setName] = useState(initialProfile.name);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [email, setEmail] = useState(initialProfile.email);
  const [address, setAddress] = useState(initialProfile.address);

  const handleSave = () => {
    // Validation
    if (!name || !phone || !email || !address) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    // Simulate saving data
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-primary px-5 pt-4 pb-6">
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft color="white" size={24} />
          </Pressable>
          <Text className="text-white text-xl font-bold flex-1">Editar Perfil</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Avatar Section */}
        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={{ uri: initialProfile.avatar }}
              className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            />
            <Pressable className="absolute bottom-0 right-0 bg-primary p-3 rounded-full border-4 border-background shadow-sm">
              <Camera color="white" size={18} />
            </Pressable>
          </View>
          <Text className="text-muted-foreground text-sm mt-3">Toque para alterar foto</Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-5">
          {/* Name */}
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

          {/* Phone */}
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

          {/* Email */}
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

          {/* Address */}
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

        {/* Action Buttons */}
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