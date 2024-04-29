import React from "react";
import { useNavigation } from "expo-router";
import {
  Pressable,
  StyleSheet,
  View,
  Platform,
  Image,
} from "react-native";
const GridItem = ({ thumbnail , icons ,content}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Navigate to the index screen (PostsScreen)
   navigation.navigate('screens/PostsScreen', {content});
  };

  return (
    <View style={[styles.gridItem, { backgroundColor: "white" }]}>
      <Pressable
        style={styles.button}
        android_ripple={{ color: "#ccc" }}
        onPress={handlePress}
      >
        <View style={styles.innerContainer}>
          <Image
            source={{ uri: thumbnail }}
            style={{ height: "100%", width: "100%" }}
          />
          { icons ? (
          <Image
            source={icons}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        ):(
          <></>
        )} 
        </View>
      </Pressable>
    </View>
  );
};

export default GridItem;

const styles = StyleSheet.create({
  textStyling: {
    fontSize: 20,
    fontStyle: "italic",
    color: "black",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flex: 1,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    height: 150,
    backgroundColor: "#161622",
    borderRadius: 4,
    elevation: 4,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
});
