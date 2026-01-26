import { useState } from 'react';
import { ChevronLeft, ChevronRight, List, Clock, FileText } from 'lucide-react';
import { TableOfContents } from './TableOfContents';
import type { HeadingItem, RecentFile } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  headings: HeadingItem[];
  recentFiles: RecentFile[];
  onOpenRecentFile?: (path: string) => void;
}

type TabType = 'toc' | 'recent';

export function Sidebar({ isOpen, onToggle, headings, recentFiles, onOpenRecentFile }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('toc');

  return (
    <>
      <div
        className={`
          sidebar transition-all duration-300 ease-in-out
          ${isOpen ? 'w-72' : 'w-0'}
          overflow-hidden flex-shrink-0
        `}
      >
        <div className="w-72 h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('toc')}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                  ${activeTab === 'toc'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <List className="w-4 h-4" />
                Contents
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                  ${activeTab === 'recent'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Clock className="w-4 h-4" />
                Recent
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'toc' ? (
              <TableOfContents headings={headings} />
            ) : (
              <div className="py-2">
                {recentFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                    <Clock className="w-8 h-8 mb-2" />
                    <p className="text-sm">No recent files</p>
                  </div>
                ) : (
                  <ul className="space-y-0.5">
                    {recentFiles.map((file) => (
                      <li key={file.path}>
                        <button
                          onClick={() => onOpenRecentFile?.(file.path)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {file.path}
                              </p>
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`
          absolute top-1/2 -translate-y-1/2 z-20
          w-6 h-12 flex items-center justify-center
          bg-gray-200 dark:bg-gray-700 
          hover:bg-gray-300 dark:hover:bg-gray-600
          rounded-r-lg shadow-md
          transition-all duration-300
          ${isOpen ? 'left-72' : 'left-0'}
        `}
        title={isOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        )}
      </button>
    </>
  );
}
