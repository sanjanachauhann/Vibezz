import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native';
import { renderItem } from '../../components';

const PostsScreen = () => {
  const route = useRoute(); // Use the useRoute hook to access the route
  const { content } = route.params;

  const renderedItem = renderItem({ item: content });

  return (
    <SafeAreaView className="bg-primary h-full">
      {renderedItem}
    </SafeAreaView>
  )
}

export default PostsScreen