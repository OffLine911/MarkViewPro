# Changelog

All notable changes to MarkViewPro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.2.0]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.2.0
[1.1.7]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.1.7
[1.1.6]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.1.6
[1.1.5]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.1.5
[1.1.0]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.1.0
[1.0.0]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.0.0
