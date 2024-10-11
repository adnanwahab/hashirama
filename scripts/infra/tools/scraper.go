package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"golang.org/x/net/html"
)

var baseURL = "https://robertheaton.com/"
var visitedURLs = sync.Map{}
var wg sync.WaitGroup

func main() {
	startURL := baseURL + ""
	wg.Add(1)
	scrapePage(startURL)
	wg.Wait()
}

func scrapePage(url string) {
	defer wg.Done()

	if _, visited := visitedURLs.LoadOrStore(url, true); visited {
		return
	}

	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("Error fetching %s: %v\n", url, err)
		return
	}
	defer resp.Body.Close()

	doc, err := html.Parse(resp.Body)
	if err != nil {
		fmt.Printf("Error parsing %s: %v\n", url, err)
		return
	}

	title := extractTitle(doc)
	content := extractContent(doc)

	saveToFile(title, content)

	links := extractLinks(doc)
	for _, link := range links {
		if strings.HasPrefix(link, "/wiki/") && !strings.Contains(link, ":") {
			wg.Add(1)
			go scrapePage(baseURL + link)
		}
	}
}

func extractTitle(n *html.Node) string {
	var title string
	var crawler func(*html.Node)
	crawler = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "h1" {
			title = n.FirstChild.Data
			return
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			crawler(c)
		}
	}
	crawler(n)
	return title
}

func extractContent(n *html.Node) string {
	var content strings.Builder
	var crawler func(*html.Node)
	crawler = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "div" {
			for _, a := range n.Attr {
				if a.Key == "id" && a.Val == "mw-content-text" {
					content.WriteString(renderNode(n))
					return
				}
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			crawler(c)
		}
	}
	crawler(n)
	return content.String()
}

func renderNode(n *html.Node) string {
	var buf strings.Builder
	w := io.Writer(&buf)
	html.Render(w, n)
	return buf.String()
}

func extractLinks(n *html.Node) []string {
	var links []string
	var crawler func(*html.Node)
	crawler = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "a" {
			for _, a := range n.Attr {
				if a.Key == "href" {
					links = append(links, a.Val)
					break
				}
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			crawler(c)
		}
	}
	crawler(n)
	return links
}

func saveToFile(title, content string) {
	filename := filepath.Join("wikipedia_pages", strings.ReplaceAll(title, " ", "_")+".html")
	os.MkdirAll(filepath.Dir(filename), os.ModePerm)
	err := os.WriteFile(filename, []byte(content), 0644)
	if err != nil {
		fmt.Printf("Error saving %s: %v\n", filename, err)
	}
}
