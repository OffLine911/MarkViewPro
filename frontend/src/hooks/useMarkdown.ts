import { useState, useCallback, useMemo } from 'react';
import type { MarkdownState, HeadingItem } from '../types';
import { wails } from '../utils/wailsBindings';

const defaultMarkdown = `# Welcome to MarkView Pro

A modern, feature-rich Markdown viewer built with Wails and React.

## Features

- **Live Preview** - See your markdown rendered in real-time
- **Syntax Highlighting** - Beautiful code blocks with syntax highlighting
- **Dark Mode** - Easy on the eyes with full dark mode support
- **Table of Contents** - Navigate your documents easily
- **Export Options** - Export to PDF or HTML

## Code Example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

## Table Example

| Feature | Status |
|---------|--------|
| Markdown Rendering | ✅ |
| Syntax Highlighting | ✅ |
| Dark Mode | ✅ |
| Export to PDF | ✅ |

## Getting Started

1. Open a markdown file using **Ctrl+O**
2. Navigate using the table of contents
3. Export using **Ctrl+E**

---

> "Simplicity is the ultimate sophistication." - Leonardo da Vinci

Enjoy using **MarkView Pro**!
`;

function extractHeadings(content: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      headings.push({ id, text, level });
    }
  });
  
  return headings;
}

function countWords(content: string): number {
  const text = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/[#*_\[\]()]/g, '')
    .trim();
  
  if (!text) return 0;
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

function countCharacters(content: string): number {
  return content.replace(/\s/g, '').length;
}

export function useMarkdown() {
  const [state, setState] = useState<MarkdownState>(() => ({
    content: defaultMarkdown,
    filePath: null,
    fileName: null,
    isModified: false,
    wordCount: countWords(defaultMarkdown),
    characterCount: countCharacters(defaultMarkdown),
    headings: extractHeadings(defaultMarkdown),
  }));

  const updateContent = useCallback((content: string, markModified = true) => {
    setState(prev => ({
      ...prev,
      content,
      isModified: markModified ? true : prev.isModified,
      wordCount: countWords(content),
      characterCount: countCharacters(content),
      headings: extractHeadings(content),
    }));
  }, []);

  const openFile = useCallback(async () => {
    const result = await wails.openFile();
    if (result) {
      setState({
        content: result.content,
        filePath: result.path,
        fileName: result.name,
        isModified: false,
        wordCount: countWords(result.content),
        characterCount: countCharacters(result.content),
        headings: extractHeadings(result.content),
      });
      return true;
    }
    return false;
  }, []);

  const saveFile = useCallback(async () => {
    if (!state.filePath) return false;
    const success = await wails.saveFile(state.filePath, state.content);
    if (success) {
      setState(prev => ({ ...prev, isModified: false }));
    }
    return success;
  }, [state.filePath, state.content]);

  const newFile = useCallback(() => {
    setState({
      content: '',
      filePath: null,
      fileName: null,
      isModified: false,
      wordCount: 0,
      characterCount: 0,
      headings: [],
    });
  }, []);

  const stats = useMemo(() => ({
    wordCount: state.wordCount,
    characterCount: state.characterCount,
    lineCount: state.content.split('\n').length,
  }), [state.wordCount, state.characterCount, state.content]);

  return {
    content: state.content,
    filePath: state.filePath,
    fileName: state.fileName,
    isModified: state.isModified,
    headings: state.headings,
    stats,
    updateContent,
    openFile,
    saveFile,
    newFile,
  };
}
