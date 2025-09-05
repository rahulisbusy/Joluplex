import { Stack, router } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext, User } from "@/context/AuthContext";

export default function RootLayout() {
  const [user, setuser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
          setuser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Save user whenever it changes
  useEffect(() => {
    const saveUser = async () => {
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem("user");
      }
    };
    saveUser();
  }, [user]);

  // 🔹 Logout implementation
 const logout = async () => {
  try {
    setuser(undefined); // clear context
    await AsyncStorage.removeItem("user"); // clear storage
    // ❌ don't call router.replace here
  } catch (err) {
    console.error("Logout failed:", err);
  }
};


  if (loading) {
    return null; // ⏳ Optional: show splash/loading
  }

  return (
    <AuthContext.Provider value={{ user, setuser, logout }}>
      <Stack>
        <Stack.Screen name="landing" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-post/index" options={{ headerTitle: "Create Post" }} />
        <Stack.Screen name="explore-clubs/index" options={{ headerTitle: "Explore Clubs" }} />
        <Stack.Screen name="add-event/index" options={{ headerTitle: "Create an Event" }} />
      </Stack>
    </AuthContext.Provider>
  );
}
