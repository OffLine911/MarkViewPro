# Contributing to MarkViewPro

Thank you for your interest in contributing to MarkViewPro! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate in all interactions. We are committed to providing a welcoming and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check the [issue tracker](https://github.com/yourusername/MarkViewPro/issues) to see if the bug has already been reported.
2. If not, create a new issue with a clear title and description.
3. Include steps to reproduce the bug, expected behavior, and actual behavior.
4. Add your operating system and version information.

### Suggesting Features

1. Check the issue tracker to see if the feature has already been suggested.
2. Create a new issue with the `enhancement` label.
3. Describe the feature and why it would be useful.

### Pull Requests

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them with clear, descriptive messages.
4. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request against the `main` branch.

## Development Setup

### Prerequisites

- Go 1.21 or later
- Node.js 18 or later
- Wails v2

### Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/MarkViewPro.git
cd MarkViewPro

# Install frontend dependencies
cd frontend
npm install
cd ..

# Run in development mode
wails dev
```

### Running Tests

```bash
# Go tests
go test -v ./...

# Frontend linting
cd frontend
npm run lint
```

## Code Style

### Go

- Follow standard Go conventions
- Run `go fmt` before committing
- Use meaningful variable and function names

### Frontend

- Follow the existing code style
- Run the linter before committing
- Use TypeScript where applicable

## Commit Messages

- Use clear, descriptive commit messages
- Start with a verb in the present tense (e.g., "Add feature", "Fix bug")
- Reference issue numbers when applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
