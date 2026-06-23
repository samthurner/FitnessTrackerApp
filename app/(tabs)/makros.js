import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { globalState } from '../../constants/globalState';

export default function MakrosScreen() {
    const [kcal, setKcal] = useState(globalState.kcal);
    const [inputKcal, setInputKcal] = useState('');
    const [inputProtein, setInputProtein] = useState('');

    const handleAddFood = () => {
        Keyboard.dismiss();

        const extraKcal = parseInt(inputKcal, 10) || 0;
        const extraProtein = parseInt(inputProtein, 10) || 0;

        const neuerKcalWert = kcal + extraKcal;
        const neuerProteinWert = (globalState.protein || 0) + extraProtein;

        setKcal(neuerKcalWert);
        globalState.kcal = neuerKcalWert;
        globalState.protein = neuerProteinWert; // <-- Hinzufügen!

        setInputKcal('');
        setInputProtein('');
    };

    const handleReset = () => {
        setKcal(0);
        globalState.kcal = 0; // Global zurücksetzen
        setInputKcal('');
        setInputProtein('');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.title}>🍎 Ernährungs-Tracker</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Kalorien: {kcal} / {globalState.zielKcal} kcal</Text>
                    <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: `${Math.min((kcal / globalState.zielKcal) * 100, 100)}%`, backgroundColor: '#FF9500' }]} />
                    </View>
                </View>

                <View style={styles.inputCard}>
                    <TextInput
                        style={styles.input}
                        placeholder="Kalorien (kcal) z.B. 350"
                        placeholderTextColor="#8e8e93"
                        keyboardType="numeric"
                        value={inputKcal}
                        onChangeText={setInputKcal}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Protein (g) z.B. 25"
                        placeholderTextColor="#8e8e93"
                        keyboardType="numeric"
                        value={inputProtein}
                        onChangeText={setInputProtein}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleAddFood}>
                        <Text style={styles.buttonText}>Essen hinzufügen</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Text style={styles.buttonText}>Tag zurücksetzen 🔄</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#212529' },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    progressBg: { height: 12, backgroundColor: '#e5e5ea', borderRadius: 6, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 6 },
    inputCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginTop: 10, elevation: 2 },
    input: { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 8, marginBottom: 15, fontSize: 16, color: '#212529' },
    button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    resetButton: { backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});