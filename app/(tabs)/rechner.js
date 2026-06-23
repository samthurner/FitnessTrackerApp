import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { globalState } from '../../constants/globalState';

export default function RechnerScreen() {
    const [gewicht, setGewicht] = useState('');
    const [groesse, setGroesse] = useState('');
    const [bmi, setBmi] = useState(null);

    const loadWeightFromProfil = () => {
        // Holt das Gewicht direkt aus dem globalen Profil-State
        setGewicht(globalState.zielGewicht);
    };

    const calculateBMI = () => {
        Keyboard.dismiss();
        if (gewicht && groesse) {
            const g = parseFloat(gewicht.replace(',', '.'));
            const h = parseFloat(groesse.replace(',', '.')) / 100;
            if (h > 0) {
                const bmiWert = (g / (h * h)).toFixed(1);
                setBmi(bmiWert);
            }
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Text style={styles.title}>🧮 BMI-Rechner</Text>

                <View style={styles.card}>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Gewicht in kg"
                            placeholderTextColor="#8e8e93"
                            keyboardType="numeric"
                            value={gewicht}
                            onChangeText={setGewicht}
                        />
                        {/* Neuer Button für Profil-Import */}
                        <TouchableOpacity style={styles.profileBtn} onPress={loadWeightFromProfil}>
                            <Text style={styles.profileBtnText}>Aus Profil 👤</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Größe in cm (z.B. 180)"
                        placeholderTextColor="#8e8e93"
                        keyboardType="numeric"
                        value={groesse}
                        onChangeText={setGroesse}
                    />
                    <TouchableOpacity style={styles.btn} onPress={calculateBMI}>
                        <Text style={styles.btnText}>Berechnen</Text>
                    </TouchableOpacity>
                </View>

                {bmi && (
                    <View style={styles.resultCard}>
                        <Text style={styles.resultLabel}>Dein BMI:</Text>
                        <Text style={styles.resultValue}>{bmi}</Text>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2 },
    inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    input: { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 8, fontSize: 16, color: '#212529', marginBottom: 10 }, // Schwarz eingetragener Text
    profileBtn: { backgroundColor: '#E5E5EA', padding: 8, borderRadius: 8, marginLeft: 10 },
    profileBtnText: { color: '#007AFF', fontWeight: '600', fontSize: 12 },
    btn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    resultCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginTop: 20, alignItems: 'center', elevation: 2 },
    resultLabel: { fontSize: 16, color: '#6c757d' },
    resultValue: { fontSize: 36, fontWeight: 'bold', color: '#007AFF', marginTop: 5 }
});