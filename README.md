# MarkViewPro

A modern, cross-platform Markdown viewer and editor built with Wails.

## Features

- Live Markdown preview with syntax highlighting
- Cross-platform support (Windows, macOS, Linux)
- Dark and light theme support
- File watching for automatic refresh
- Export to HTML and PDF
- Table of contents generation
- Code block syntax highlighting
- Keyboard shortcuts for common actions
- Drag and drop file support

## Screenshots

<!-- Add screenshots here -->
![MarkViewPro Screenshot](docs/screenshot.png)

## Installation

### Download

Download the latest release for your platform from the [Releases](https://github.com/yourusername/MarkViewPro/releases) page.

### Platform-specific Instructions

**Windows:**
Download `MarkViewPro-windows-amd64.exe` and run it directly.

**macOS:**
Download `MarkViewPro-macos-amd64.zip`, extract it, and move `MarkViewPro.app` to your Applications folder.

**Linux:**
Download `MarkViewPro-linux-amd64`, make it executable with `chmod +x`, and run it.

## Build from Source

### Prerequisites

- [Go](https://go.dev/dl/) 1.21 or later
- [Node.js](https://nodejs.org/) 18 or later
- [Wails](https://wails.io/) v2

### Install Wails

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### Clone and Build

```bash
git clone https://github.com/yourusername/MarkViewPro.git
cd MarkViewPro
wails build
```

The built binary will be in the `build/bin` directory.

### Development Mode

```bash
wails dev
```

## Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Open File | `Ctrl+O` | `Cmd+O` |
| Save File | `Ctrl+S` | `Cmd+S` |
| New File | `Ctrl+N` | `Cmd+N` |
| Toggle Preview | `Ctrl+P` | `Cmd+P` |
| Toggle Dark Mode | `Ctrl+D` | `Cmd+D` |
| Export to HTML | `Ctrl+E` | `Cmd+E` |
| Print/Export PDF | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Find | `Ctrl+F` | `Cmd+F` |
| Quit | `Ctrl+Q` | `Cmd+Q` |

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
