import { useState, useCallback, useMemo } from 'react';
import type { MarkdownState, HeadingItem } from '../types';
import { wails } from '../utils/wailsBindings';

export const defaultMarkdown = `# 👋 Welcome to MarkView Pro

A modern, powerful Markdown viewer and editor built with Wails and React.

## ✨ Key Features

### 📝 Editing & Viewing
- **Live Preview** - See your markdown rendered beautifully in real-time
- **Syntax Highlighting** - Code blocks with multi-language support
- **Mermaid Diagrams** - Create flowcharts, sequence diagrams, and more
- **Math Equations** - Full KaTeX support for mathematical expressions

### 🎨 Customization
- **Dark & Light Themes** - Easy on the eyes with automatic theme switching
- **Zoom Controls** - Adjust text size with Ctrl+/Ctrl-/Ctrl+0
- **Custom Fonts** - Choose your preferred reading font
- **Adjustable Line Height** - Optimize for your reading comfort

### 🔍 Navigation & Search
- **Table of Contents** - Quick navigation through document structure
- **In-Document Search** - Find text with Ctrl+F
- **Heading Anchors** - Direct links to any section

### 📤 Export & Sharing
- **PDF Export** - Professional document output
- **HTML Export** - Standalone web pages
- **Print Support** - Optimized print layouts (Ctrl+P)

## 🚀 Quick Start

### Opening Files
- **Ctrl+O** - Open a markdown file
- **Drag & Drop** - Drop .md files directly onto the window
- **Ctrl+N** - Start a new document

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Ctrl+O | Open file |
| Ctrl+S | Save file |
| Ctrl+N | New file |
| Ctrl+F | Search in document |
| Ctrl+E | Export to PDF |
| Ctrl+P | Print |
| Ctrl+B | Toggle sidebar |
| F11 | Fullscreen mode |
| Ctrl++ | Zoom in |
| Ctrl+- | Zoom out |
| Ctrl+0 | Reset zoom |

## 💻 Code Example

\`\`\`typescript
// TypeScript with syntax highlighting
interface User {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}! Welcome back.\`;
}

const currentUser: User = {
  name: 'Developer',
  email: 'dev@example.com',
  role: 'admin'
};

console.log(greetUser(currentUser));
\`\`\`

## 📊 Mermaid Diagram Example

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
\`\`\`

## 📐 Math Support

Inline math: $E = mc^2$

Block math:

$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

## 📋 Table Example

| Feature | Status | Notes |
|---------|--------|-------|
| Markdown Rendering | ✅ | Full GFM support |
| Syntax Highlighting | ✅ | 100+ languages |
| Dark Mode | ✅ | Auto-switching |
| Export to PDF | ✅ | High quality |
| Mermaid Diagrams | ✅ | Interactive |
| Math Equations | ✅ | KaTeX powered |

## 🎯 Tips & Tricks

> **Pro Tip**: Use the sidebar to quickly navigate through your document structure. Toggle it with Ctrl+B.

> **Reading Mode**: Press F11 for fullscreen, distraction-free reading.

> **Search**: Use Ctrl+F to search within your document. Navigate results with Enter/Shift+Enter.

---

**Ready to start?** Press **Ctrl+O** to open your first markdown file, or **Ctrl+N** to create a new one!

*Made with ❤️ using Wails and React*
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
    fileName: 'Welcome to MarkView Pro',
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

  const openFileByPath = useCallback(async (path: string) => {
    const result = await wails.readFileByPath(path);
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
    if (!state.filePath) {
      // If no file path, use Save As
      const result = await wails.saveFileAs(state.content);
      if (result) {
        // Update the file path after saving
        setState(prev => ({
          ...prev,
          filePath: result,
          fileName: result.split(/[/\\]/).pop() || 'Untitled',
          isModified: false,
        }));
        return true;
      }
      return false;
    }
    
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
      fileName: 'New Document',
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
    openFileByPath,
    saveFile,
    newFile,
  };
}
