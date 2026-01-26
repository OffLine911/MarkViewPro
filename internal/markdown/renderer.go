package markdown

import (
	"bytes"
	"regexp"
	"strings"
	"unicode"

	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

type Renderer struct {
	md goldmark.Markdown
}

type TOCItem struct {
	Level int    `json:"level"`
	Title string `json:"title"`
	ID    string `json:"id"`
}

type Stats struct {
	Words      int `json:"words"`
	Characters int `json:"characters"`
	Lines      int `json:"lines"`
	Paragraphs int `json:"paragraphs"`
}

type SearchResult struct {
	Line       int    `json:"line"`
	Column     int    `json:"column"`
	Text       string `json:"text"`
	MatchStart int    `json:"matchStart"`
	MatchEnd   int    `json:"matchEnd"`
}

func NewRenderer() *Renderer {
	md := goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			extension.Typographer,
			extension.Footnote,
			highlighting.NewHighlighting(
				highlighting.WithStyle("monokai"),
				highlighting.WithFormatOptions(),
			),
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
			html.WithXHTML(),
			html.WithUnsafe(),
		),
	)

	return &Renderer{md: md}
}

func (r *Renderer) Render(content string) (string, error) {
	var buf bytes.Buffer
	if err := r.md.Convert([]byte(content), &buf); err != nil {
		return "", err
	}
	return buf.String(), nil
}

func (r *Renderer) ExtractTOC(content string) []TOCItem {
	var items []TOCItem
	headingRegex := regexp.MustCompile(`^(#{1,6})\s+(.+)$`)
	lines := strings.Split(content, "\n")

	for _, line := range lines {
		matches := headingRegex.FindStringSubmatch(line)
		if matches != nil {
			level := len(matches[1])
			title := strings.TrimSpace(matches[2])
			id := generateID(title)
			items = append(items, TOCItem{
				Level: level,
				Title: title,
				ID:    id,
			})
		}
	}

	return items
}

func generateID(title string) string {
	id := strings.ToLower(title)
	id = strings.Map(func(r rune) rune {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || r == '-' || r == '_' {
			return r
		}
		if r == ' ' {
			return '-'
		}
		return -1
	}, id)
	id = regexp.MustCompile(`-+`).ReplaceAllString(id, "-")
	id = strings.Trim(id, "-")
	return id
}

func (r *Renderer) GetStats(content string) Stats {
	lines := strings.Split(content, "\n")
	lineCount := len(lines)

	characters := len([]rune(content))

	words := 0
	for _, line := range lines {
		fields := strings.Fields(line)
		words += len(fields)
	}

	paragraphs := 0
	inParagraph := false
	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if trimmed == "" {
			inParagraph = false
		} else if !inParagraph {
			paragraphs++
			inParagraph = true
		}
	}

	return Stats{
		Words:      words,
		Characters: characters,
		Lines:      lineCount,
		Paragraphs: paragraphs,
	}
}

func (r *Renderer) Search(content, query string) []SearchResult {
	if query == "" {
		return nil
	}

	var results []SearchResult
	lines := strings.Split(content, "\n")
	lowerQuery := strings.ToLower(query)

	for i, line := range lines {
		lowerLine := strings.ToLower(line)
		startIndex := 0

		for {
			idx := strings.Index(lowerLine[startIndex:], lowerQuery)
			if idx == -1 {
				break
			}

			actualIdx := startIndex + idx
			contextStart := max(0, actualIdx-30)
			contextEnd := min(len(line), actualIdx+len(query)+30)
			text := line[contextStart:contextEnd]

			if contextStart > 0 {
				text = "..." + text
			}
			if contextEnd < len(line) {
				text = text + "..."
			}

			results = append(results, SearchResult{
				Line:       i + 1,
				Column:     actualIdx + 1,
				Text:       text,
				MatchStart: actualIdx,
				MatchEnd:   actualIdx + len(query),
			})

			startIndex = actualIdx + len(query)
		}
	}

	return results
}
