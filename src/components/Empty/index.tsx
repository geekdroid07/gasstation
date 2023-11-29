import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Empty = ({ title = 'No hay data', icon = <Ionicons name="ios-archive-outline" size={150} /> }) => {
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20}}>
        <Text style={styles.name}>{title}</Text>
        {icon}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  name: {
    fontWeight: "500",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  description: {
    color: "gray",
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
  },
  image: {
    height: 75,
    aspectRatio: 1,
  },
});

export default Empty;
