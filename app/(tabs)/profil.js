import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { globalState } from '../../constants/globalState';

export default function ProfilScreen() {
    const [name, setName] = useState(globalState.name);
    const [zielGewicht, setZielGewicht] = useState(globalState.zielGewicht);
    const [isEditing, setIsEditing] = useState(false);

    const saveProfile = () => {
        Keyboard.dismiss();
        globalState.name = name;
        globalState.zielGewicht = zielGewicht; // Speichert das Gewicht global ab
        setIsEditing(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>👤 Benutzerprofil</Text>

            <View style={styles.card}>
                <Text style={styles.infoLabel}>Name:</Text>
                {isEditing ? (
                    <TextInput style={styles.input} value={name} onChangeText={setName} />
                ) : (
                    <Text style={styles.infoText}>{name}</Text>
                )}

                <Text style={styles.infoLabel}>Gewicht im Profil (kg):</Text>
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={zielGewicht}
                        onChangeText={setZielGewicht}
                    />
                ) : (
                    <Text style={styles.infoText}>{zielGewicht} kg</Text>
                )}

                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: isEditing ? '#4CD964' : '#007AFF' }]}
                    onPress={isEditing ? saveProfile : () => setIsEditing(true)}
                >
                    <Text style={styles.btnText}>{isEditing ? "Speichern" : "Bearbeiten"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 2 },
    infoLabel: { fontSize: 14, color: '#6c757d', marginTop: 10 },
    infoText: { fontSize: 18, fontWeight: 'bold', color: '#212529', marginBottom: 15 },
    input: { borderBottomWidth: 1, borderBottomColor: '#007AFF', paddingVertical: 5, fontSize: 18, marginBottom: 15, fontWeight: 'bold', color: '#212529' },
    btn: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});