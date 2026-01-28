import { useState, useCallback } from 'react';

export interface Tab {
  id: string;
  fileName: string;
  filePath: string | null;
  content: string;
  isModified: boolean;
}

export function useTabs() {
  // Start with no tabs - show welcome screen instead
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const addTab = useCallback((fileName: string, filePath: string | null, content: string) => {
    const newTabId = Date.now().toString();
    
    setTabs(prev => {
      // Check if file is already open
      if (filePath !== null) {
        const existingTab = prev.find(tab => tab.filePath === filePath);
        if (existingTab) {
          // Schedule setActiveTabId after this state update
          setTimeout(() => setActiveTabId(existingTab.id), 0);
          return prev;
        }
      }

      const newTab: Tab = {
        id: newTabId,
        fileName,
        filePath,
        content,
        isModified: false,
      };

      // Schedule setActiveTabId after this state update
      setTimeout(() => setActiveTabId(newTabId), 0);
      return [...prev, newTab];
    });
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      const closedIndex = prev.findIndex(tab => tab.id === tabId);
      
      // Schedule active tab update after state change
      setTimeout(() => {
        setActiveTabId(currentActiveId => {
          // If closing the active tab, switch to another
          if (tabId === currentActiveId && newTabs.length > 0) {
            const newActiveIndex = Math.min(closedIndex, newTabs.length - 1);
            return newTabs[newActiveIndex].id;
          } else if (newTabs.length === 0) {
            // No tabs left, show welcome screen
            return null;
          }
          return currentActiveId;
        });
      }, 0);
      
      return newTabs;
    });
  }, []);

  const updateTab = useCallback((tabId: string, updates: Partial<Tab>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  }, []);

  const updateTabContent = useCallback((tabId: string, content: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, content, isModified: true } : tab
    ));
  }, []);

  return {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    addTab,
    closeTab,
    updateTab,
    updateTabContent,
  };
}
