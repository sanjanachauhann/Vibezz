import { FlatList, Text, SafeAreaView, RefreshControl } from "react-native";
import { EmptyState,} from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { filterDocuments} from "../../lib/appwrite";
import GridItem from "../../components/GridItem";
import { useState } from "react";
import useAppwrite from "../../lib/useAppwrite";
import { icons } from "../../constants";
const Bookmark = () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const { data: posts, refetch } = useAppwrite(filterDocuments, `${user.$id}`);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const renderItem = ({ item }) => {

    if (item.photo !== null && item.photo !== undefined) {
      return (
        <GridItem title={item.title} thumbnail = {item.photo} content = {item}/>
      );
    } else if (item.video) {
      return (
        <GridItem title={item.title} thumbnail = {item.thumbnail} icons={icons.play}  content = {item}/>
      );
    }
  };
  
  return (
  
    <SafeAreaView className="bg-primary h-full">
      <Text className="text-3xl text-white font-psemibold my-6 px-4 space-y-6 pt-4">Bookmark</Text>
      <FlatList
        data={posts}
        numColumns={2}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos or Photos Found"
            subtitle="No videos found for this profile"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
