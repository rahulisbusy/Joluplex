import { View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Emptystate from "@/components/Clubs/Emptystate";
import Clubposts from "@/components/Clubs/Clubposts";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import LoaderScreen from "@/components/Loader";

export default function Clubs() {
  const [followedClubs, setFollowedClubs] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const userEmail = user?.email;
  useEffect(()=>{
fetchFollowedClubs();

  },[])
  
  
  const fetchFollowedClubs = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get(
        process.env.EXPO_PUBLIC_HOST + "/api/followclub",
        { params: { u_email: userEmail } }
      );
      const clubs = res.data.data || [];
      setFollowedClubs(clubs);
      await fetchGroupPosts(clubs);
    } catch (err) {
      console.log("Failed to fetch followed clubs", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupPosts = async (clubs: any[]) => {
    try {
      const promises = clubs.map((club) =>
        axios.get(process.env.EXPO_PUBLIC_HOST + "/api/getposts", {
          params: {
            visiblein: club.club_id,
            orderfield: "id",
          },
        })
      );

      const results = await Promise.all(promises);

      let allPosts = results.flatMap((res) => res.data);

      
     

      setPosts(allPosts);
    } catch (err) {
      console.log("Failed to fetch group posts", err);
      setError(true);
    }
  };
  
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      {loading ? (
        <LoaderScreen />
      ) : error ? (
        <Emptystate  />
      ) : followedClubs.length === 0 ? (
        <Emptystate/>
      ) : (
        <Clubposts posts={posts} />
      )}
    </View>
  );
}
