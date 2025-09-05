import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ScrollView, TextInput, ToastAndroid } from 'react-native';
import React, { useContext, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/data/Colors';
import { AuthContext } from '@/context/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '@/components/Shared/Button';
import axios from 'axios';
import { router } from 'expo-router';

export default function AddEvent() {
  const [image, setImage] = useState<string>();
  const [eventName, setEventName] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [eventDateTime, setEventDateTime] = useState<Date | null>(new Date());

  const [details, setDetails] = useState<string | null>();
  const { user } = useContext(AuthContext);
   
  // 👉 Create Event API call
  const uploadImage = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg", // or png
      name: "upload.jpg",
    } as any);
    formData.append("upload_preset", "joluplex"); // your unsigned preset

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log('data',data)
    console.log("Uploaded to Cloudinary:", data.secure_url);
    return data.secure_url;
  } catch (err) {
    console.error("Upload error:", err);
    return null;
  }
};
 const createEvent = async () => {
  try {
    let uploadedUrl = null;

    if (image) {
      uploadedUrl = await uploadImage(image);  // 👈 wait for Cloudinary
    }

    const formattedDate = eventDateTime
      ? eventDateTime.toISOString().split("T")[0]
      : null;

    const formattedTime = eventDateTime
      ? eventDateTime.toTimeString().slice(0, 5)
      : null;

    const result = await axios.post(
      process.env.EXPO_PUBLIC_HOST + "/api/events",
      {
        name: eventName,
        banner: uploadedUrl,   // 👈 real image url
        location: location,
        event_date: formattedDate,
        event_time: formattedTime,
        created_by: user?.email,
        details: details,
      }
    );

    console.log("Event created:", result.data);
    ToastAndroid.show("Event Created Successfully", ToastAndroid.BOTTOM);
    router.replace("/Events");
  } catch (err) {
    console.error("Error creating event:", err);
    ToastAndroid.show("Error creating Event", ToastAndroid.BOTTOM);
  }
};


  // 👉 Handle Date/Time Picker Change
  const onChange = (event: any, selectedDate?: Date) => {
  if (event.type === "dismissed") {
    setShowPicker(false);
    return;
  }

  if (selectedDate) {
    setEventDateTime(selectedDate);

    if (mode === "date") {
      // ✅ after picking a date, show time picker
      setMode("time");
      setShowPicker(true);
      return;
    }
  }

  setShowPicker(false);
};


  // 👉 Image Picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 👉 Format for display
  const formatDateTime = (date: Date) => {
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `${dateStr} at ${timeStr}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Event</Text>
        <Text style={styles.subtitle}>Fill in the details below to create your event</Text>
      </View>

      {/* Image Picker */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Event Image</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imageWrapper} activeOpacity={0.8}>
          <View style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderIcon}>📷</Text>
              </View>
            )}
            <View style={styles.imageOverlay}>
              <Text style={styles.imageText}>
                {image ? 'Tap to change image' : 'Tap to add image'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Event Details */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Event Details</Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.textInput}
            placeholder='Enter event name'
            placeholderTextColor={Colors.GRAY}
            onChangeText={(v) => setEventName(v)}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.textInput}
            placeholder='Enter event location'
            placeholderTextColor={Colors.GRAY}
            onChangeText={(v) => setLocation(v)}
          />
        </View>
        <TextInput
          placeholder='Share event details'
          style={styles.input}
          multiline={true}
          numberOfLines={5}
          maxLength={1000}
          onChangeText={(v) => setDetails(v)}
        />
      </View>

      {/* Date & Time */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Date & Time</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => {
            setMode('date');
            setShowPicker(true);
          }}
          activeOpacity={0.8}
        >
          <View style={styles.datePickerContent}>
            <Text style={styles.dateIcon}>📅</Text>
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateLabel}>Event Date & Time</Text>
              <Text style={styles.dateValue}>
                {eventDateTime ? formatDateTime(eventDateTime) : "Select date & time"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            mode={mode}
            value={eventDateTime || new Date()} // ✅ always Date object
            onChange={onChange}
            themeVariant="light"
          />
        )}
      </View>

      {/* Action Button */}
      <View style={styles.actionSection}>
        <Button
          text="Create Event"
          onPress={createEvent}
          //@ts-ignore
          style={styles.createButton}
        />
      </View>
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light background
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.GRAY,
    fontWeight: '400',
    lineHeight: 22,
  },
  section: {
    backgroundColor: Colors.WHITE,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.PRIMARY,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
  },
  image: {
    height: 160,
    width: 160,
    borderRadius: 16,
  },
  placeholderImage: {
    height: 160,
    width: 160,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
    color: Colors.PRIMARY,
    opacity: 0.7,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  imageText: {
    fontSize: 14,
    color: Colors.WHITE,
    textAlign: 'center',
    fontWeight: '500',
  },
  inputGroup: {
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY,   // subtle border
    borderRadius: 10,
    backgroundColor: Colors.WHITE,
    elevation: 2,               // Android shadow
    shadowColor: "#000",        // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  textInput: {
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    backgroundColor: Colors.WHITE,
    padding: 16,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.WHITE,
    padding: 10,
    marginTop: 10,
    height: 140,
    textAlignVertical: 'top',
    elevation: 7,
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: Colors.GRAY,
    fontWeight: '500',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  actionSection: {
    padding: 20,
    paddingBottom: 8,
  },
  createButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.GRAY,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});