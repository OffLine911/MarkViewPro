# Changelog

All notable changes to MarkViewPro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.1.0]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.1.0
[1.0.0]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.0.0
