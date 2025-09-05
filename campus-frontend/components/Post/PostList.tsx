import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import Colors from "@/data/Colors";
import AntDesign from '@expo/vector-icons/AntDesign';
import moment from "moment";
export type Post = {
  id: number;
  content: string;
  imageurl: string | null;
  visiblein: string;
  createdon: string;
  createdby: string;
  name: string;
  email: string;
  image: string | null;
};

export default function PostList({ posts }: { posts: Post[] }) {
  const [refreshing, setRefreshing] = useState(false);
  
 
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const renderItem = ({ item }: { item: Post }) => (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        marginVertical: 8,
        marginHorizontal: 12,
        padding: 12,
        borderRadius: 12,
        shadowColor: Colors.GRAY,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Author */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 8 }}
          />
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.SECONDARY,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <Text style={{ color: Colors.WHITE, fontWeight: "bold" }}>
              {item.name[0]}
            </Text>
          </View>
        )}
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 16, color: Colors.PRIMARY }}>
            {item.name}
          </Text>
          <Text style={{ color: Colors.GRAY, fontSize: 12 }}>{moment(item.createdon).fromNow()}</Text>
        </View>
      </View>

      {/* Content */}
      <Text style={{ fontSize: 14, marginBottom: 6, color: "black" }}>
        {item.content}
      </Text>

      {/* Post Image */}
      {item.imageurl && (
        <Image
          source={{ uri: item.imageurl }}
          style={{
            width: "100%",
            height: 180,
            borderRadius: 10,
            marginTop: 6,
            backgroundColor: Colors.TERTIARY,
          }}
          resizeMode="cover"
        />
      )}
      {/* Like and comment section*/ }
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            marginTop: 10,
            borderTopWidth: 1,
            gap: 20,
            
            paddingTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <AntDesign name="like2" size={16} color={Colors.GRAY} />
            <Text style={{ color: Colors.GRAY ,fontSize:12 }}>25</Text>
            
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <AntDesign name="message1" size={16} color={Colors.GRAY} />
            <Text style={{ color: Colors.GRAY ,fontSize:12 }}>10</Text>
            
          </View>
          
        </View>
      </View>

      
     

    </View>
  );

  return (
    <FlatList
  data={posts}
  keyExtractor={(item, index) => `${item.id}-${index}`} 
  renderItem={renderItem}
  refreshing={refreshing}
  onRefresh={onRefresh}
/>

  );
}
