import { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";
import { createBookmark} from "../lib/appwrite";

const PhotoCard = ({ docId ,title, creator, avatar, photo, bookmark }) => {
  const [focused, setFocus] = useState(bookmark);
  const handlePress = () => {
    setFocus((prevFocused) => !prevFocused);
    createBookmark(docId , !focused);
  };

  return (
    <View className="flex flex-col items-center px-4 mb-5">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {creator}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>
      
          <Image
              source={{ uri: `${photo}`}}
              resizeMode="cover"
              className="w-full h-64 rounded-2xl my-3"
              onError={(error) => console.log("Error loading image:", error)}
          />
 
    <TouchableOpacity style={{ marginLeft: '90%'}} onPress={()=> handlePress()}> 
        <Image  source={icons.bookmark} 
         tintColor={focused ? '#818cf8' : 'white'} className="w-5 h-5" resizeMode="contain" />
        </TouchableOpacity>
    </View>
  );
};

export default PhotoCard;

