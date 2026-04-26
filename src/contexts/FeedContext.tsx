import React, { createContext, useContext, useState } from 'react';
import { FEED_POSTS, FeedPost } from '../data/mockData';

interface FeedContextType {
  posts: FeedPost[];
  addPost: (post: FeedPost) => void;
}

const FeedContext = createContext<FeedContextType>({
  posts: FEED_POSTS,
  addPost: () => {},
});

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<FeedPost[]>(FEED_POSTS);

  const addPost = (post: FeedPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <FeedContext.Provider value={{ posts, addPost }}>
      {children}
    </FeedContext.Provider>
  );
}

export const useFeed = () => useContext(FeedContext);
