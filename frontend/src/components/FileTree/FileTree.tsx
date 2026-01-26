import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';

export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

interface FileTreeProps {
  nodes: FileNode[];
  onFileClick: (path: string) => void;
  selectedPath?: string;
}

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  onFileClick: (path: string) => void;
  selectedPath?: string;
}

function FileTreeNode({ node, level, onFileClick, selectedPath }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = selectedPath === node.path;

  const handleClick = () => {
    if (node.isDirectory) {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(node.path);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-800 transition-colors text-left ${
          isSelected ? 'bg-zinc-800 text-blue-400' : 'text-zinc-300'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {node.isDirectory ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 flex-shrink-0 text-blue-400" />
            ) : (
              <Folder className="w-4 h-4 flex-shrink-0 text-blue-400" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            <File className="w-4 h-4 flex-shrink-0 text-zinc-500" />
          </>
        )}
        <span className="truncate text-sm">{node.name}</span>
      </button>

      {node.isDirectory && isExpanded && node.children && (
        <div>
          {node.children.map((child, idx) => (
            <FileTreeNode
              key={`${child.path}-${idx}`}
              node={child}
              level={level + 1}
              onFileClick={onFileClick}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ nodes, onFileClick, selectedPath }: FileTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-zinc-500 text-sm">
        No files in this folder
      </div>
    );
  }

  return (
    <div className="py-2">
      {nodes.map((node, idx) => (
        <FileTreeNode
          key={`${node.path}-${idx}`}
          node={node}
          level={0}
          onFileClick={onFileClick}
          selectedPath={selectedPath}
        />
      ))}
    </div>
  );
}
