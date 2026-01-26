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
      <div className="flex flex-col items-center justify-center py-8 text-zinc-600">
        <List className="w-6 h-6 mb-1.5" />
        <p className="text-xs">No headings found</p>
      </div>
    );
  }

  return (
    <nav className="py-1">
      <ul>
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => handleClick(heading.id)}
              className="w-full text-left px-3 py-1 text-xs rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors truncate"
              style={{ paddingLeft: `${(heading.level - 1) * 8 + 12}px` }}
              title={heading.text}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-600 text-[10px] font-mono w-4">
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
