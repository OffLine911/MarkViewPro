# Changelog

All notable changes to MarkViewPro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-01-26

### 🎉 Major Features Added

#### 1. Split View Editor with Monaco
- **Full Monaco Editor Integration**: Professional code editor with syntax highlighting
- **Three View Modes**: Preview-only, Editor-only, and Split view
- **Resizable Split Pane**: Drag the divider to adjust editor/preview ratio
- **Real-time Sync**: Changes in editor instantly reflect in preview
- **Advanced Editor Features**:
  - Minimap for quick navigation
  - Line numbers and code folding
  - Bracket pair colorization
  - IntelliSense and auto-completion
  - Multiple cursors support
- **Keyboard Shortcut**: `Ctrl+\` to toggle split view
- **New Components**: `MarkdownEditor.tsx`, `SplitView.tsx`, `ViewModeToggle.tsx`

#### 2. Mermaid Diagram Support
- **Automatic Diagram Rendering**: All mermaid code blocks render as diagrams
- **Comprehensive Diagram Types**:
  - Flowcharts and flow diagrams
  - Sequence diagrams
  - Pie charts and bar charts
  - State diagrams
  - Gantt charts
  - Class diagrams
  - Entity relationship diagrams
  - User journey diagrams
- **Dark Theme Integration**: Diagrams styled to match app theme
- **Error Handling**: Helpful error messages for invalid syntax
- **New Component**: `MermaidDiagram.tsx`

#### 3. Command Palette
- **Quick Command Access**: Press `Ctrl+Shift+P` to open
- **Fuzzy Search**: Type to filter commands instantly
- **Keyboard Navigation**: Arrow keys + Enter to execute
- **17+ Commands Available**:
  - File operations (Open, Save, New)
  - View mode switching (Preview, Editor, Split)
  - Export functions (PDF, HTML)
  - Zoom controls
  - Settings and preferences
  - Sidebar and fullscreen toggles
- **Categorized Commands**: File, View, Export, Other
- **Shortcut Display**: Shows keyboard shortcuts for each command
- **New Component**: `CommandPalette.tsx`

#### 4. Folder/Project Support
- **Open Entire Folders**: Work with multiple markdown files as a project
- **File Tree Navigation**: Browse files in hierarchical tree structure
- **Recursive Scanning**: Automatically finds all markdown files
- **Smart Filtering**: Shows only .md and .markdown files
- **Expandable/Collapsible Folders**: Clean navigation with folder icons
- **File Selection Highlighting**: Visual feedback for active file
- **Max Depth Control**: Configurable folder depth (default: 3 levels)
- **Keyboard Shortcut**: `Ctrl+Shift+O` to open folder
- **New Backend**: `internal/foldermanager/foldermanager.go`
- **New Component**: `FileTree.tsx`
- **Sidebar Integration**: New "Files" tab in sidebar

#### 5. Image Paste & Management
- **Clipboard Paste**: Copy any image and paste directly with `Ctrl+V`
- **Drag & Drop Images**: Drag image files into the app
- **Auto-Save to Assets**: Images automatically saved to `assets/` folder
- **Unique Filenames**: Timestamp-based naming prevents conflicts
- **Automatic Markdown Insertion**: Image syntax inserted at cursor position
- **Format Support**: PNG, JPG, JPEG, GIF, WebP
- **Smart Path Management**: Relative paths for portability
- **New Backend**: `internal/imagemanager/imagemanager.go`
- **Seamless Integration**: Works in Editor and Split view modes

### Added
- **New Dependencies**:
  - `monaco-editor` (^0.45.0) - Professional code editor
  - `@monaco-editor/react` (^4.6.0) - React wrapper for Monaco
  - `mermaid` (^10.6.1) - Diagram rendering library
- **New Backend Packages**:
  - `internal/foldermanager` - Folder operations and tree building
  - `internal/imagemanager` - Image handling and asset management
- **New Frontend Components**:
  - `components/Editor/MarkdownEditor.tsx` - Monaco editor wrapper
  - `components/SplitView/SplitView.tsx` - Split view container
  - `components/Toolbar/ViewModeToggle.tsx` - View mode switcher
  - `components/CommandPalette/CommandPalette.tsx` - Command palette UI
  - `components/FileTree/FileTree.tsx` - File tree navigation
  - `components/Viewer/MermaidDiagram.tsx` - Mermaid renderer
- **New Wails Bindings**:
  - `OpenFolder()` - Open folder dialog
  - `GetFolderTree()` - Get file tree structure
  - `ReadFileFromFolder()` - Read file from folder
  - `SavePastedImage()` - Save base64 image data
  - `CopyImageToAssets()` - Copy image file to assets
- **Enhanced Keyboard Shortcuts**:
  - `Ctrl+Shift+P` - Open command palette
  - `Ctrl+\` - Toggle split view
  - `Ctrl+Shift+O` - Open folder
- **View Mode State Management**: Track and persist view preferences
- **Tab Content Updates**: Support for editing in tabs
- **Status Bar Enhancement**: Shows current view mode

### Changed
- **App.tsx**: Complete rewrite to integrate all new features
- **Sidebar**: Added "Files" tab for folder navigation
- **StatusBar**: Added view mode indicator
- **useTabs Hook**: Added `updateTabContent()` method for editor changes
- **wailsBindings**: Extended with new backend methods
- **MarkdownViewer**: Enhanced to detect and render mermaid blocks

### Technical
- **Architecture**: Clean separation between view modes
- **State Management**: Centralized view mode and folder state
- **Performance**: Optimized Monaco editor loading
- **Error Handling**: Comprehensive error handling for all new features
- **Type Safety**: Full TypeScript coverage for new components
- **Documentation**: Added `NEW_FEATURES_SUMMARY.md` and `FEATURES_IMPLEMENTATION.md`

### Developer Experience
- **Demo File**: Created `DEMO.md` with examples of all features
- **Implementation Guide**: Detailed integration steps
- **Code Organization**: Modular component structure
- **Testing Ready**: All features ready for testing

## [1.2.4] - 2026-01-26

### Fixed
- **Search Bar Black Screen**: Fixed UI turning black when closing search bar
- Improved DOM manipulation safety in search functionality
- Added error handling for highlight clearing operations
- Force re-render of markdown viewer when search state changes

## [1.2.3] - 2026-01-26

### Fixed
- **Sidebar Collapsed by Default**: Sidebar now starts collapsed for cleaner initial view
- **Tab Content Switching**: Fixed content not updating when switching between tabs
  - Each tab now properly displays its own content
  - Headings update correctly per tab
  - Stats (word count, character count, etc.) update per tab
  - Welcome message no longer persists when switching tabs

### Technical
- Added `activeContent`, `activeHeadings`, and `activeStats` computed from active tab
- Welcome tab now loads with full welcome markdown content
- Exported `defaultMarkdown` from useMarkdown hook
- Proper content synchronization between tabs and viewer

## [1.2.2] - 2026-01-26

### Improved
- **Tabs in Titlebar**: Tabs now centered in titlebar for cleaner design
  - Removed separate tab bar row
  - Tabs integrated directly into titlebar center
  - More vertical space for content
  - Professional, modern appearance like VS Code
  - Smooth transitions between title and tabs

### Technical
- Merged TabBar component into Titlebar
- Tabs now render in titlebar's center flex container
- Removed redundant TabBar import and component

## [1.2.1] - 2026-01-26

### Improved
- **Titlebar Design**: Cleaner, more professional titlebar
  - Removed left-side branding when files are open
  - "MarkView Pro" title now centered when no files are open
  - Title disappears when tabs are visible
  - More space for tabs and controls
- **Welcome Screen Behavior**: Smarter welcome tab handling
  - Welcome tab automatically closes when opening first file
  - Welcome tab closes when creating new document
  - Welcome tab closes when dropping files
  - Prevents cluttering workspace with welcome screen

### Technical
- Added `hasOpenFiles` prop to Titlebar component
- Improved tab replacement logic for welcome screen
- Enhanced drag and drop to handle welcome tab closure
- Cleaner conditional rendering of title vs tabs

## [1.2.0] - 2026-01-26

### Added
- **Tab Support**: Open multiple markdown files in tabs
  - Click tabs to switch between files
  - Close tabs with X button (keeps at least one tab open)
  - Drag and drop multiple files to open in separate tabs
  - Each tab maintains its own state (content, modified status, file path)
  - Visual indicator for modified tabs
- **Drag & Drop Visual Feedback**: Beautiful overlay when dragging files
  - Shows "Drop Markdown Files Here" message
  - Animated backdrop blur effect
  - File icon and instructions

### Fixed
- **Drag & Drop**: Now works correctly - files open in tabs instead of browser window
  - Properly prevents default browser behavior
  - Supports dropping multiple files at once
  - Only accepts .md and .markdown files
  - Uses FileReader API for reliable file reading

### Technical
- Created `useTabs` hook for tab state management
- Created `TabBar` component for tab UI
- Implemented HTML5 drag and drop with proper event handling
- Added drag state tracking for visual feedback
- Tab system prevents duplicate file opens

## [1.1.7] - 2026-01-26

### Fixed
- **Drag & Drop**: Fixed files opening in separate browser window - now properly prevents default browser behavior
- **HTML Export**: Fixed HTML export not working - now shows save dialog and exports correctly
- **Welcome Message**: Replaced "Untitled" with proper welcome message and better default file names

### Improved
- **Welcome Screen**: Complete redesign with comprehensive feature showcase
  - Added emoji icons for better visual appeal
  - Included all keyboard shortcuts in a table
  - Added Mermaid diagram example
  - Added math equation examples
  - Better organized feature sections
  - Tips and tricks section
- **Default File Names**: 
  - Welcome screen now shows "Welcome to MarkView Pro"
  - New documents show "New Document" instead of null/Untitled
- **Drag & Drop**: Added event listeners to prevent browser from opening dropped files

### Technical
- Added dragover, drop, dragenter, dragleave event prevention
- Updated ExportToHTML to handle save dialog internally
- Simplified HTML export API (no longer requires path parameter)
- Enhanced welcome markdown content with 100+ lines of examples

## [1.1.6] - 2026-01-26

### Fixed
- **Code Block Rendering**: Fixed code blocks showing `[object Object]` - now properly extracts text from React elements
- **Save Functionality**: Save now works correctly - uses Save As dialog when no file path exists
- **Export PDF**: PDF export now works for both saved and unsaved files using ExportContentToPDF
- **Export HTML**: HTML export properly handles content for all file states

### Technical
- Improved code block text extraction to handle React element children
- Added SaveFileAs binding to frontend
- Added ExportContentToPDF method for exporting unsaved content
- Enhanced save logic to automatically prompt for file location when needed

## [1.1.5] - 2026-01-26

### Fixed
- **Drag & Drop**: Properly implemented file drag and drop functionality - now works correctly when dragging .md files onto the window
- **Save Function**: Fixed save functionality to properly persist file changes
- **Export Functions**: Fixed PDF and HTML export to properly handle file content and show save dialogs
- **Fullscreen Toggle**: Fixed fullscreen button to properly maximize/restore window in frameless mode
- **File Opening**: Fixed OpenFile to return proper file object with path, name, and content
- **ReadFileByPath**: Now returns complete file information instead of just content

### Technical
- Updated Go backend to return structured file data (map with content, path, name)
- Added domReady handler for drag and drop event initialization
- Improved Wails bindings to handle new return types
- Added ToggleFullscreen method for proper window maximize/restore
- Enhanced error handling in file operations

## [1.1.0] - 2026-01-26

### Added
- **Document Search**: Search within documents with Ctrl+F, navigate results with Enter/Shift+Enter
- **Zoom Controls**: Zoom in (Ctrl++), zoom out (Ctrl+-), reset zoom (Ctrl+0)
- **Reading Time Estimate**: Shows estimated reading time in status bar (based on 200 words/min)
- **Print Support**: Print documents with Ctrl+P with optimized print styles
- **Fullscreen Mode**: Toggle fullscreen with F11 for distraction-free reading
- **Mermaid Diagrams**: Full support for Mermaid diagram rendering in code blocks
- **Math Support**: KaTeX integration for rendering mathematical equations
- **Improved Tables**: Better table rendering with horizontal scroll for wide tables

### Fixed
- Code blocks now render properly instead of showing `[object Object]`
- Fullscreen mode now properly tracks state when exiting with ESC key
- TypeScript compilation errors resolved for all components

### Technical
- Enhanced keyboard shortcuts system with search, zoom, and fullscreen controls
- Improved markdown rendering with better code block handling
- Added fullscreen change event listeners for proper state management
- Integrated SearchBar component with highlight and navigation features

## [1.0.0] - 2026-01-26

### Added
- Initial release of MarkViewPro
- Live Markdown preview with syntax highlighting
- Cross-platform support (Windows, macOS, Linux)
- Dark and light theme support
- File watching for automatic refresh
- Export to HTML and PDF functionality
- Table of contents generation
- Code block syntax highlighting with multiple language support
- Keyboard shortcuts for common actions
- Drag and drop file support
- Settings modal for customization
- Status bar with file information
- Modern UI with Tailwind CSS
- Windows NSIS installer for easy installation

### Fixed
- Updated GitHub Actions workflow to use `actions/upload-artifact@v4` (from deprecated v3)
- Updated GitHub Actions workflow to use `actions/download-artifact@v4`

### Technical
- Built with Wails v2 framework
- Go 1.21 backend
- React + TypeScript frontend
- Vite build system
- Automated CI/CD pipeline with GitHub Actions

[1.2.3]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.2.3
[1.2.2]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.2.2
[1.2.1]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.2.1
[1.2.0]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.2.0
[1.1.7]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.1.7
[1.1.6]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.1.6
[1.1.5]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.1.5
[1.1.0]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.1.0
[1.0.0]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.0.0
