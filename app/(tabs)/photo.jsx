import React, { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from 'expo-file-system';

import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { icons } from "../../constants";
import { createPost, } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const PhotoCreate = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [formPhoto, setFormPhoto] = useState({
    title: "",
    photo: null,
    prompt: "",
  });
  const [photos, setPhotos] = useState(false);

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

  const openPicker = async () => {
    const mediaType = ImagePicker.MediaTypeOptions.Images;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (!asset.fileName) {
        asset.fileName = `image_${Date.now()}.jpg`;
      }
      if (!asset.fileSize) {
        const file_size = await getFileSize(asset.uri);
        asset.fileSize = file_size;
      }
      
      setFormPhoto({
        ...formPhoto,
        photo: asset,
      });
      setPhotos(true);
    }
  };

  const submit = async () => {
    if (!formPhoto.photo) return Alert.alert("Please provide all fields");
      
    setUploading(true);
    if (photos) {
      try {
        await createPost({
            ...formPhoto,
            userId: user.$id,
            postType: "Photo",
        }
          );

        Alert.alert("Success", "Post uploaded successfully");
        router.push("/home");
      } catch (error) {
        console.log(error);
        Alert.alert("Error2", error.message);
      } finally {
        setFormPhoto({
          title: "",
          photo: null,
          prompt: "",
        });
        setUploading(false);
      }
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Photo</Text>

        <FormField
          title="Photo Title"
          value={formPhoto.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setFormPhoto({ ...formPhoto, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Photo
          </Text>

          <TouchableOpacity onPress={() => openPicker()}>
            {formPhoto.photo ? (
              <Image
                source={{ uri: formPhoto.photo.uri }}
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
          value={formPhoto.prompt}
          placeholder="The AI prompt of your video...."
          handleChangeText={(e) => setFormPhoto({ ...formPhoto, prompt: e })}
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

export default PhotoCreate;
