import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function BadAffirmationScreen() {
  const [affirmation, setAffirmation] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchDailyAffirmation = async () => {
      const today = new Date().toISOString().split("T")[0];
      const storedAffirmation = await AsyncStorage.getItem(
        "goodDailyAffirmation"
      );
      const storedDate = await AsyncStorage.getItem("goodAffirmationDate");

      if (storedDate === today && storedAffirmation) {
        setAffirmation(storedAffirmation);
      } else {
        const randomAffirmation = await fetchRandomAffirmation();
        if (randomAffirmation) {
          setAffirmation(randomAffirmation);
          await AsyncStorage.setItem("goodDailyAffirmation", randomAffirmation);
          await AsyncStorage.setItem("goodAffirmationDate", today);
        }
      }
      setLoading(false); // Stop loading after fetching
    };

    fetchDailyAffirmation();
  }, []);

  // const fetchRandomAffirmation = () => {
  //   return affirmations[Math.floor(Math.random() * affirmations.length)];
  // };

  const fetchRandomAffirmation = async () => {
    try {
      const response = await fetch(
        "https://bad-affirmations-api.netlify.app/.netlify/functions/GoodAffirmations"
      );
      const data = await response.json();
      const affirmations = data.GoodAffirmations; // Use the correct key here
      return affirmations[Math.floor(Math.random() * affirmations.length)];
    } catch (error) {
      console.error("Error fetching affirmations:", error);
      return null; // Handle error by returning null
    }
  };

  const fetchNewAffirmation = async () => {
    setLoading(true); // Show loading spinner while fetching
    const randomAffirmation = await fetchRandomAffirmation();
    if (randomAffirmation) {
      setAffirmation(randomAffirmation);
      const today = new Date().toISOString().split("T")[0];
      await AsyncStorage.setItem("goodDailyAffirmation", randomAffirmation);
      await AsyncStorage.setItem("goodAffirmationDate", today);
    }
    setLoading(false); // Stop loading after fetching
  };

  const affirmationTextColor = colorScheme === "dark" ? "#FFF" : "#333";

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF69B4" /> // Show a spinner while loading
      ) : (
        <>
          <Text
            style={[styles.affirmationText, { color: affirmationTextColor }]}
          >
            {affirmation || "No affirmation available."}
          </Text>
          <TouchableOpacity style={styles.button} onPress={fetchNewAffirmation}>
            <Text style={styles.buttonText}>Get a new shitty affirmation</Text>
          </TouchableOpacity>
        </>
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: "#FF69B4", // Hot pink color
    paddingVertical: 15,
    marginTop: 80,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
