import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronUp, ChevronDown, Search } from 'lucide-react';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

interface SearchMatch {
  start: number;
  end: number;
  lineNumber: number;
  text: string;
}

export function SearchBar({ isOpen, onClose, content }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setMatches([]);
      setCurrentIndex(0);
      clearHighlights();
      return;
    }

    const foundMatches: SearchMatch[] = [];
    const lines = content.split('\n');
    let globalIndex = 0;

    lines.forEach((line, lineNumber) => {
      const regex = new RegExp(escapeRegex(query), 'gi');
      let match;
      while ((match = regex.exec(line)) !== null) {
        foundMatches.push({
          start: globalIndex + match.index,
          end: globalIndex + match.index + match[0].length,
          lineNumber: lineNumber + 1,
          text: match[0],
        });
      }
      globalIndex += line.length + 1;
    });

    setMatches(foundMatches);
    setCurrentIndex(foundMatches.length > 0 ? 0 : -1);
  }, [query, content]);

  useEffect(() => {
    highlightMatches();
  }, [matches, currentIndex]);

  const escapeRegex = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const clearHighlights = useCallback(() => {
    const container = document.querySelector('.markdown-body');
    if (!container) return;

    const marks = container.querySelectorAll('mark[data-search-highlight]');
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize();
      }
    });
  }, []);

  const highlightMatches = useCallback(() => {
    clearHighlights();
    if (matches.length === 0 || !query.trim()) return;

    const container = document.querySelector('.markdown-body');
    if (!container) return;

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');

    textNodes.forEach((textNode) => {
      const text = textNode.textContent || '';
      if (!regex.test(text)) return;
      regex.lastIndex = 0;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        const mark = document.createElement('mark');
        mark.setAttribute('data-search-highlight', 'true');
        mark.className = 'search-highlight';
        mark.textContent = match[0];
        fragment.appendChild(mark);

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      textNode.parentNode?.replaceChild(fragment, textNode);
    });

    scrollToCurrentMatch();
  }, [matches, currentIndex, query, clearHighlights]);

  const scrollToCurrentMatch = useCallback(() => {
    if (currentIndex < 0 || matches.length === 0) return;

    const container = document.querySelector('.markdown-body');
    if (!container) return;

    const highlights = container.querySelectorAll('mark[data-search-highlight]');
    highlights.forEach((el, idx) => {
      if (idx === currentIndex) {
        el.classList.add('search-highlight-current');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        el.classList.remove('search-highlight-current');
      }
    });
  }, [currentIndex, matches.length]);

  const goToNext = useCallback(() => {
    if (matches.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % matches.length);
  }, [matches.length]);

  const goToPrev = useCallback(() => {
    if (matches.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + matches.length) % matches.length);
  }, [matches.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      if (e.shiftKey) {
        goToPrev();
      } else {
        goToNext();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      goToNext();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      goToPrev();
    }
  };

  useEffect(() => {
    return () => {
      clearHighlights();
    };
  }, [clearHighlights]);

  useEffect(() => {
    if (!isOpen) {
      clearHighlights();
      setQuery('');
      setMatches([]);
    }
  }, [isOpen, clearHighlights]);

  if (!isOpen) return null;

  return (
    <div className="search-bar">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-zinc-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search in document..."
          className="search-input"
        />
        <span className="search-count">
          {matches.length > 0 ? `${currentIndex + 1} of ${matches.length}` : 'No results'}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={goToPrev}
          disabled={matches.length === 0}
          className="search-nav-btn"
          title="Previous match (Shift+Enter)"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={goToNext}
          disabled={matches.length === 0}
          className="search-nav-btn"
          title="Next match (Enter)"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
        <button onClick={onClose} className="search-nav-btn" title="Close (Escape)">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
