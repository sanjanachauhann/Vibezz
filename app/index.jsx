import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '../components/CustomButton';

export default function App() {
  return (
   <SafeAreaView className="bg-primary h-full">
    <ScrollView contentContainerStyle={{
          height: "100%",
        }}
   >
      <View className="w-full flex justify-center items-center min-h-[85vh] px-4">
        <Image
        source={images.logo}
        className="w-[130px] h-[84px]"
        resizeMode='contain'/>
        <Image
        source={images.cards}
        className="max-w-[380px] h-[298px]"
        resizeMode='contain'/>
        
      {/* </View> */}
      <View className="relative mt-5">
       <Text className="text-3xl text-white font-bold text-center">
       {/* Dicover endless possiblities with {''} */}
        Where Every Interaction Resonates!
       <Text classname="text-primary-200">
       Vibezz
       </Text>
       </Text> 
       <Image
              source={images.path}
              className="w-[140px] h-[15px] absolute -bottom-2 -center- left-20"
              resizeMode="contain"
            />
      </View>
      <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
      Tap into the Rhythm of Socializing with Vibezz: Your Melody in the World of Connections
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/signin")}
            containerStyles="w-full mt-7"
          />
      </View>
    </ScrollView>
    <StatusBar backgroundColor="#161622" style="light" />
   </SafeAreaView>
  );
}

