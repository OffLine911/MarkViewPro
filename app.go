package main

import (
	"context"

	"markviewpro/internal/exporter"
	"markviewpro/internal/filemanager"
	"markviewpro/internal/foldermanager"
	"markviewpro/internal/imagemanager"
	"markviewpro/internal/markdown"
	"markviewpro/internal/settings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx           context.Context
	renderer      *markdown.Renderer
	fileManager   *filemanager.FileManager
	folderManager *foldermanager.FolderManager
	imageManager  *imagemanager.ImageManager
	settings      *settings.Settings
	exporter      *exporter.Exporter
	initialFile   string
}

func NewApp() *App {
	return &App{
		renderer:      markdown.NewRenderer(),
		fileManager:   filemanager.NewFileManager(),
		folderManager: foldermanager.NewFolderManager(),
		imageManager:  imagemanager.NewImageManager(),
		settings:      settings.NewSettings(),
		exporter:      exporter.NewExporter(),
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.fileManager.SetContext(ctx)
	a.folderManager.SetContext(ctx)
	a.settings.Load()
}

func (a *App) GetInitialFile() string {
	return a.initialFile
}

func (a *App) domReady(ctx context.Context) {
	// Enable drag and drop
	runtime.EventsOn(ctx, "wails:file-drop", func(data ...interface{}) {
		if len(data) > 0 {
			if filePath, ok := data[0].(string); ok {
				runtime.EventsEmit(ctx, "file-dropped", filePath)
			}
		}
	})
}

func (a *App) shutdown(ctx context.Context) {
	a.fileManager.StopWatching()
	a.settings.Save()
}

func (a *App) OpenFile() (map[string]string, error) {
	file, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Open Markdown File",
		Filters: []runtime.FileFilter{
			{DisplayName: "Markdown Files", Pattern: "*.md;*.markdown"},
			{DisplayName: "All Files", Pattern: "*.*"},
		},
	})
	if err != nil {
		return nil, err
	}
	if file == "" {
		return nil, nil
	}

	content, err := a.fileManager.OpenFile(file)
	if err != nil {
		return nil, err
	}

	// Extract filename from path
	filename := file
	for i := len(file) - 1; i >= 0; i-- {
		if file[i] == '/' || file[i] == '\\' {
			filename = file[i+1:]
			break
		}
	}

	return map[string]string{
		"content": content,
		"path":    file,
		"name":    filename,
	}, nil
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

func (a *App) ReadFileByPath(path string) (map[string]string, error) {
	content, err := a.fileManager.OpenFile(path)
	if err != nil {
		return nil, err
	}

	// Extract filename from path
	filename := path
	for i := len(path) - 1; i >= 0; i-- {
		if path[i] == '/' || path[i] == '\\' {
			filename = path[i+1:]
			break
		}
	}

	return map[string]string{
		"content": content,
		"path":    path,
		"name":    filename,
	}, nil
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

func (a *App) ExportToHTML(content string) error {
	// Show save dialog for HTML
	outputPath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Export to HTML",
		DefaultFilename: "export.html",
		Filters: []runtime.FileFilter{
			{DisplayName: "HTML Files", Pattern: "*.html"},
		},
	})
	if err != nil {
		return err
	}
	if outputPath == "" {
		return nil
	}

	html, err := a.renderer.Render(content)
	if err != nil {
		return err
	}
	return a.exporter.ToHTML(html, outputPath)
}

func (a *App) ExportToPDF(filePath string) error {
	var content string
	var err error

	if filePath != "" {
		// If filePath is provided, read from file
		content, err = a.fileManager.OpenFile(filePath)
		if err != nil {
			return err
		}
	} else {
		return nil
	}

	html, err := a.renderer.Render(content)
	if err != nil {
		return err
	}

	// Show save dialog for PDF
	outputPath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Export to PDF",
		DefaultFilename: "export.pdf",
		Filters: []runtime.FileFilter{
			{DisplayName: "PDF Files", Pattern: "*.pdf"},
		},
	})
	if err != nil {
		return err
	}
	if outputPath == "" {
		return nil
	}

	return a.exporter.ToPDF(html, outputPath)
}

func (a *App) ExportContentToPDF(content string) error {
	html, err := a.renderer.Render(content)
	if err != nil {
		return err
	}

	// Show save dialog for PDF
	outputPath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Export to PDF",
		DefaultFilename: "export.pdf",
		Filters: []runtime.FileFilter{
			{DisplayName: "PDF Files", Pattern: "*.pdf"},
		},
	})
	if err != nil {
		return err
	}
	if outputPath == "" {
		return nil
	}

	return a.exporter.ToPDF(html, outputPath)
}

func (a *App) ToggleFullscreen() {
	runtime.WindowToggleMaximise(a.ctx)
}

// Folder operations
func (a *App) OpenFolder() ([]foldermanager.FileNode, error) {
	folder, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Open Folder",
	})
	if err != nil {
		return nil, err
	}
	if folder == "" {
		return nil, nil
	}

	return a.folderManager.OpenFolder(folder)
}

func (a *App) GetFolderTree(path string) ([]foldermanager.FileNode, error) {
	return a.folderManager.OpenFolder(path)
}

func (a *App) ReadFileFromFolder(path string) (string, error) {
	return a.folderManager.ReadFile(path)
}

// Image operations
func (a *App) SavePastedImage(base64Data, documentPath string) (string, error) {
	return a.imageManager.SaveBase64Image(base64Data, documentPath)
}

func (a *App) CopyImageToAssets(sourcePath, documentPath string) (string, error) {
	return a.imageManager.CopyImageToAssets(sourcePath, documentPath)
}

