# MarkViewPro - Feature Demo

Welcome to **MarkViewPro**! This document showcases all the amazing new features we just added.

## 🎨 New Features

### 1. Split View Editor
Press `Ctrl+\` or click the view mode toggle in the top-right to switch between:
- **Preview Mode** - View rendered markdown
- **Split Mode** - Edit and preview side-by-side
- **Editor Mode** - Focus on writing

### 2. Mermaid Diagrams
Create beautiful diagrams with mermaid syntax:

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Awesome!]
    B -->|No| D[Check console]
    C --> E[Keep coding]
    D --> E
```

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Backend
    User->>App: Open File
    App->>Backend: Read File
    Backend-->>App: File Content
    App-->>User: Display Content
```

### 3. Command Palette
Press `Ctrl+Shift+P` to open the command palette and quickly access:
- File operations
- View modes
- Export options
- Settings
- And more!

### 4. Folder/Project Support
Open entire folders with `Ctrl+Shift+O`:
- Browse file tree in sidebar
- Click to open files
- Navigate nested folders
- Filter markdown files automatically

### 5. Image Management
Paste or drag images directly into your document:
- **Paste**: Copy image → `Ctrl+V` in editor
- **Drag & Drop**: Drag image files into the app
- Images auto-saved to `assets/` folder
- Markdown syntax inserted automatically

## 📝 Try These Features

### Keyboard Shortcuts
| Action | Shortcut |
|--------|----------|
| Command Palette | `Ctrl+Shift+P` |
| Toggle Split View | `Ctrl+\` |
| Open Folder | `Ctrl+Shift+O` |
| Open File | `Ctrl+O` |
| Save | `Ctrl+S` |
| Search | `Ctrl+F` |
| New File | `Ctrl+N` |

### Mermaid Examples

**Flowchart:**
```mermaid
graph LR
    A[Markdown] --> B[MarkViewPro]
    B --> C[Beautiful Docs]
    B --> D[Diagrams]
    B --> E[Export PDF/HTML]
```

**Pie Chart:**
```mermaid
pie title Features Distribution
    "Editor" : 25
    "Viewer" : 25
    "Export" : 20
    "Diagrams" : 15
    "File Management" : 15
```

**State Diagram:**
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Editing: Open File
    Editing --> Saving: Ctrl+S
    Saving --> Idle: Saved
    Editing --> Preview: Toggle View
    Preview --> Editing: Toggle View
```

## 🚀 What's Next?

More features coming soon:
- Git integration
- AI writing assistant
- Collaboration features
- Cloud sync
- And much more!

## 💡 Tips

1. **Split View**: Resize the split pane by dragging the divider
2. **Command Palette**: Type to fuzzy search commands
3. **File Tree**: Expands automatically when you open a folder
4. **Images**: Paste screenshots directly from clipboard
5. **Mermaid**: Supports flowcharts, sequence diagrams, pie charts, and more!

---

**Enjoy MarkViewPro!** 🎉
