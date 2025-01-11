import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState("system"); // 'dark', 'light', or 'system'
  const [activeTheme, setActiveTheme] = useState(systemColorScheme);

  useEffect(() => {
    // Fetch saved theme from storage
    const fetchTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("appTheme");
      if (savedTheme) {
        setTheme(savedTheme);
        setActiveTheme(
          savedTheme === "system" ? systemColorScheme : savedTheme
        );
      }
    };
    fetchTheme();
  }, [systemColorScheme]);

  const updateTheme = async (selectedTheme) => {
    setTheme(selectedTheme);
    await AsyncStorage.setItem("appTheme", selectedTheme);
    setActiveTheme(
      selectedTheme === "system" ? systemColorScheme : selectedTheme
    );
  };

  const isDarkMode = activeTheme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#333" : "#FFF" },
      ]}
    >
      <Text style={[styles.title, { color: isDarkMode ? "#FFF" : "#000" }]}>
        Choose Theme:
      </Text>
      <TouchableOpacity
        style={[styles.button, theme === "light" && styles.activeButton]}
        onPress={() => updateTheme("light")}
      >
        <Text style={styles.buttonText}>Light Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, theme === "dark" && styles.activeButton]}
        onPress={() => updateTheme("dark")}
      >
        <Text style={styles.buttonText}>Dark Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, theme === "system" && styles.activeButton]}
        onPress={() => updateTheme("system")}
      >
        <Text style={styles.buttonText}>Follow System</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#FF69B4", // Hot pink color
    paddingVertical: 15,
    marginTop: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: "#FF1493", // Darker pink for active selection
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
