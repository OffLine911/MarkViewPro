package foldermanager

import (
	"context"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type FileNode struct {
	Name        string      `json:"name"`
	Path        string      `json:"path"`
	IsDirectory bool        `json:"isDirectory"`
	Children    []FileNode  `json:"children,omitempty"`
}

type FolderManager struct {
	ctx         context.Context
	currentPath string
}

func NewFolderManager() *FolderManager {
	return &FolderManager{}
}

func (fm *FolderManager) SetContext(ctx context.Context) {
	fm.ctx = ctx
}

func (fm *FolderManager) OpenFolder(path string) ([]FileNode, error) {
	fm.currentPath = path
	return fm.buildFileTree(path, 0, 3) // Max depth of 3
}

func (fm *FolderManager) buildFileTree(path string, currentDepth, maxDepth int) ([]FileNode, error) {
	if currentDepth >= maxDepth {
		return nil, nil
	}

	entries, err := os.ReadDir(path)
	if err != nil {
		return nil, err
	}

	var nodes []FileNode

	for _, entry := range entries {
		// Skip hidden files and common ignore patterns
		if strings.HasPrefix(entry.Name(), ".") ||
			entry.Name() == "node_modules" ||
			entry.Name() == "dist" ||
			entry.Name() == "build" {
			continue
		}

		fullPath := filepath.Join(path, entry.Name())
		node := FileNode{
			Name:        entry.Name(),
			Path:        fullPath,
			IsDirectory: entry.IsDir(),
		}

		// Only include markdown files and directories
		if entry.IsDir() {
			children, err := fm.buildFileTree(fullPath, currentDepth+1, maxDepth)
			if err == nil {
				node.Children = children
			}
			nodes = append(nodes, node)
		} else if strings.HasSuffix(strings.ToLower(entry.Name()), ".md") ||
			strings.HasSuffix(strings.ToLower(entry.Name()), ".markdown") {
			nodes = append(nodes, node)
		}
	}

	// Sort: directories first, then files, both alphabetically
	sort.Slice(nodes, func(i, j int) bool {
		if nodes[i].IsDirectory != nodes[j].IsDirectory {
			return nodes[i].IsDirectory
		}
		return strings.ToLower(nodes[i].Name) < strings.ToLower(nodes[j].Name)
	})

	return nodes, nil
}

func (fm *FolderManager) GetCurrentPath() string {
	return fm.currentPath
}

func (fm *FolderManager) ReadFile(path string) (string, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(content), nil
}
