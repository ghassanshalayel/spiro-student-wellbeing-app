// src/screens/HomeScreen.js


//TODO:
// add customisable pet options
//make this the new landing page
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPet, setPetName, getStoredData } from "../backend/Initialiser";
import { startStepCounter, stopStepCounter } from "../backend/Steps";

export default function HomeScreen({ navigation }) {
  const [pet, setPet] = useState(null);
  const [appData, setAppData] = useState(null);
  const [nameDraft, setNameDraft] = useState("");
  const [walking, setWalking] = useState(false);
  const [dailySteps, setDailySteps] = useState(0);
  const [editingName, setEditingName] = useState(false);

  const refreshData = async () => {
    const loadedPet = await getPet();
    const loadedData = await getStoredData();

    setPet(loadedPet);
    setAppData(loadedData);
    setDailySteps(loadedData?.stats?.dailySteps ?? 0);
    setNameDraft(loadedPet?.name ?? "");
  };

  useEffect(() => {
    refreshData();

    return () => {
      stopStepCounter();
    };
  }, []);

  if (!pet || !appData) {
    return (
      <View style={styles.page}>
        <Text style={styles.title}>Spiro</Text>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  const happinessPct = Math.max(0, Math.min(100, pet.happiness ?? 0));
  const dailyGoal = appData?.settings?.dailyStepGoal ?? 5000;
  const level = appData?.stats?.level ?? 1;
  const currentXp = appData?.stats?.currentXp ?? 0;

  const goalPct =
    dailyGoal <= 0
      ? 0
      : Math.max(0, Math.min(100, Math.round((dailySteps / dailyGoal) * 100)));

  const xpPct = Math.max(0, Math.min(100, currentXp));
  const rewardSummary = `${100 - currentXp} XP until next level`;

  const handleWalkToggle = async () => {
    if (!walking) {
      setWalking(true);

      await startStepCounter((newValueOrUpdater) => {
        setDailySteps((prev) => {
          const next =
            typeof newValueOrUpdater === "function"
              ? newValueOrUpdater(prev)
              : newValueOrUpdater;
          return next;
        });
      });
    } else {
      await stopStepCounter();
      setWalking(false);
      await refreshData();
    }
  };

  const handleSaveName = async () => {
    const updatedPet = await setPetName(nameDraft);
    setPet(updatedPet);
    setEditingName(false);
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Spiro</Text>

      {/* Top stats card */}
      <View style={styles.topCard}>
        <View style={styles.topRow}>
          <Text style={styles.infoLabel}>Level {level}</Text>
          <Text style={styles.infoLabel}>Stage: {pet.stage}</Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>XP</Text>
            <Text style={styles.progressValue}>
              {currentXp} / 100 ({xpPct}%)
            </Text>
          </View>
          <View style={styles.barOuter}>
            <View style={[styles.barFillDark, { width: `${xpPct}%` }]} />
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Daily Goal</Text>
            <Text style={styles.progressValue}>
              {dailySteps} / {dailyGoal} ({goalPct}%)
            </Text>
          </View>
          <View style={styles.barOuter}>
            <View style={[styles.barFillBlue, { width: `${goalPct}%` }]} />
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Happiness</Text>
            <Text style={styles.progressValue}>{happinessPct}%</Text>
          </View>
          <View style={styles.barOuter}>
            <View style={[styles.barFillYellow, { width: `${happinessPct}%` }]} />
          </View>
        </View>
      </View>

      {/* Main pet area */}
      <View style={styles.petArea}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>{level}</Text>
        </View>

        <Text style={styles.petEmoji}>🐬</Text>

        {!editingName ? (
          <View style={styles.nameRow}>
            <Text style={styles.petName}>
              {pet.name?.trim() ? pet.name : "Unnamed Pet"}
            </Text>
            <Pressable
              style={styles.editNameBtn}
              onPress={() => setEditingName(true)}
              accessibilityRole="button"
            >
              <Ionicons name="pencil-outline" size={18} color="#1E293B" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.editRow}>
            <TextInput
              value={nameDraft}
              onChangeText={setNameDraft}
              style={styles.nameInput}
              placeholder="Enter pet name"
              placeholderTextColor="#6B7280"
            />
            <Pressable style={styles.smallSaveBtn} onPress={handleSaveName}>
              <Text style={styles.smallSaveBtnText}>Save</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.petSubtitle}>
          {walking ? "Currently walking" : rewardSummary}
        </Text>
      </View>

      {/* Main action */}
      <Pressable
        accessibilityRole="button"
        style={[styles.walkBtn, walking ? styles.stopBtn : styles.startBtn]}
        onPress={handleWalkToggle}
      >
        <Text style={[styles.walkBtnText, walking && styles.stopBtnText]}>
          {walking ? "Stop Walk" : "Start Walk"}
        </Text>
      </Pressable>

      {/* Bottom nav */}
      <View style={styles.navRow}>
        <Pressable style={styles.navBtnBlue} onPress={() => navigation.navigate("Map")}>
          <Ionicons name="map-outline" size={22} color="#FFFFFF" />
          <Text style={styles.navBtnTextLight}>Map</Text>
        </Pressable>

        <Pressable
          style={styles.navBtnYellow}
          onPress={() => navigation.navigate("Gallery")}
        >
          <Ionicons name="images-outline" size={22} color="#111827" />
          <Text style={styles.navBtnTextDark}>Gallery</Text>
        </Pressable>

        <Pressable
          style={styles.navBtnBlue}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
          <Text style={styles.navBtnTextLight}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#E8EEF9",
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#1E293B",
  },

  loadingText: {
    textAlign: "center",
    color: "#1E293B",
    fontSize: 18,
    marginTop: 40,
  },

  topCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    marginBottom: 14,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 10,
  },

  infoLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  progressSection: {
    marginTop: 8,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    gap: 10,
  },

  progressLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },

  progressValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },

  barOuter: {
    height: 12,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
    borderWidth: 1,
    borderColor: "#94A3B8",
  },

  barFillDark: {
    height: "100%",
    backgroundColor: "#111827",
  },

  barFillBlue: {
    height: "100%",
    backgroundColor: "#3567B7",
  },

  barFillYellow: {
    height: "100%",
    backgroundColor: "#F2C94C",
  },

  petArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  levelBadge: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F2C94C",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#D4A72C",
  },

  levelBadgeText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  petEmoji: {
    fontSize: 120,
    marginBottom: 8,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  petName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
  },

  editNameBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },

  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    marginBottom: 6,
  },

  nameInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#F8FAFC",
  },

  smallSaveBtn: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#3567B7",
    alignItems: "center",
    justifyContent: "center",
  },

  smallSaveBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  petSubtitle: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
    textAlign: "center",
  },

  walkBtn: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 2,
  },

  startBtn: {
    backgroundColor: "#3567B7",
    borderColor: "#2E5BA3",
  },

  stopBtn: {
    backgroundColor: "#FFFFFF",
    borderColor: "#3567B7",
  },

  walkBtnText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  stopBtnText: {
    color: "#3567B7",
  },

  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  navBtnBlue: {
    flex: 1,
    backgroundColor: "#3567B7",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 72,
    borderWidth: 2,
    borderColor: "#2E5BA3",
    gap: 4,
  },

  navBtnYellow: {
    flex: 1,
    backgroundColor: "#F2C94C",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 72,
    borderWidth: 2,
    borderColor: "#D4A72C",
    gap: 4,
  },

  navBtnTextLight: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },

  navBtnTextDark: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 15,
  },
});