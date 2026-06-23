import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Keyboard, TouchableWithoutFeedback, Modal } from 'react-native';

export default function TrainingScreen() {
    // Liste der Übungen
    const [uebungen, setUebungen] = useState([
        {
            id: '1',
            name: 'Bankdrücken',
            saetze: [
                { id: 's1', gewicht: '60', reps: '10', done: true },
                { id: 's2', gewicht: '60', reps: '8', done: false }
            ]
        },
        {
            id: '2',
            name: 'Kniebeugen',
            saetze: [
                { id: 's1', gewicht: '80', reps: '12', done: false }
            ]
        },
    ]);

    // States für das Hinzufügen einer neuen Übung
    const [inputUebung, setInputUebung] = useState('');

    // States für das Detail-Modal
    const [selectedUebung, setSelectedUebung] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputGewicht, setInputGewicht] = useState('');
    const [inputReps, setInputReps] = useState('');

    // 1. Neue Hauptübung hinzufügen
    const handleAddUebung = () => {
        if (!inputUebung.trim()) return;
        Keyboard.dismiss(); // Tastatur schließen

        const neueUebung = {
            id: Date.now().toString(),
            name: inputUebung,
            saetze: []
        };

        setUebungen(prev => [...prev, neueUebung]);
        setInputUebung('');
    };

    // 2. In eine Übung reingehen
    const openUebungDetails = (uebung) => {
        setSelectedUebung(uebung);
        setModalVisible(true);
    };

    // 3. Einen neuen Satz hinzufügen (Tastatur schließt hier jetzt erzwungen)
    const handleAddSatz = () => {
        if (!selectedUebung || !inputGewicht || !inputReps) return;

        // Erzwungenes Schließen der Tastatur beim Abschicken
        Keyboard.dismiss();

        const neuerSatz = {
            id: Date.now().toString(),
            gewicht: inputGewicht,
            reps: inputReps,
            done: false
        };

        const aktualisierteUebungen = uebungen.map(u => {
            if (u.id === selectedUebung.id) {
                const neueSaetze = [...u.saetze, neuerSatz];
                setSelectedUebung({ ...u, saetze: neueSaetze });
                return { ...u, saetze: neueSaetze };
            }
            return u;
        });

        setUebungen(aktualisierteUebungen);
        setInputGewicht('');
        setInputReps('');
    };

    // 4. Einen einzelnen Satz als erledigt toggeln
    const toggleSatzDone = (satzId) => {
        const aktualisierteUebungen = uebungen.map(u => {
            if (u.id === selectedUebung.id) {
                const neueSaetze = u.saetze.map(s => s.id === satzId ? { ...s, done: !s.done } : s);
                setSelectedUebung({ ...u, saetze: neueSaetze });
                return { ...u, saetze: neueSaetze };
            }
            return u;
        });
        setUebungen(aktualisierteUebungen);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.title}>🏋️‍♂️ Workout Log</Text>

                {/* Bereich: Neue Übung erstellen */}
                <View style={styles.inputCard}>
                    <Text style={styles.formTitle}>Neue Übung erstellen:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="z.B. Kreuzheben, Klimmzüge..."
                        placeholderTextColor="#8e8e93"
                        value={inputUebung}
                        onChangeText={setInputUebung}
                        returnKeyType="done"
                        onSubmitEditing={handleAddUebung} // Schließt Tastatur bei Enter
                    />
                    <TouchableOpacity style={styles.addBtn} onPress={handleAddUebung}>
                        <Text style={styles.addBtnText}>Übung erstellen</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Deine Übungen (Klicke zum Öffnen):</Text>

                {/* Liste der Hauptübungen */}
                <FlatList
                    data={uebungen}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.uebungCard} onPress={() => openUebungDetails(item)}>
                            <View style={styles.uebungInfo}>
                                <Text style={styles.uebungText}>{item.name}</Text>
                                <Text style={styles.detailsText}>{item.saetze.length} Sätze eingetragen</Text>
                            </View>
                            <Text style={styles.arrowIcon}>➔</Text>
                        </TouchableOpacity>
                    )}
                />

                {/* MODAL: Detailansicht für Sätze */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Keyboard.dismiss();
                        setModalVisible(false);
                    }}
                >
                    {/* WICHTIG: Das hier fängt Klicks außerhalb der Inputs im Modal ab und schließt die Tastatur */}
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalOverlay}>

                            {/* Verhindert, dass Klicks AUF die eigentliche Content-Box die Tastatur schließen */}
                            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                                <View style={styles.modalContainer}>
                                    {selectedUebung && (
                                        <>
                                            <Text style={styles.modalTitle}>{selectedUebung.name}</Text>

                                            {/* Satz hinzufügen Formular */}
                                            <View style={styles.modalForm}>
                                                <TextInput
                                                    style={[styles.input, { flex: 1, marginRight: 10, marginBottom: 0 }]}
                                                    placeholder="Gewicht (kg)"
                                                    placeholderTextColor="#8e8e93"
                                                    keyboardType="numeric"
                                                    value={inputGewicht}
                                                    onChangeText={setInputGewicht}
                                                    returnKeyType="done"
                                                />
                                                <TextInput
                                                    style={[styles.input, { flex: 1, marginRight: 10, marginBottom: 0 }]}
                                                    placeholder="Reps"
                                                    placeholderTextColor="#8e8e93"
                                                    keyboardType="numeric"
                                                    value={inputReps}
                                                    onChangeText={setInputReps}
                                                    returnKeyType="done"
                                                    onSubmitEditing={handleAddSatz} // Drücken auf der Tastatur loggt direkt den Satz
                                                />
                                                <TouchableOpacity style={styles.satzAddBtn} onPress={handleAddSatz}>
                                                    <Text style={styles.addBtnText}>+ Satz</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* Liste der Sätze */}
                                            <Text style={styles.modalSectionTitle}>Eingetragene Sätze:</Text>
                                            <FlatList
                                                data={selectedUebung.saetze}
                                                keyExtractor={item => item.id}
                                                renderItem={({ item, index }) => (
                                                    <View style={[styles.satzRow, item.done && styles.satzRowDone]}>
                                                        <Text style={styles.satzNumber}>Satz {index + 1}:</Text>
                                                        <Text style={styles.satzDetails}>{item.gewicht} kg x {item.reps} Wdh.</Text>
                                                        <TouchableOpacity
                                                            style={[styles.checkBtn, item.done && styles.checkBtnDone]}
                                                            onPress={() => toggleSatzDone(item.id)}
                                                        >
                                                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                                                                {item.done ? "✓" : "Log"}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                                // Sorgt dafür, dass man die Tastatur auch durch Wischen auf der Liste schließen kann
                                                keyboardDismissMode="on-drag"
                                            />

                                            {/* Schließen Button */}
                                            <TouchableOpacity
                                                style={styles.closeBtn}
                                                onPress={() => {
                                                    Keyboard.dismiss();
                                                    setModalVisible(false);
                                                }}
                                            >
                                                <Text style={styles.closeBtnText}>Zurück zum Workout</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </TouchableWithoutFeedback>

                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#212529' },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 15, marginBottom: 10, color: '#495057' },
    inputCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, elevation: 2, marginBottom: 10 },
    formTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#495057' },
    input: { borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical: 6, marginBottom: 12, fontSize: 15, color: '#212529' },
    addBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
    addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

    uebungCard: { flexDirection: 'row', justifyContent: 'space-between', itemsAlign: 'center', backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 10, elevation: 1 },
    uebungInfo: { flex: 1 },
    uebungText: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
    detailsText: { color: '#6c757d', marginTop: 2, fontSize: 13 },
    arrowIcon: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '85%' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#212529' },
    modalForm: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'space-between' },
    satzAddBtn: { backgroundColor: '#4CD964', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
    modalSectionTitle: { fontSize: 15, fontWeight: '700', color: '#495057', marginBottom: 10 },

    satzRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: '#8e8e93' },
    satzRowDone: { backgroundColor: '#e2fbe4', borderLeftColor: '#4CD964' },
    satzNumber: { fontWeight: '700', width: 60, color: '#212529' },
    satzDetails: { flex: 1, fontSize: 15, color: '#212529' },
    checkBtn: { backgroundColor: '#8e8e93', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    checkBtnDone: { backgroundColor: '#4CD964' },

    closeBtn: { backgroundColor: '#007AFF', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});