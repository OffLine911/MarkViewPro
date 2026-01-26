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
    // Check if file is already open
    const existingTab = tabs.find(tab => tab.filePath === filePath && filePath !== null);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    const newTab: Tab = {
      id: Date.now().toString(),
      fileName,
      filePath,
      content,
      isModified: false,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      
      // If closing active tab, switch to another
      if (tabId === activeTabId && newTabs.length > 0) {
        const closedIndex = prev.findIndex(tab => tab.id === tabId);
        const newActiveIndex = Math.min(closedIndex, newTabs.length - 1);
        setActiveTabId(newTabs[newActiveIndex].id);
      } else if (newTabs.length === 0) {
        // No tabs left, set activeTabId to null to show welcome screen
        setActiveTabId(null);
      }
      
      return newTabs;
    });
  }, [activeTabId]);

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
