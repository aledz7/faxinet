import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function RecuperarSenhaScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert('Atenção', 'Por favor, informe seu e-mail.');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert(
                'E-mail Enviado',
                'Se este e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha em instantes.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        }, 1500);
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 px-6">

                {/* Header */}
                <View className="flex-row items-center py-4">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-muted/20"
                    >
                        <ArrowLeft color="#FF6B1A" size={24} />
                    </Pressable>
                    <Text className="ml-4 text-xl font-bold text-foreground">Recuperar Senha</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <View className="mt-8 mb-10">
                        <Text className="text-2xl font-bold text-foreground mb-3">Esqueceu sua senha?</Text>
                        <Text className="text-muted-foreground text-base leading-6">
                            Não se preocupe! Informe o e-mail cadastrado na sua conta e enviaremos um link para você redefinir sua senha.
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-6">
                        <View className="space-y-2">
                            <Text className="text-foreground font-medium text-base ml-1">E-mail</Text>
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

                        <Pressable
                            onPress={handleResetPassword}
                            disabled={isLoading}
                            className={`mt-4 bg-primary rounded-2xl h-14 items-center justify-center flex-row shadow-sm ${isLoading ? 'opacity-70' : ''}`}
                        >
                            {isLoading ? (
                                <Text className="text-white font-bold text-base">Enviando...</Text>
                            ) : (
                                <>
                                    <Send color="white" size={20} className="mr-2" />
                                    <Text className="text-white font-bold text-base">Enviar Instruções</Text>
                                </>
                            )}
                        </Pressable>
                    </View>

                    <View className="mt-8 items-center">
                        <Pressable onPress={() => router.back()}>
                            <Text className="text-muted-foreground">
                                Lembrou sua senha? <Text className="text-primary font-bold">Voltar para o Login</Text>
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
