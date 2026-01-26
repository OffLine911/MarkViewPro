package exporter

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	goruntime "runtime"
)

type Exporter struct{}

func NewExporter() *Exporter {
	return &Exporter{}
}

func (e *Exporter) ToHTML(htmlContent, outputPath string) error {
	fullHTML := wrapHTML(htmlContent)

	dir := filepath.Dir(outputPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	return os.WriteFile(outputPath, []byte(fullHTML), 0644)
}

func (e *Exporter) ToPDF(htmlContent, outputPath string) error {
	tempDir, err := os.MkdirTemp("", "markviewpro-export-*")
	if err != nil {
		return err
	}
	defer os.RemoveAll(tempDir)

	tempHTML := filepath.Join(tempDir, "temp.html")
	if err := e.ToHTML(htmlContent, tempHTML); err != nil {
		return err
	}

	chromePath := findChrome()
	if chromePath == "" {
		return fmt.Errorf("Chrome/Chromium not found. Please install Chrome or Chromium for PDF export")
	}

	absOutputPath, err := filepath.Abs(outputPath)
	if err != nil {
		return err
	}

	dir := filepath.Dir(absOutputPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	cmd := exec.Command(chromePath,
		"--headless",
		"--disable-gpu",
		"--no-sandbox",
		"--print-to-pdf="+absOutputPath,
		"--print-to-pdf-no-header",
		tempHTML,
	)

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("PDF export failed: %w", err)
	}

	return nil
}

func findChrome() string {
	var paths []string

	switch goruntime.GOOS {
	case "windows":
		paths = []string{
			filepath.Join(os.Getenv("PROGRAMFILES"), "Google", "Chrome", "Application", "chrome.exe"),
			filepath.Join(os.Getenv("PROGRAMFILES(X86)"), "Google", "Chrome", "Application", "chrome.exe"),
			filepath.Join(os.Getenv("LOCALAPPDATA"), "Google", "Chrome", "Application", "chrome.exe"),
			filepath.Join(os.Getenv("PROGRAMFILES"), "Microsoft", "Edge", "Application", "msedge.exe"),
		}
	case "darwin":
		paths = []string{
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
			"/Applications/Chromium.app/Contents/MacOS/Chromium",
		}
	default:
		paths = []string{
			"/usr/bin/google-chrome",
			"/usr/bin/google-chrome-stable",
			"/usr/bin/chromium",
			"/usr/bin/chromium-browser",
		}
	}

	for _, p := range paths {
		if _, err := os.Stat(p); err == nil {
			return p
		}
	}

	for _, name := range []string{"google-chrome", "chromium", "chromium-browser"} {
		if path, err := exec.LookPath(name); err == nil {
			return path
		}
	}

	return ""
}

func wrapHTML(content string) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MarkViewPro Export</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: 600;
        }
        h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        code {
            background: #f4f4f4;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'JetBrains Mono', Consolas, monospace;
            font-size: 0.9em;
        }
        pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
        }
        pre code {
            background: none;
            padding: 0;
            color: inherit;
        }
        blockquote {
            border-left: 4px solid #ddd;
            margin: 0;
            padding-left: 1em;
            color: #666;
        }
        table {
            border-collapse: collapse;
            width: 100%%;
            margin: 1em 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 0.5em;
            text-align: left;
        }
        th {
            background: #f4f4f4;
        }
        img {
            max-width: 100%%;
            height: auto;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        hr {
            border: none;
            border-top: 1px solid #eee;
            margin: 2em 0;
        }
        .task-list-item {
            list-style: none;
        }
        .task-list-item input {
            margin-right: 0.5em;
        }
    </style>
</head>
<body>
%s
</body>
</html>`, content)
}
