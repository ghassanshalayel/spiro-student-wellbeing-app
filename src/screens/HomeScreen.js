// src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { applyPetDecay, getPet, setPetName } from "../backend/Pet";

export default function HomeScreen() {
  const [pet, setPet] = useState(null);
  const [nameDraft, setNameDraft] = useState("");

  useEffect(() => {
    (async () => {
      await applyPetDecay();
      const p = await getPet();
      setPet(p);
      setNameDraft(p.name ?? "");
    })();
  }, []);

  if (!pet) return <View style={styles.page}><Text style={styles.text}>Loading…</Text></View>;

  const happinessPct = Math.max(0, Math.min(100, pet.happiness ?? 0));

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Spiro</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Pet name</Text>
        <TextInput
          value={nameDraft}
          onChangeText={setNameDraft}
          style={styles.input}
          placeholder="Enter pet name"
        />

        <Pressable
          accessibilityRole="button"
          style={styles.primaryBtn}
          onPress={async () => {
            const updated = await setPetName(nameDraft);
            setPet(updated);
          }}
        >
          <Text style={styles.primaryBtnText}>Save name</Text>
        </Pressable>

        <View style={styles.row}>
          <Text style={styles.text}>Stage: {pet.stage}</Text>
          <Text style={styles.text}>Happiness: {happinessPct}%</Text>
        </View>

        <View style={styles.barOuter} accessibilityLabel="Happiness bar">
          <View style={[styles.barInner, { width: `${happinessPct}%` }]} />
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.secondaryBtn}
          onPress={() => {
            // Later: navigate to Walk/Map screen
            // For now: keep as placeholder hook
          }}
        >
          <Text style={styles.secondaryBtnText}>Start walk</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, justifyContent: "flex-start" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 12 },
  card: { padding: 16, borderWidth: 1, borderRadius: 12 },
  label: { fontSize: 14, marginBottom: 6 },
  text: { fontSize: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, gap: 10 },
  barOuter: { height: 12, borderWidth: 1, borderRadius: 999, marginTop: 8, overflow: "hidden" },
  barInner: { height: "100%" },

  // Minimum tap size guidance: make buttons comfortably >44px tall :contentReference[oaicite:9]{index=9}
  primaryBtn: { minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: 10, marginTop: 6, borderWidth: 1 },
  primaryBtnText: { fontSize: 16, fontWeight: "600" },
  secondaryBtn: { minHeight: 48, alignItems: "center", justifyContent: "center", borderRadius: 10, marginTop: 12, borderWidth: 1 },
  secondaryBtnText: { fontSize: 16, fontWeight: "600" },
});