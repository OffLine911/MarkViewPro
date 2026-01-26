package main

import (
	"context"

	"markviewpro/internal/exporter"
	"markviewpro/internal/filemanager"
	"markviewpro/internal/markdown"
	"markviewpro/internal/settings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx         context.Context
	renderer    *markdown.Renderer
	fileManager *filemanager.FileManager
	settings    *settings.Settings
	exporter    *exporter.Exporter
}

func NewApp() *App {
	return &App{
		renderer:    markdown.NewRenderer(),
		fileManager: filemanager.NewFileManager(),
		settings:    settings.NewSettings(),
		exporter:    exporter.NewExporter(),
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.fileManager.SetContext(ctx)
	a.settings.Load()
}

func (a *App) shutdown(ctx context.Context) {
	a.fileManager.StopWatching()
	a.settings.Save()
}

func (a *App) OpenFile() (string, error) {
	file, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Open Markdown File",
		Filters: []runtime.FileFilter{
			{DisplayName: "Markdown Files", Pattern: "*.md;*.markdown"},
			{DisplayName: "All Files", Pattern: "*.*"},
		},
	})
	if err != nil {
		return "", err
	}
	if file == "" {
		return "", nil
	}

	content, err := a.fileManager.OpenFile(file)
	if err != nil {
		return "", err
	}

	return content, nil
}

func (a *App) SaveFile(path, content string) error {
	return a.fileManager.SaveFile(path, content)
}

func (a *App) SaveFileAs(content string) (string, error) {
	file, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Save Markdown File",
		DefaultFilename: "untitled.md",
		Filters: []runtime.FileFilter{
			{DisplayName: "Markdown Files", Pattern: "*.md"},
		},
	})
	if err != nil {
		return "", err
	}
	if file == "" {
		return "", nil
	}

	err = a.fileManager.SaveFile(file, content)
	if err != nil {
		return "", err
	}

	return file, nil
}

func (a *App) GetCurrentFilePath() string {
	return a.fileManager.GetCurrentFilePath()
}

func (a *App) RenderMarkdown(content string) (string, error) {
	return a.renderer.Render(content)
}

func (a *App) GetTableOfContents(content string) []markdown.TOCItem {
	return a.renderer.ExtractTOC(content)
}

func (a *App) GetWordCount(content string) markdown.Stats {
	return a.renderer.GetStats(content)
}

func (a *App) SearchInDocument(content, query string) []markdown.SearchResult {
	return a.renderer.Search(content, query)
}

func (a *App) GetRecentFiles() []filemanager.RecentFile {
	return a.fileManager.GetRecentFiles()
}

func (a *App) OpenRecentFile(path string) (string, error) {
	return a.fileManager.OpenFile(path)
}

func (a *App) ClearRecentFiles() {
	a.fileManager.ClearRecentFiles()
}

func (a *App) StartWatching(path string) error {
	return a.fileManager.StartWatching(path)
}

func (a *App) StopWatching() {
	a.fileManager.StopWatching()
}

func (a *App) GetSettings() settings.UserSettings {
	return a.settings.Get()
}

func (a *App) UpdateSettings(s settings.UserSettings) error {
	return a.settings.Update(s)
}

func (a *App) ExportToHTML(content, outputPath string) error {
	html, err := a.renderer.Render(content)
	if err != nil {
		return err
	}
	return a.exporter.ToHTML(html, outputPath)
}

func (a *App) ExportToPDF(content, outputPath string) error {
	html, err := a.renderer.Render(content)
	if err != nil {
		return err
	}
	return a.exporter.ToPDF(html, outputPath)
}

func (a *App) ExportDialog(content, format string) error {
	var defaultFilename string
	var filter runtime.FileFilter

	switch format {
	case "html":
		defaultFilename = "export.html"
		filter = runtime.FileFilter{DisplayName: "HTML Files", Pattern: "*.html"}
	case "pdf":
		defaultFilename = "export.pdf"
		filter = runtime.FileFilter{DisplayName: "PDF Files", Pattern: "*.pdf"}
	default:
		defaultFilename = "export.html"
		filter = runtime.FileFilter{DisplayName: "HTML Files", Pattern: "*.html"}
	}

	file, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Export Document",
		DefaultFilename: defaultFilename,
		Filters:         []runtime.FileFilter{filter},
	})
	if err != nil {
		return err
	}
	if file == "" {
		return nil
	}

	switch format {
	case "html":
		return a.ExportToHTML(content, file)
	case "pdf":
		return a.ExportToPDF(content, file)
	default:
		return a.ExportToHTML(content, file)
	}
}
