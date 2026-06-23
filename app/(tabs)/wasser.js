import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { globalState } from '../../constants/globalState';

export default function WasserScreen() {
    const [wasser, setWasser] = useState(globalState.wasser);

    const addWasser = (amount) => {
        const neuerWert = wasser + amount;
        setWasser(neuerWert);
        globalState.wasser = neuerWert; // Aktualisiert globalen Speicher
    };

    const resetWasser = () => {
        setWasser(0);
        globalState.wasser = 0;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>💧 Wasser-Tracker</Text>

            <View style={styles.counterCard}>
                <Text style={styles.counterText}>{wasser} / {globalState.zielWasser} ml</Text>
                <Text style={styles.subtext}>
                    {wasser >= globalState.zielWasser ? "✅ Tagesziel erreicht!" : "Trink noch ein Glas!"}
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Schnell hinzufügen:</Text>
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.waterButton} onPress={() => addWasser(250)}>
                    <Text style={styles.btnText}>+250 ml 🥛</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.waterButton} onPress={() => addWasser(500)}>
                    <Text style={styles.btnText}>+500 ml 🧪</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={resetWasser}>
                <Text style={styles.btnText}>Zurücksetzen 🔄</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#212529', alignSelf: 'flex-start' },
    counterCard: { backgroundColor: '#fff', width: '100%', padding: 30, borderRadius: 16, alignItems: 'center', marginBottom: 30, elevation: 2 },
    counterText: { fontSize: 32, fontWeight: 'bold', color: '#007AFF' },
    subtext: { fontSize: 16, color: '#6c757d', marginTop: 5 },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 15, alignSelf: 'flex-start', color: '#495057' },
    btnRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    waterButton: { flex: 1, backgroundColor: '#007AFF', padding: 15, borderRadius: 12, marginHorizontal: 5, alignItems: 'center', elevation: 2 },
    resetButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 12, width: '100%', alignItems: 'center', elevation: 2, marginTop: 30 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});