
import { List } from 'lucide-react';
import type { HeadingItem } from '../../types';

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
        <List className="w-8 h-8 mb-2" />
        <p className="text-sm">No headings found</p>
      </div>
    );
  }

  return (
    <nav className="py-2">
      <ul className="space-y-0.5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => handleClick(heading.id)}
              className={`
                w-full text-left px-3 py-1.5 text-sm rounded-lg
                text-gray-600 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700
                hover:text-gray-900 dark:hover:text-white
                transition-colors truncate
              `}
              style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
              title={heading.text}
            >
              <span className="flex items-center gap-2">
                <span className="text-gray-400 dark:text-gray-500 text-xs font-mono">
                  {'#'.repeat(heading.level)}
                </span>
                <span className="truncate">{heading.text}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
