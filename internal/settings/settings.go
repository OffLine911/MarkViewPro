package settings

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
)

type UserSettings struct {
	Theme           string  `json:"theme"`
	FontSize        int     `json:"fontSize"`
	FontFamily      string  `json:"fontFamily"`
	LineHeight      float64 `json:"lineHeight"`
	EditorTheme     string  `json:"editorTheme"`
	PreviewTheme    string  `json:"previewTheme"`
	AutoSave        bool    `json:"autoSave"`
	AutoSaveDelay   int     `json:"autoSaveDelay"`
	AutoReload      bool    `json:"autoReload"`
	SyncScroll      bool    `json:"syncScroll"`
	ShowLineNumbers bool    `json:"showLineNumbers"`
	WordWrap        bool    `json:"wordWrap"`
	SpellCheck      bool    `json:"spellCheck"`
}

type Settings struct {
	settings UserSettings
	mu       sync.RWMutex
}

func NewSettings() *Settings {
	return &Settings{
		settings: defaultSettings(),
	}
}

func defaultSettings() UserSettings {
	return UserSettings{
		Theme:           "system",
		FontSize:        14,
		FontFamily:      "JetBrains Mono, Consolas, monospace",
		LineHeight:      1.6,
		EditorTheme:     "default",
		PreviewTheme:    "github",
		AutoSave:        true,
		AutoSaveDelay:   3000,
		AutoReload:      true,
		SyncScroll:      true,
		ShowLineNumbers: true,
		WordWrap:        true,
		SpellCheck:      false,
	}
}

func (s *Settings) getConfigPath() string {
	configDir, err := os.UserConfigDir()
	if err != nil {
		configDir = "."
	}
	appDir := filepath.Join(configDir, "MarkViewPro")
	os.MkdirAll(appDir, 0755)
	return filepath.Join(appDir, "settings.json")
}

func (s *Settings) Load() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	data, err := os.ReadFile(s.getConfigPath())
	if err != nil {
		s.settings = defaultSettings()
		return nil
	}

	var loaded UserSettings
	if err := json.Unmarshal(data, &loaded); err != nil {
		s.settings = defaultSettings()
		return err
	}

	s.settings = mergeWithDefaults(loaded)
	return nil
}

func (s *Settings) Save() error {
	s.mu.RLock()
	defer s.mu.RUnlock()

	data, err := json.MarshalIndent(s.settings, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(s.getConfigPath(), data, 0644)
}

func (s *Settings) Get() UserSettings {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.settings
}

func (s *Settings) Update(newSettings UserSettings) error {
	s.mu.Lock()
	s.settings = newSettings
	s.mu.Unlock()

	return s.Save()
}

func mergeWithDefaults(loaded UserSettings) UserSettings {
	defaults := defaultSettings()

	if loaded.Theme == "" {
		loaded.Theme = defaults.Theme
	}
	if loaded.FontSize == 0 {
		loaded.FontSize = defaults.FontSize
	}
	if loaded.FontFamily == "" {
		loaded.FontFamily = defaults.FontFamily
	}
	if loaded.LineHeight == 0 {
		loaded.LineHeight = defaults.LineHeight
	}
	if loaded.EditorTheme == "" {
		loaded.EditorTheme = defaults.EditorTheme
	}
	if loaded.PreviewTheme == "" {
		loaded.PreviewTheme = defaults.PreviewTheme
	}
	if loaded.AutoSaveDelay == 0 {
		loaded.AutoSaveDelay = defaults.AutoSaveDelay
	}

	return loaded
}
