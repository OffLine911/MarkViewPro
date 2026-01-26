import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  theme?: 'light' | 'dark';
}

export function MarkdownEditor({ content, onChange, theme = 'dark' }: MarkdownEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    
    // Focus editor on mount
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      const currentPosition = editorRef.current.getPosition();
      if (currentPosition) {
        editorRef.current.setPosition(currentPosition);
      }
    }
  }, [content]);

  return (
    <Editor
      height="100%"
      defaultLanguage="markdown"
      value={content}
      theme={theme === 'dark' ? 'vs-dark' : 'light'}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        formatOnPaste: true,
        formatOnType: true,
        renderWhitespace: 'selection',
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
      }}
    />
  );
}
