// src/screens/HomeScreen.js
//TODO:
// add customisable pet options
//make this the new landing page
import React, { useCallback,  useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { getPet, setPetName, getStoredData, resetData } from "../backend/Initialiser";
import { startStepCounter, stopStepCounter } from "../backend/Steps";
import { getWeatherData } from "../backend/Weather";

//LIGHT/DARK THEMES:

const THEMES = {
  Light: {
    pageBg: "#E8EEF9",
    cardBg: "#FFFFFF",
    text: "#1E293B",
    subText: "#475569",
    border: "#CBD5E1",
    barBg: "#E2E8F0",
    barDark: "#111827",
    barBlue: "#3567B7",
    barYellow: "#F2C94C",
    primaryBtn: "#3567B7",
    primaryBtnBorder: "#2E5BA3",
    primaryBtnText: "#FFFFFF",
    secondaryBtn: "#FFFFFF",
    secondaryBtnBorder: "#3567B7",
    secondaryBtnText: "#3567B7",
    iconLight: "#FFFFFF",
    iconDark: "#111827",
    badgeBg: "#F2C94C",
    badgeBorder: "#D4A72C",
    inputBg: "#F8FAFC",
  },
  Dark: {
    pageBg: "#0F172A",
    cardBg: "#1E293B",
    text: "#F8FAFC",
    subText: "#CBD5E1",
    border: "#334155",
    barBg: "#334155",
    barDark: "#94A3B8",
    barBlue: "#60A5FA",
    barYellow: "#FACC15",
    primaryBtn: "#60A5FA",
    primaryBtnBorder: "#3B82F6",
    primaryBtnText: "#0F172A",
    secondaryBtn: "#1E293B",
    secondaryBtnBorder: "#60A5FA",
    secondaryBtnText: "#60A5FA",
    iconLight: "#FFFFFF",
    iconDark: "#0F172A",
    badgeBg: "#FACC15",
    badgeBorder: "#EAB308",
    inputBg: "#0F172A",
  },
};

export default function HomeScreen({ navigation }) {
  const [pet, setPet] = useState(null);
  const [appData, setAppData] = useState(null);
  const [nameDraft, setNameDraft] = useState("");
  const [walking, setWalking] = useState(false);
  const [dailySteps, setDailySteps] = useState(0);
  const [editingName, setEditingName] = useState(false);

  const refreshData = useCallback(async () => {
    const loadedPet = await getPet();
    const loadedData = await getStoredData();
    
    setPet(loadedPet);
    setAppData(loadedData);
    setDailySteps(loadedData?.stats?.dailySteps ?? 0);
    setNameDraft(loadedPet?.name ?? "");
  }, []); 

  useFocusEffect(
    useCallback(() => {
      refreshData();

      return () => {
        stopStepCounter();
      };
    }, [refreshData]) 
  );

  if (!pet || !appData) {
    return (
      <View style={[styles.page, { backgroundColor: THEMES.Light.pageBg }]}>
        <Text style={[styles.title, { color: THEMES.Light.text }]}>Spiro</Text>
        <Text style={[styles.loadingText, { color: THEMES.Light.text }]}>Loading…</Text>
      </View>
    );
  }

  const themeName = appData?.settings?.theme === "Dark" ? "Dark" : "Light";
  const theme = THEMES[themeName];

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

  const activities = (appData?.geoNotes?.length ?? 0) + (appData?.natureGallery?.length ?? 0);
  
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
    <ScrollView
      style={[styles.page, { backgroundColor: theme.pageBg }]}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Spiro</Text>

      <View
        style={[
          styles.topCard,
          { backgroundColor: theme.cardBg, borderColor: theme.border },
        ]}
      >
        <View style={styles.topRow}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>Level {level}</Text>
          <Text style={[styles.infoLabel, { color: theme.text }]}>
            {activities} Activities
          </Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, { color: theme.text }]}>XP</Text>
            <Text style={[styles.progressValue, { color: theme.subText }]}>
              {currentXp} / 100 ({xpPct}%)
            </Text>
          </View>
          <View style={[styles.barOuter, { backgroundColor: theme.barBg, borderColor: theme.border }]}>
            <View style={[styles.barFill, { width: `${xpPct}%`, backgroundColor: theme.barDark }]} />
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, { color: theme.text }]}>Daily Goal</Text>
            <Text style={[styles.progressValue, { color: theme.subText }]}>
              {dailySteps} / {dailyGoal} ({goalPct}%)
            </Text>
          </View>
          <View style={[styles.barOuter, { backgroundColor: theme.barBg, borderColor: theme.border }]}>
            <View style={[styles.barFill, { width: `${goalPct}%`, backgroundColor: theme.barBlue }]} />
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, { color: theme.text }]}>Happiness</Text>
            <Text style={[styles.progressValue, { color: theme.subText }]}>
              {happinessPct}%
            </Text>
          </View>
          <View style={[styles.barOuter, { backgroundColor: theme.barBg, borderColor: theme.border }]}>
            <View style={[styles.barFill, { width: `${happinessPct}%`, backgroundColor: theme.barYellow }]} />
          </View>
        </View>
      </View>

      <View style={styles.petArea}>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder },
          ]}
        >
          <Text style={[styles.levelBadgeText, { color: theme.iconDark }]}>{level}</Text>
        </View>

        <Text style={styles.petEmoji}>🐬</Text>

        {!editingName ? (
          <View style={styles.nameRow}>
            <Text style={[styles.petName, { color: theme.text }]}>
              {pet.name?.trim() ? pet.name : "Unnamed Pet"}
            </Text>
            <Pressable
              style={[
                styles.editNameBtn,
                { backgroundColor: theme.cardBg, borderColor: theme.border },
              ]}
              onPress={() => setEditingName(true)}
              accessibilityRole="button"
            >
              <Ionicons name="pencil-outline" size={18} color={theme.text} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.editRow}>
            <TextInput
              value={nameDraft}
              onChangeText={setNameDraft}
              style={[
                styles.nameInput,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.inputBg,
                  color: theme.text,
                },
              ]}
              placeholder="Enter pet name"
              placeholderTextColor={theme.subText}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleSaveName}
            />
            <Pressable
              style={[
                styles.smallSaveBtn,
                { backgroundColor: theme.primaryBtn },
              ]}
              onPress={handleSaveName}
            >
              <Text style={[styles.smallSaveBtnText, { color: theme.primaryBtnText }]}>
                Save
              </Text>
            </Pressable>
          </View>
        )}

        <Text style={[styles.petSubtitle, { color: theme.subText }]}>
          {walking ? "Currently walking" : rewardSummary}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        style={[
          styles.walkBtn,
          {
            backgroundColor: walking ? theme.secondaryBtn : theme.primaryBtn,
            borderColor: walking ? theme.secondaryBtnBorder : theme.primaryBtnBorder,
          },
        ]}
        onPress={handleWalkToggle}
      >
        <Text
          style={[
            styles.walkBtnText,
            { color: walking ? theme.secondaryBtnText : theme.primaryBtnText },
          ]}
        >
          {walking ? "Stop Walk" : "Start Walk"}
        </Text>
      </Pressable>

      <View style={styles.navRow}>
        <Pressable
          style={[
            styles.navBtn,
            { backgroundColor: theme.primaryBtn, borderColor: theme.primaryBtnBorder },
          ]}
          onPress={() => navigation.navigate("Map")}
        >
          <Ionicons name="map-outline" size={22} color={theme.iconLight} />
          <Text style={[styles.navBtnText, { color: theme.iconLight }]}>Map</Text>
        </Pressable>

        <Pressable
          style={[
            styles.navBtn,
            { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder },
          ]}
          onPress={() => navigation.navigate("Gallery")}
        >
          <Ionicons name="images-outline" size={22} color={theme.iconDark} />
          <Text style={[styles.navBtnText, { color: theme.iconDark }]}>Gallery</Text>
        </Pressable>

        <Pressable
          style={[
            styles.navBtn,
            { backgroundColor: theme.primaryBtn, borderColor: theme.primaryBtnBorder },
          ]}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="settings-outline" size={22} color={theme.iconLight} />
          <Text style={[styles.navBtnText, { color: theme.iconLight }]}>Settings</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

  pageContent: {
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 18,
    flexGrow: 1,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },

  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 40,
  },

  topCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 2,
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
  },

  progressValue: {
    fontSize: 13,
    fontWeight: "600",
  },

  barOuter: {
    height: 12,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
  },

  barFill: {
    height: "100%",
  },

  petArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minHeight: 280,
  },

  levelBadge: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },

  levelBadgeText: {
    fontSize: 16,
    fontWeight: "800",
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
  },

  editNameBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
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
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },

  smallSaveBtn: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  smallSaveBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },

  petSubtitle: {
    fontSize: 14,
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

  walkBtnText: {
    fontSize: 17,
    fontWeight: "800",
  },

  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  navBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 72,
    borderWidth: 2,
    gap: 4,
  },

  navBtnText: {
    fontWeight: "800",
    fontSize: 15,
  },
});