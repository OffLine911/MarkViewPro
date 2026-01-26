package filemanager

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const maxRecentFiles = 10

type RecentFile struct {
	Path       string    `json:"path"`
	Name       string    `json:"name"`
	AccessedAt time.Time `json:"accessedAt"`
}

type FileManager struct {
	ctx             context.Context
	currentFilePath string
	recentFiles     []RecentFile
	watcher         *fsnotify.Watcher
	watcherDone     chan bool
	mu              sync.RWMutex
}

func NewFileManager() *FileManager {
	fm := &FileManager{
		recentFiles: make([]RecentFile, 0),
	}
	fm.loadRecentFiles()
	return fm
}

func (fm *FileManager) SetContext(ctx context.Context) {
	fm.ctx = ctx
}

func (fm *FileManager) OpenFile(path string) (string, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}

	fm.mu.Lock()
	fm.currentFilePath = path
	fm.mu.Unlock()

	fm.addToRecentFiles(path)

	return string(content), nil
}

func (fm *FileManager) SaveFile(path, content string) error {
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	err := os.WriteFile(path, []byte(content), 0644)
	if err != nil {
		return err
	}

	fm.mu.Lock()
	fm.currentFilePath = path
	fm.mu.Unlock()

	fm.addToRecentFiles(path)

	return nil
}

func (fm *FileManager) GetCurrentFilePath() string {
	fm.mu.RLock()
	defer fm.mu.RUnlock()
	return fm.currentFilePath
}

func (fm *FileManager) addToRecentFiles(path string) {
	fm.mu.Lock()
	defer fm.mu.Unlock()

	absPath, err := filepath.Abs(path)
	if err != nil {
		absPath = path
	}

	for i, rf := range fm.recentFiles {
		if rf.Path == absPath {
			fm.recentFiles = append(fm.recentFiles[:i], fm.recentFiles[i+1:]...)
			break
		}
	}

	newRecent := RecentFile{
		Path:       absPath,
		Name:       filepath.Base(absPath),
		AccessedAt: time.Now(),
	}

	fm.recentFiles = append([]RecentFile{newRecent}, fm.recentFiles...)

	if len(fm.recentFiles) > maxRecentFiles {
		fm.recentFiles = fm.recentFiles[:maxRecentFiles]
	}

	fm.saveRecentFiles()
}

func (fm *FileManager) GetRecentFiles() []RecentFile {
	fm.mu.RLock()
	defer fm.mu.RUnlock()

	valid := make([]RecentFile, 0)
	for _, rf := range fm.recentFiles {
		if _, err := os.Stat(rf.Path); err == nil {
			valid = append(valid, rf)
		}
	}
	return valid
}

func (fm *FileManager) ClearRecentFiles() {
	fm.mu.Lock()
	defer fm.mu.Unlock()
	fm.recentFiles = make([]RecentFile, 0)
	fm.saveRecentFiles()
}

func (fm *FileManager) getConfigPath() string {
	configDir, err := os.UserConfigDir()
	if err != nil {
		configDir = "."
	}
	appDir := filepath.Join(configDir, "MarkViewPro")
	os.MkdirAll(appDir, 0755)
	return filepath.Join(appDir, "recent.json")
}

func (fm *FileManager) loadRecentFiles() {
	data, err := os.ReadFile(fm.getConfigPath())
	if err != nil {
		return
	}
	json.Unmarshal(data, &fm.recentFiles)
}

func (fm *FileManager) saveRecentFiles() {
	data, err := json.MarshalIndent(fm.recentFiles, "", "  ")
	if err != nil {
		return
	}
	os.WriteFile(fm.getConfigPath(), data, 0644)
}

func (fm *FileManager) StartWatching(path string) error {
	fm.StopWatching()

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}

	fm.watcher = watcher
	fm.watcherDone = make(chan bool)

	go func() {
		// Debounce mechanism to avoid multiple rapid events
		var debounceTimer *time.Timer
		debounceDuration := 100 * time.Millisecond

		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				if event.Has(fsnotify.Write) {
					if debounceTimer != nil {
						debounceTimer.Stop()
					}
					debounceTimer = time.AfterFunc(debounceDuration, func() {
						if fm.ctx != nil {
							runtime.EventsEmit(fm.ctx, "file:changed", event.Name)
						}
					})
				}
			case _, ok := <-watcher.Errors:
				if !ok {
					return
				}
			case <-fm.watcherDone:
				return
			}
		}
	}()

	return watcher.Add(path)
}

func (fm *FileManager) StopWatching() {
	if fm.watcher != nil {
		if fm.watcherDone != nil {
			close(fm.watcherDone)
		}
		fm.watcher.Close()
		fm.watcher = nil
		fm.watcherDone = nil
	}
}
