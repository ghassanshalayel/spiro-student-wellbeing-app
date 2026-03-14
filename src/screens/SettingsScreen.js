import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  getAppSettings,
  updateAge,
  updateUsername,
  updateDifficulty,
  updateTheme,
  updateDailyStepGoal,
  DIFFICULTIES,
  THEMES,
} from "../backend/Settings";

const THEME_STYLES = {
  Light: {
    pageBg: "#E8EEF9",
    cardBg: "#FFFFFF",
    text: "#1E293B",
    subText: "#475569",
    border: "#CBD5E1",
    primaryBtn: "#3567B7",
    primaryBtnText: "#FFFFFF",
    inputBg: "#F8FAFC",
    selectedBg: "#DBEAFE",
    selectedBorder: "#3567B7",
    optionBg: "#FFFFFF",
    optionText: "#0F172A",
    summaryBg: "#E2E8F0",
    success: "#166534",
    error: "#DC2626",
  },
  Dark: {
    pageBg: "#0F172A",
    cardBg: "#1E293B",
    text: "#F8FAFC",
    subText: "#CBD5E1",
    border: "#334155",
    primaryBtn: "#60A5FA",
    primaryBtnText: "#0F172A",
    inputBg: "#0F172A",
    selectedBg: "#1D4ED8",
    selectedBorder: "#60A5FA",
    optionBg: "#1E293B",
    optionText: "#F8FAFC",
    summaryBg: "#334155",
    success: "#86EFAC",
    error: "#FCA5A5",
  },
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    username: "User",
    age: 0,
    difficulty: "Beginner",
    dailyStepGoal: 5000,
    theme: "Light",
  });

  const [usernameDraft, setUsernameDraft] = useState("");
  const [ageDraft, setAgeDraft] = useState("");
  const [goalDraft, setGoalDraft] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const refreshSettings = useCallback(async () => {
    const appSettings = await getAppSettings();
    setSettings(appSettings);
    setUsernameDraft(String(appSettings.username));
    setAgeDraft(String(appSettings.age));
    setGoalDraft(String(appSettings.dailyStepGoal));
    setStatusMessage("");
    setErrorMessage("");
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshSettings();
    }, [refreshSettings])
  );

  const handleSaveUsername = async () => {
    const success = await updateUsername(usernameDraft, (newUsername) => {
      setSettings((prev) => ({ ...prev, username: newUsername }));
    });

    if (!success) {
      setErrorMessage("Could not save username. Use 1–20 characters.");
      setStatusMessage("");
      return;
    }

    setStatusMessage("Username saved.");
    setErrorMessage("");
  };

  const handleSaveAge = async () => {
    const success = await updateAge(ageDraft, (newAge) => {
      setSettings((prev) => ({ ...prev, age: newAge }));
    });

    if (!success) {
      setErrorMessage("Could not save age. Enter a number between 0 and 100.");
      setStatusMessage("");
      return;
    }

    setStatusMessage("Age saved.");
    setErrorMessage("");
  };

  const handleSaveGoal = async () => {
    const success = await updateDailyStepGoal(goalDraft, (newGoal) => {
      setSettings((prev) => ({ ...prev, dailyStepGoal: newGoal }));
    });

    if (!success) {
      setErrorMessage("Could not save step goal. Use 1000–100000.");
      setStatusMessage("");
      return;
    }

    setStatusMessage("Daily step goal saved.");
    setErrorMessage("");
  };

  const handleSetTheme = async (newTheme) => {
    const success = await updateTheme(newTheme, (savedTheme) => {
      setSettings((prev) => ({ ...prev, theme: savedTheme }));
    });

    if (!success) {
      setErrorMessage("Could not update theme.");
      setStatusMessage("");
      return;
    }

    setStatusMessage(`Theme changed to ${newTheme}.`);
    setErrorMessage("");
  };

  const handleSetDifficulty = async (newDifficulty) => {
    const success = await updateDifficulty(newDifficulty, (savedDifficulty) => {
      setSettings((prev) => ({ ...prev, difficulty: savedDifficulty }));
    });

    if (!success) {
      setErrorMessage("Could not update difficulty.");
      setStatusMessage("");
      return;
    }

    setStatusMessage(`Difficulty changed to ${newDifficulty}.`);
    setErrorMessage("");
  };

  const themeName = settings.theme === "Dark" ? "Dark" : "Light";
  const theme = THEME_STYLES[themeName];

  return (
    <ScrollView
      style={{ backgroundColor: theme.pageBg }}
      contentContainerStyle={[styles.container, { backgroundColor: theme.pageBg }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.text }]}>Username</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.border,
              backgroundColor: theme.inputBg,
              color: theme.text,
            },
          ]}
          value={usernameDraft}
          onChangeText={setUsernameDraft}
          placeholder="Enter username"
          placeholderTextColor={theme.subText}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleSaveUsername}
        />
        <Pressable
          style={[styles.saveButton, { backgroundColor: theme.primaryBtn }]}
          onPress={handleSaveUsername}
        >
          <Text style={[styles.saveButtonText, { color: theme.primaryBtnText }]}>
            Save Username
          </Text>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.text }]}>Age</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.border,
              backgroundColor: theme.inputBg,
              color: theme.text,
            },
          ]}
          value={ageDraft}
          onChangeText={setAgeDraft}
          placeholder="Enter age"
          placeholderTextColor={theme.subText}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={handleSaveAge}
        />
        <Pressable
          style={[styles.saveButton, { backgroundColor: theme.primaryBtn }]}
          onPress={handleSaveAge}
        >
          <Text style={[styles.saveButtonText, { color: theme.primaryBtnText }]}>
            Save Age
          </Text>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.text }]}>Daily Step Goal</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.border,
              backgroundColor: theme.inputBg,
              color: theme.text,
            },
          ]}
          value={goalDraft}
          onChangeText={setGoalDraft}
          placeholder="Enter step goal"
          placeholderTextColor={theme.subText}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={handleSaveGoal}
        />
        <Pressable
          style={[styles.saveButton, { backgroundColor: theme.primaryBtn }]}
          onPress={handleSaveGoal}
        >
          <Text style={[styles.saveButtonText, { color: theme.primaryBtnText }]}>
            Save Step Goal
          </Text>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.text }]}>Theme</Text>
        <View style={styles.row}>
          {THEMES.map((themeOption) => (
            <Pressable
              key={themeOption}
              style={[
                styles.optionButton,
                {
                  backgroundColor: theme.optionBg,
                  borderColor: theme.border,
                },
                settings.theme === themeOption && {
                  backgroundColor: theme.selectedBg,
                  borderColor: theme.selectedBorder,
                },
              ]}
              onPress={() => handleSetTheme(themeOption)}
            >
              <Text style={[styles.optionButtonText, { color: theme.optionText }]}>
                {themeOption}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.text }]}>Difficulty</Text>
        <View style={styles.wrapRow}>
          {DIFFICULTIES.map((level) => (
            <Pressable
              key={level}
              style={[
                styles.optionButton,
                {
                  backgroundColor: theme.optionBg,
                  borderColor: theme.border,
                },
                settings.difficulty === level && {
                  backgroundColor: theme.selectedBg,
                  borderColor: theme.selectedBorder,
                },
              ]}
              onPress={() => handleSetDifficulty(level)}
            >
              <Text style={[styles.optionButtonText, { color: theme.optionText }]}>
                {level}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: theme.summaryBg, borderColor: theme.border }]}>
        <Text style={[styles.summaryTitle, { color: theme.text }]}>Current Settings</Text>
        <Text style={[styles.summaryText, { color: theme.subText }]}>
          Username: {settings.username}
        </Text>
        <Text style={[styles.summaryText, { color: theme.subText }]}>
          Age: {settings.age}
        </Text>
        <Text style={[styles.summaryText, { color: theme.subText }]}>
          Daily Step Goal: {settings.dailyStepGoal}
        </Text>
        <Text style={[styles.summaryText, { color: theme.subText }]}>
          Theme: {settings.theme}
        </Text>
        <Text style={[styles.summaryText, { color: theme.subText }]}>
          Difficulty: {settings.difficulty}
        </Text>
      </View>

      {!!statusMessage && (
        <Text style={[styles.feedbackText, { color: theme.success }]}>
          {statusMessage}
        </Text>
      )}

      {!!errorMessage && (
        <Text style={[styles.errorText, { color: theme.error }]}>
          {errorMessage}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
  },

  saveButton: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },

  saveButtonText: {
    fontWeight: "700",
    fontSize: 15,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  optionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  summaryCard: {
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    borderWidth: 1,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  summaryText: {
    fontSize: 15,
    marginBottom: 4,
  },

  feedbackText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },

  errorText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },
});