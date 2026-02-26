import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function TermosUsoScreen() {
    const router = useRouter();

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
                    <Text className="ml-4 text-xl font-bold text-foreground">Termos de Uso</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-4">
                    <View className="pb-10">
                        <Text className="text-2xl font-bold text-foreground mb-6">Termos e Condições</Text>

                        <Section
                            title="1. Aceitação dos Termos"
                            content="Ao acessar e usar o aplicativo FaxiNet, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossa plataforma."
                        />

                        <Section
                            title="2. Descrição do Serviço"
                            content="O FaxiNet é uma plataforma que conecta profissionais de limpeza a clientes. Atuamos apenas como intermediários, não sendo responsáveis pela execução direta dos serviços ou pelo vínculo empregatício entre as partes."
                        />

                        <Section
                            title="3. Cadastro e Segurança"
                            content="Para utilizar nossos serviços, você deve fornecer informações precisas e completas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta."
                        />

                        <Section
                            title="4. Responsabilidades do Prestador"
                            content="O profissional compromete-se a realizar os serviços com pontualidade, qualidade e profissionalismo. Qualquer dano causado no local de trabalho é de inteira responsabilidade do prestador."
                        />

                        <Section
                            title="5. Pagamentos e Taxas"
                            content="Os valores dos serviços são definidos na plataforma. O FaxiNet poderá cobrar taxas de intermediação sobre os serviços realizados, as quais serão informadas previamente."
                        />

                        <Section
                            title="6. Cancelamentos"
                            content="Cancelamentos devem seguir a política vigente no aplicativo. Cancelamentos reincidentes ou próximos ao horário do serviço podem gerar penalidades ou suspensão da conta."
                        />

                        <Section
                            title="7. Modificações dos Termos"
                            content="Reservamos o direito de modificar estes termos a qualquer momento. Notificaremos os usuários sobre mudanças significativas através do aplicativo ou e-mail."
                        />

                        <Text className="text-muted-foreground text-xs mt-8 text-center">
                            Última atualização: 13 de Fevereiro de 2025
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

function Section({ title, content }: { title: string; content: string }) {
    return (
        <View className="mb-6">
            <Text className="text-foreground font-bold text-lg mb-2">{title}</Text>
            <Text className="text-muted-foreground text-base leading-6 text-justify">
                {content}
            </Text>
        </View>
    );
}
