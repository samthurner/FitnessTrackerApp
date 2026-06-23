import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { MOTIVATIONAL_QUOTES } from '../../constants/quotes';
import { globalState } from '../../constants/globalState';

const { width } = Dimensions.get('window');
// Perfekte, proportionale Kachel- und Donut-Größen für das Grid
const DONUT_SIZE = width * 0.26;
const RADIUS = (DONUT_SIZE - 12) / 2; // Radius abzüglich Linienstärke (6px pro Seite)
const UMFANG = 2 * Math.PI * RADIUS; // Der echte mathematische Umfang

// Circle-Komponente von SVG für React Native Animationen vorbereiten
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function PerfectSvgDonut({ value, target, color, unit, label, onPress }) {
    const prozent = target > 0 ? Math.min((value / target) * 100, 100) : 0;

    // Karten-Animationen für das geschmeidige Reinfaden
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    // Animations-Wert für den Ladebalken-Fortschritt (0 bis 'prozent')
    const progressAnim = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        useCallback(() => {
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.9);
            progressAnim.setValue(0);

            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
                Animated.timing(progressAnim, {
                    toValue: prozent,
                    duration: 600,
                    useNativeDriver: true // Native Driver funktioniert hier super für den Dashoffset
                })
            ]).start();
        }, [value, target, prozent])
    );

    // JETZT RICHTIG RUM:
    // Bei 0% Fortschritt -> Offset = UMFANG (nichts zu sehen)
    // Bei 100% Fortschritt -> Offset = 0 (Kreis komplett gezeichnet)
    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: [UMFANG, 0]
    });

    return (
        <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.7}>
            <Animated.View style={[styles.cardAnimatedContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <Text style={styles.chartTitle}>{label}</Text>

                <View style={{ width: DONUT_SIZE, height: DONUT_SIZE, justifyContent: 'center', alignItems: 'center' }}>

                    <Svg width={DONUT_SIZE} height={DONUT_SIZE} viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}>
                        {/* 1. Grauer Hintergrund-Ring */}
                        <Circle
                            cx={DONUT_SIZE / 2}
                            cy={DONUT_SIZE / 2}
                            r={RADIUS}
                            stroke="#E5E5EA"
                            strokeWidth="6"
                            fill="transparent"
                        />
                        {/* 2. Farbiger Fortschritts-Ring (Startet oben bei 12 Uhr durch -90 Grad Rotation) */}
                        <AnimatedCircle
                            cx={DONUT_SIZE / 2}
                            cy={DONUT_SIZE / 2}
                            r={RADIUS}
                            stroke={color}
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={`${UMFANG} ${UMFANG}`}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round" // Schöne abgerundete Kanten am Balken-Ende
                            transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
                        />
                    </Svg>

                    {/* 3. Absolut zentrierter Text im Donut-Loch */}
                    <View style={styles.innerTextContainer}>
                        <Text style={styles.donutPercentText}>{Math.round(prozent)}%</Text>
                        <Text style={styles.donutValuesText}>{value}/{target}</Text>
                        <Text style={styles.donutUnitText}>{unit}</Text>
                    </View>

                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

export default function HomeScreen() {
    const router = useRouter();
    const [quote, setQuote] = useState('');
    const [wasser, setWasser] = useState(0);
    const [kcal, setKcal] = useState(0);
    const [protein, setProtein] = useState(0);

    useFocusEffect(
        useCallback(() => {
            setWasser(globalState.wasser || 0);
            setKcal(globalState.kcal || 0);
            setProtein(globalState.protein || 0);
        }, [])
    );

    React.useEffect(() => {
        const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
        setQuote(MOTIVATIONAL_QUOTES[randomIndex]);
    }, []);

    return (
        <View style={styles.container}>
            {/* Spruch des Tages */}
            <View style={styles.quoteCard}>
                <Text style={styles.quoteTitle}>🔥 Spruch des Tages</Text>
                <Text style={styles.quoteText}>{quote}</Text>
            </View>

            <Text style={styles.sectionTitle}>Tagesfortschritt</Text>

            {/* Grid-System */}
            <View style={styles.gridContainer}>

                {/* Reihe 1 */}
                <View style={styles.chartsRow}>
                    <PerfectSvgDonut
                        label="💧 Wasser"
                        value={wasser}
                        target={globalState.zielWasser}
                        color="#007AFF"
                        unit="ml"
                        onPress={() => router.push('/wasser')}
                    />
                    <PerfectSvgDonut
                        label="🍎 Kalorien"
                        value={kcal}
                        target={globalState.zielKcal}
                        color="#FF9500"
                        unit="kcal"
                        onPress={() => router.push('/makros')}
                    />
                </View>

                {/* Reihe 2 */}
                <View style={styles.chartsRow}>
                    <PerfectSvgDonut
                        label="💪 Protein"
                        value={protein}
                        target={globalState.zielProtein || 150}
                        color="#4CD964"
                        unit="g"
                        onPress={() => router.push('/makros')}
                    />

                    {/* Workout-Kachel */}
                    <TouchableOpacity
                        style={styles.gridCard}
                        onPress={() => router.push('/training')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.trainingCardContent}>
                            <Text style={styles.chartTitleWorkout}>🏋️‍♂️ Workout</Text>
                            <View style={styles.trainingCenterBlock}>
                                <Text style={styles.trainingEmoji}>💪</Text>
                                <Text style={styles.trainingStatusText}>Nächstes Training</Text>
                            </View>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>Aktivieren ➔</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
    quoteCard: { backgroundColor: '#fff', padding: 18, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
    quoteTitle: { fontSize: 12, fontWeight: '700', color: '#6c757d', marginBottom: 4, textTransform: 'uppercase' },
    quoteText: { fontSize: 15, fontStyle: 'italic', color: '#212529', lineHeight: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#212529', paddingLeft: 2 },

    gridContainer: { width: '100%' },
    chartsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12 },

    gridCard: { flex: 1, backgroundColor: '#fff', padding: 14, borderRadius: 16, marginHorizontal: 6, elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, minHeight: width * 0.44, justifyContent: 'space-between' },
    cardAnimatedContent: { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
    chartTitle: { fontSize: 14, fontWeight: '700', color: '#495057', alignSelf: 'flex-start', marginBottom: 6 },
    chartTitleWorkout: { fontSize: 14, fontWeight: '700', color: '#495057', alignSelf: 'flex-start' },

    innerTextContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
    donutPercentText: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
    donutValuesText: { fontSize: 9, fontWeight: '600', color: '#6c757d', marginTop: 1, textAlign: 'center' },
    donutUnitText: { fontSize: 10, fontWeight: '700', color: '#8e8e93' },

    trainingCardContent: { flex: 1, alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    trainingCenterBlock: { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 4 },
    trainingEmoji: { fontSize: 24, marginBottom: 2 },
    trainingStatusText: { fontSize: 12, fontWeight: '600', color: '#6c757d', textAlign: 'center' },
    badge: { backgroundColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 12, width: '100%', alignItems: 'center' },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' }
});