import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import PostList, { Post } from "../Post/PostList";
import Colors from "@/data/Colors";

export default function ClubPosts({ posts }: { posts: Post[] }) {
  return (
    <View style={styles.container}>
      {/* Enhanced Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Text style={styles.mainTitle}>Club Feed</Text>
            <Text style={styles.tagline}>
              Discover what your clubs are buzzing about! ✨
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/explore-clubs")}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Explore Clubs</Text>
            </TouchableOpacity>
          </View>
          
          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </View>
      </View>

      {/* Posts Section */}
      <View style={styles.postsContainer}>
        <PostList posts={posts} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.TERTIARY,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  headerCard: {
    backgroundColor: Colors.SECONDARY,
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.SECONDARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    alignItems: "center",
    zIndex: 2,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.WHITE,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: Colors.WHITE,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "500",
    opacity: 0.95,
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 4,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    transform: [{ scale: 1 }],
  },
  buttonText: {
    color: Colors.SECONDARY,
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  // Decorative elements for visual appeal
  decorativeCircle1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.PRIMARY,
    opacity: 0.1,
    top: -20,
    right: -20,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.WHITE,
    opacity: 0.1,
    bottom: -15,
    left: -15,
  },
});