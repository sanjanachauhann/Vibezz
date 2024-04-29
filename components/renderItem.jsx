import React from 'react';
import PhotoCard from './PhotoCard'; 
import VideoCard from './VideoCard';

const renderItem = ({ item }) => {
  if (item.photo !== null && item.photo !== undefined) {
    return (
      <PhotoCard
        docId={item.$id}
        title={item.title}
        photo={item.photo}
        creator={item.creator.username}
        avatar={item.creator.avatar}
        bookmark={item.bookmark}
      />
    );
  } else if (item.video) {
    return (
      <VideoCard
        docId={item.$id}
        title={item.title}
        thumbnail={item.thumbnail}
        video={item.video}
        creator={item.creator.username}
        avatar={item.creator.avatar}
        bookmark={item.bookmark}
      />
    );
  } else {
    return null; // Return null if item doesn't have photo or video
  }
};

export default renderItem;
