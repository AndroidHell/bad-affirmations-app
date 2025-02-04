import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Share,
} from "react-native";
import * as Clipboard from "expo-clipboard"; // ✅ Clipboard module is back
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BadAffirmationScreen() {
  const [affirmation, setAffirmation] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchDailyAffirmation = async () => {
      const today = new Date().toISOString().split("T")[0];
      const storedAffirmation = await AsyncStorage.getItem(
        "badDailyAffirmation"
      );
      const storedDate = await AsyncStorage.getItem("badAffirmationDate");

      if (storedDate === today && storedAffirmation) {
        setAffirmation(storedAffirmation);
      } else {
        const randomAffirmation = await fetchRandomAffirmation();
        if (randomAffirmation) {
          setAffirmation(randomAffirmation);
          await AsyncStorage.setItem("badDailyAffirmation", randomAffirmation);
          await AsyncStorage.setItem("badAffirmationDate", today);
        }
      }
      setLoading(false);
    };

    fetchDailyAffirmation();
  }, []);

  const fetchRandomAffirmation = async () => {
    try {
      const response = await fetch(
        "https://bad-affirmations-api.netlify.app/.netlify/functions/BadAffirmations"
      );
      const data = await response.json();
      const affirmations = data.BadAffirmations;
      return affirmations[Math.floor(Math.random() * affirmations.length)];
    } catch (error) {
      console.error("Error fetching affirmations:", error);
      return null;
    }
  };

  const fetchNewAffirmation = async () => {
    setLoading(true);
    const randomAffirmation = await fetchRandomAffirmation();
    if (randomAffirmation) {
      setAffirmation(randomAffirmation);
      const today = new Date().toISOString().split("T")[0];
      await AsyncStorage.setItem("badDailyAffirmation", randomAffirmation);
      await AsyncStorage.setItem("badAffirmationDate", today);
    }
    setLoading(false);
  };

  const handleCopyAffirmation = async () => {
    await Clipboard.setStringAsync(affirmation); // ✅ Now using Clipboard correctly
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const emojis = ["💀", "😞", "😢", "😔", "😖", "😿", " 🥀", "💔", "🥺"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    try {
      await Share.share({
        message: `[${randomEmoji}] Today's bad affirmation: ${
          affirmation || "No affirmation available."
        }`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const affirmationTextColor = colorScheme === "dark" ? "#FFF" : "#333";

  return (
    <Pressable style={styles.overlay} onPress={() => setCopied(false)}>
      <View style={styles.container}>
        {loading ? <ActivityIndicator size="large" color="#FF69B4" /> : null}

        <Pressable onLongPress={handleCopyAffirmation}>
          <Text
            style={[
              styles.affirmationText,
              {
                color: affirmationTextColor,
                fontWeight: copied ? "bold" : "normal",
              },
            ]}
          >
            {affirmation || "No affirmation available."}
          </Text>
        </Pressable>

        {copied && <Text style={styles.copyPopup}>Copied!</Text>}

        <View style={styles.buttonCluster}>
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={fetchNewAffirmation}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{"Get a new bad affirmation"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Ionicons name="share-social" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  affirmationText: {
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 20,
    color: "#333",
  },
  copyPopup: {
    position: "absolute",
    top: "40%",
    backgroundColor: "lightgray",
    color: "hotpink",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonCluster: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 16,
    marginTop: 80,
    gap: 20,
  },
  button: {
    backgroundColor: "#FF69B4",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  iconButton: {
    backgroundColor: "#FF69B4",
    padding: 15,
    borderRadius: 25,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
