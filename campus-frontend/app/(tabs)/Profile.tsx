import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [image, setImage] = useState(user?.image || null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      // Upload to Cloudinary
      const uploadedUrl = await uploadImage(localUri);
      if (uploadedUrl) {
        // Update in backend DB
        await updateProfileImage(uploadedUrl);
        setImage(uploadedUrl);
      }
    }
  };

  const uploadImage = async (imageUri: string) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "upload.jpg",
      } as any);
      formData.append("upload_preset", "joluplex"); // your Cloudinary unsigned preset

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const updateProfileImage = async (uploadedUrl: string) => {
    try {
      const res = await axios.put(
        process.env.EXPO_PUBLIC_HOST + "/api/updateProfileImage",
        {
          email: user?.email,
          image: uploadedUrl,
        }
      );
      Alert.alert("Success", "Profile picture updated!");
      console.log("Updated user:", res.data.user);
    } catch (err) {
      console.error("Update DB error:", err);
      Alert.alert("Error", "Failed to update profile picture in DB.");
    }
  };
  
  return (
    
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Profile</Text>

      {/* Profile Card */}
      <View style={styles.card}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              image
                ? { uri: image }
                : require("@/assets/images/profile.png")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.name}>{user?.name || "Guest User"}</Text>
        <Text style={styles.email}>{user?.email || "No Email"}</Text>
      </View>

      {/* Stats or Extra Info */}
      <View style={styles.infoBox}>
        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>12</Text>
          <Text style={styles.infoLabel}>Events</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>5</Text>
          <Text style={styles.infoLabel}>Registered</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Name</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logout]} onPress={logout}>
        <Text style={[styles.buttonText, { color: "#fff" }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "flex-start",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#777",
    marginTop: 4,
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  infoItem: {
    alignItems: "center",
  },
  infoNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  infoLabel: {
    fontSize: 14,
    color: "#777",
  },
  button: {
    width: "100%",
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 6,
  },
  logout: {
    backgroundColor: "#e63946",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
