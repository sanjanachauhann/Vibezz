import { useState } from "react";
import { router } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from 'expo-file-system';
import { icons } from "../../constants";
import { createPost } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";


const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
    photo: null,
  });
  const [video , setVideo] = useState(false);

  const getFileSize = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileSizeInBytes = fileInfo.size;
      // Convert bytes to kilobytes
      const fileSizeInKB = fileSizeInBytes / 1024;
      return fileSizeInKB;
    } catch (error) {
      console.error('Error getting file size:', error);
      return null;
    }
  };
  const openPicker = async (selectType) => {
  const mediaType =
    selectType === "image"
      ? ImagePicker.MediaTypeOptions.Images
      : ImagePicker.MediaTypeOptions.Videos;
    
   
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: mediaType,
    quality: 1,
    allowsEditing: true,
    
  });

    if (!result.canceled) {
    
      const asset = result.assets[0];
      if (!asset.fileName) {
        if(selectType === "image"){
        // Assign a unique name if fileName is null
        asset.fileName = `image_${Date.now()}.jpg`;
        }else{
          asset.fileName = `video_${Date.now()}.mp4`;
        }
      }
      if(!asset.fileSize){
      const file_size = await getFileSize(asset.uri);
      if (file_size) {
        asset.fileSize = file_size;
        if (file_size > 5 * 1024 ) { // Convert MB to bytes
          Alert.alert("File size exceeds 5 MB limit. Please choose a smaller file.");
          return; // Abort further processing
        }
      } else {
        Alert.alert("Unable to determine file size. Please try again.");
        return; // Abort further processing
      }
    }
      
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: asset,
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
         video: asset,
        });
        setVideo(true);
      }
    }
  };

  const submit = async () => {
    if ( !form.video || !form.thumbnail) return Alert.alert("Please provide all fields");
    
    setUploading(true);
    if(video){
    try {
     
      await createPost({
        ...form,
        userId: user.$id,
        postType:"video",
      });
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
} 
}

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
          Add a thumbnail
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
            
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI prompt of your video...."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
