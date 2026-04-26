import React, { createContext, useContext, useState, useCallback } from 'react';

export interface WatchedVideo {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId: string;
  watchedAt: Date;
}

interface WatchHistoryContextType {
  history: WatchedVideo[];
  addToHistory: (video: WatchedVideo) => void;
  clearHistory: () => void;
}

const WatchHistoryContext = createContext<WatchHistoryContextType>({
  history: [],
  addToHistory: () => {},
  clearHistory: () => {},
});

export function WatchHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<WatchedVideo[]>([]);

  const addToHistory = useCallback((video: WatchedVideo) => {
    setHistory((prev) => {
      const filtered = prev.filter((v) => v.id !== video.id);
      return [video, ...filtered].slice(0, 20);
    });
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return (
    <WatchHistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
      {children}
    </WatchHistoryContext.Provider>
  );
}

export function useWatchHistory() {
  return useContext(WatchHistoryContext);
}
