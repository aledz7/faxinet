import { Tabs } from 'expo-router';
import { Calendar, List, Bell, User } from 'lucide-react-native';
import { Text } from 'react-native';
import { cssInterop, useColorScheme } from 'nativewind';

cssInterop(Calendar, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(List, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Bell, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(User, { className: { target: 'style', nativeStyleToProp: { color: true } } });

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? '#1c1917' : '#FFFFFF';
  const borderTopColor = isDark ? '#44403c' : '#E0E0E0';
  const activeTintColor = '#FF6B1A';
  const inactiveTintColor = isDark ? '#a8a29e' : '#9E9E9E';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopColor: borderTopColor,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarLabel: ({ focused, children }) => (
          <Text
            style={{
              color: focused ? activeTintColor : inactiveTintColor,
              fontSize: 12,
              fontWeight: '600',
            }}
          >
            {children}
          </Text>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ focused, color }) => (
            <Calendar color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ focused, color }) => (
            <List color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="notificacoes"
        options={{
          title: 'Notificações',
          tabBarIcon: ({ focused, color }) => (
            <Bell color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused, color }) => (
            <User color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}