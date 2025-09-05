import { View, Text, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Button from '@/components/Shared/Button'
import { router } from 'expo-router'
import axios from 'axios'
import EventCard from '@/components/Events/EventCard'
import { AuthContext } from '@/context/AuthContext'

export default function Event() {
  const [eventList, setEventList] = useState();
  const [loading, setLoading] = useState(false);
  const {user}=useContext(AuthContext);
  useEffect(() => {
    getAllEvents();
  }, []);

  const getAllEvents = async () => {
    setLoading(true);
    const events = await axios.get(process.env.EXPO_PUBLIC_HOST + '/api/events');
    setEventList(events.data);
    console.log(events.data);
    setLoading(false);
  };
  
  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 15
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Events</Text>
        <Button text=" + " onPress={() => router.push('/add-event')} />
      </View>

      {/* Scrollable List */}
      <FlatList
        data={eventList}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={getAllEvents}
        refreshing={loading}
        renderItem={({ item }) => <EventCard {...item} />}
        contentContainerStyle={{ paddingBottom: 50 }} // adds bottom space
      />
    </View>
  );
}
