import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8e8e93',
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
        }}>
            <Tabs.Screen name="index" options={{ title: 'FitTrack', tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
            <Tabs.Screen name="makros" options={{ title: 'Ernährung', tabBarLabel: 'Makros', tabBarIcon: ({ color, size }) => <Ionicons name="nutrition" size={size} color={color} /> }} />
            <Tabs.Screen name="wasser" options={{ title: 'Wasser-Tracker', tabBarLabel: 'Wasser', tabBarIcon: ({ color, size }) => <Ionicons name="water" size={size} color={color} /> }} />
            <Tabs.Screen name="training" options={{ title: 'Mein Training', tabBarLabel: 'Training', tabBarIcon: ({ color, size }) => <Ionicons name="barbell" size={size} color={color} /> }} />
            <Tabs.Screen name="rechner" options={{ title: 'Fitness-Rechner', tabBarLabel: 'Rechner', tabBarIcon: ({ color, size }) => <Ionicons name="calculator" size={size} color={color} /> }} />
            <Tabs.Screen name="profil" options={{ title: 'Mein Profil', tabBarLabel: 'Profil', tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
        </Tabs>
    );
}