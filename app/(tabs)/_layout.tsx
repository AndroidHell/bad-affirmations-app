import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Define theme colors
  const isDarkMode = colorScheme === "dark";
  const tabBarBackground = isDarkMode ? "#1a1a1a" : "white";
  const tabBarActiveTintColor = isDarkMode ? "hotpink" : "hotpink"; // Customize active tab color
  const tabBarInactiveTintColor = isDarkMode ? "#888" : "#888"; // Customize inactive tab color
  const headerBackgroundColor = isDarkMode ? "#1a1a1a" : "hotpink";
  const headerTextColor = isDarkMode ? "white" : "white";

  return (
    <Tabs
      screenOptions={{
        // Navbar Theme
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          backgroundColor: tabBarBackground, // Dynamic navbar background
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? "#333" : "lightgray", // Border for dark/light mode
        },
        tabBarActiveTintColor: tabBarActiveTintColor, // Dynamic active color
        tabBarInactiveTintColor: tabBarInactiveTintColor, // Dynamic inactive color

        // Header Theme
        headerStyle: {
          backgroundColor: headerBackgroundColor, // Dynamic header background
        },
        headerTintColor: headerTextColor, // Dynamic header text
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Bad Affirmations",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="frown-o" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Good Affirmations",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="smile-o" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
