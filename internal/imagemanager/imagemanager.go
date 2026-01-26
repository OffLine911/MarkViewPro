package imagemanager

import (
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type ImageManager struct {
	assetsFolder string
}

func NewImageManager() *ImageManager {
	return &ImageManager{
		assetsFolder: "assets",
	}
}

func (im *ImageManager) SetAssetsFolder(folder string) {
	im.assetsFolder = folder
}

// SaveBase64Image saves a base64 encoded image to the assets folder
func (im *ImageManager) SaveBase64Image(base64Data, documentPath string) (string, error) {
	// Extract the base64 data and mime type
	parts := strings.Split(base64Data, ",")
	if len(parts) != 2 {
		return "", fmt.Errorf("invalid base64 data format")
	}

	// Decode base64
	imageData, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		return "", fmt.Errorf("failed to decode base64: %w", err)
	}

	// Determine file extension from mime type
	mimeType := parts[0]
	ext := ".png"
	if strings.Contains(mimeType, "jpeg") || strings.Contains(mimeType, "jpg") {
		ext = ".jpg"
	} else if strings.Contains(mimeType, "gif") {
		ext = ".gif"
	} else if strings.Contains(mimeType, "webp") {
		ext = ".webp"
	}

	// Create assets folder relative to document
	var assetsPath string
	if documentPath != "" {
		docDir := filepath.Dir(documentPath)
		assetsPath = filepath.Join(docDir, im.assetsFolder)
	} else {
		// Use current directory if no document path
		assetsPath = im.assetsFolder
	}

	// Create assets folder if it doesn't exist
	if err := os.MkdirAll(assetsPath, 0755); err != nil {
		return "", fmt.Errorf("failed to create assets folder: %w", err)
	}

	// Generate unique filename
	timestamp := time.Now().Format("20060102-150405")
	filename := fmt.Sprintf("image-%s%s", timestamp, ext)
	imagePath := filepath.Join(assetsPath, filename)

	// Save image
	if err := os.WriteFile(imagePath, imageData, 0644); err != nil {
		return "", fmt.Errorf("failed to save image: %w", err)
	}

	// Return relative path for markdown
	relativePath := filepath.Join(im.assetsFolder, filename)
	// Convert to forward slashes for markdown
	relativePath = strings.ReplaceAll(relativePath, "\\", "/")

	return relativePath, nil
}

// CopyImageToAssets copies an image file to the assets folder
func (im *ImageManager) CopyImageToAssets(sourcePath, documentPath string) (string, error) {
	// Read source image
	imageData, err := os.ReadFile(sourcePath)
	if err != nil {
		return "", fmt.Errorf("failed to read image: %w", err)
	}

	// Create assets folder relative to document
	var assetsPath string
	if documentPath != "" {
		docDir := filepath.Dir(documentPath)
		assetsPath = filepath.Join(docDir, im.assetsFolder)
	} else {
		assetsPath = im.assetsFolder
	}

	// Create assets folder if it doesn't exist
	if err := os.MkdirAll(assetsPath, 0755); err != nil {
		return "", fmt.Errorf("failed to create assets folder: %w", err)
	}

	// Get filename and extension
	filename := filepath.Base(sourcePath)
	ext := filepath.Ext(filename)
	nameWithoutExt := strings.TrimSuffix(filename, ext)

	// Generate unique filename if file exists
	destPath := filepath.Join(assetsPath, filename)
	counter := 1
	for {
		if _, err := os.Stat(destPath); os.IsNotExist(err) {
			break
		}
		filename = fmt.Sprintf("%s-%d%s", nameWithoutExt, counter, ext)
		destPath = filepath.Join(assetsPath, filename)
		counter++
	}

	// Save image
	if err := os.WriteFile(destPath, imageData, 0644); err != nil {
		return "", fmt.Errorf("failed to save image: %w", err)
	}

	// Return relative path for markdown
	relativePath := filepath.Join(im.assetsFolder, filename)
	// Convert to forward slashes for markdown
	relativePath = strings.ReplaceAll(relativePath, "\\", "/")

	return relativePath, nil
}
