import { onAuthStateChanged } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";
import { auth } from "@/configs/FireBaseConfig";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { router } from "expo-router";

export default function Index() {
  const { setuser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe only once
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const result = await axios.get(
            process.env.EXPO_PUBLIC_BASE_URL + "/api/user?email=" + firebaseUser.email
          );
          setuser(result.data);
          router.replace("/(tabs)/Home"); // ✅ send to home if logged in
        } catch (err) {
          console.error("Error fetching user:", err);
          router.replace("/landing"); // fallback
        }
      } else {
        router.replace("/landing"); // ✅ not logged in
      }
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ❌ don’t hardcode Redirect — the listener already handled routing
  return null;
}
