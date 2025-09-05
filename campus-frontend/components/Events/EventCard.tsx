import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { router } from "expo-router";
type EVENT = {
    id: number;
    name: string;
    banner?: string; 
    location: string;
    event_date: string;
    event_time: string;
    created_by: string;
    details: string;
    username: string;
};

export default function EventCard(event: EVENT) {
    const hasBanner = event.banner && event.banner.trim() !== "";
    const { user } = useContext(AuthContext);
    const [registered, setRegistered] = useState(false);
    const eventId = event.id;
    const email = user?.email;
    useEffect(() => {
        const checkRegistration = async () => {
            try {
                const res = await axios.post(
                    process.env.EXPO_PUBLIC_HOST + "/api/checkregistration",
                    { eventId, email } // <- goes in body now
                );
                setRegistered(res.data.registered);
            } catch (err) {
                console.error("Check registration error:", err);
            }
        };

        if (email) checkRegistration();
    }, [eventId, email]);


    const registerEvent = (eventId: number, email?: string | null) => {
  if (!email) {
    Alert.alert("Error", "No email found. Please log in first.");
    return;
  }

  Alert.alert(
    "Do you want to register for this event?",
    "",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const res = await axios.post(
              process.env.EXPO_PUBLIC_HOST + "/api/eventregister",
              { eventId, email }
            );
            Alert.alert("Success", "You have been registered successfully!");
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Registration failed. Please try again.");
          }
        },
      },
    ]
  );
};

    return (
        <View
            style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                marginVertical: 10,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 4,
                overflow: "hidden",
            }}
        >
            {hasBanner ? (
                <Image
                    source={{ uri: event.banner }}
                    style={{
                        width: "100%",
                        height: 180,
                    }}
                    resizeMode="cover"
                />
            ) : (
                <View
                    style={{
                        width: "100%",
                        height: 180,
                        backgroundColor: "#e0e0e0",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: "600", color: "#555" }}>
                        {event.name}
                    </Text>
                </View>
            )}

            <View style={{ padding: 12 }}>
                {!hasBanner && (
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 6 }}>
                        {event.name}
                    </Text>
                )}
                <Text style={{ fontSize: 16, color: "#444" }}>
                    📍 {event.location}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>
                    🗓 {event.event_date} at {event.event_time}
                </Text>
                <Text style={{ fontSize: 14, marginTop: 4, color: "#333" }}>
                    {event.details}
                </Text>

                <TouchableOpacity
                    disabled={registered}
                    style={{
                        marginTop: 10,
                        backgroundColor: registered ? "#ccc" : "#007AFF",
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: "center",
                    }}
                    onPress={() => registerEvent(eventId, email)}
                >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                        {registered ? "Registered" : "Register"}
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}
