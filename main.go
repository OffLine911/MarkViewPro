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
	"github.com/wailsapp/wails/v2/pkg/runtime"
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
		SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId: "com.markviewpro.app-8f4a9e2b-3c1d-4e5f-a6b7-8c9d0e1f2a3b",
			OnSecondInstanceLaunch: func(secondInstanceData options.SecondInstanceData) {
				// Bring window to front
				runtime.WindowUnminimise(app.ctx)
				runtime.Show(app.ctx)

				// Check if there's a file argument
				args := secondInstanceData.Args
				if len(args) > 1 {
					arg := args[1]
					ext := strings.ToLower(filepath.Ext(arg))
					if ext == ".md" || ext == ".markdown" {
						if absPath, err := filepath.Abs(arg); err == nil {
							// Emit event to frontend to open file
							runtime.EventsEmit(app.ctx, "open-file-from-instance", absPath)
						}
					}
				}
			},
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
