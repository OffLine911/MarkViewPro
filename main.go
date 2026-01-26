package main

import (
	"embed"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	var initialFile string
	if len(os.Args) > 1 {
		arg := os.Args[1]
		ext := strings.ToLower(filepath.Ext(arg))
		if ext == ".md" || ext == ".markdown" {
			if absPath, err := filepath.Abs(arg); err == nil {
				initialFile = absPath
			}
		}
	}

	app := NewApp()
	app.initialFile = initialFile

	err := wails.Run(&options.App{
		Title:             "MarkViewPro",
		Width:             1200,
		Height:            800,
		MinWidth:          800,
		MinHeight:         600,
		DisableResize:     false,
		Frameless:         true,
		StartHidden:       false,
		HideWindowOnClose: false,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 12, G: 12, B: 16, A: 1},
		OnStartup:        app.startup,
		OnShutdown:       app.shutdown,
		Bind: []interface{}{
			app,
		},
		Windows: &windows.Options{
			WebviewIsTransparent:              false,
			WindowIsTranslucent:               false,
			DisableWindowIcon:                 false,
			WebviewUserDataPath:               "",
			WebviewBrowserPath:                "",
			Theme:                             windows.Dark,
			DisableFramelessWindowDecorations: false,
		},
		EnableDefaultContextMenu:         false,
		EnableFraudulentWebsiteDetection: false,
		DragAndDrop: &options.DragAndDrop{
			EnableFileDrop: true,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
