# Changelog

All notable changes to MarkViewPro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

### Fixed
- Updated GitHub Actions workflow to use `actions/upload-artifact@v4` (from deprecated v3)
- Updated GitHub Actions workflow to use `actions/download-artifact@v4`

### Technical
- Built with Wails v2 framework
- Go 1.21 backend
- React + TypeScript frontend
- Vite build system
- Automated CI/CD pipeline with GitHub Actions

[1.0.0]: https://github.com/OffLine911/MarkViewPro/releases/tag/v1.0.0
