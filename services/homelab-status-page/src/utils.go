package main

import (
    //"fmt"
    // "net/http"
    "html/template"


    //"os"
    "strings"
    //"sync"
    //"io"
    //"github.com/a-h/templ"
    "github.com/labstack/echo/v4"
)

func renderThemes() string {
    tmpl := `
    {{range $index, $theme := .}}
        <h3 class="text-xl font-semibold mt-6 mb-3 text-indigo-700">{{.Name}}</h3>
        <ul class="space-y-2">
            {{range $toolIndex, $tool := .Tools}}
                <li>
                    <a href="/tools/{{$tool}}" class="pl-16 hover:text-indigo-500 transition-colors">
                        {{add $toolIndex 1}}. {{$tool}}
                    </a>
                </li>
            {{end}}
        </ul>
    {{end}}
    `

    funcMap := template.FuncMap{
        "add": func(a, b int) int {
            return a + b
        },
    }

    t, err := template.New("themes").Funcs(funcMap).Parse(tmpl)
    if err != nil {
        return err.Error()
    }

    var result strings.Builder
    err = t.Execute(&result, themes)
    if err != nil {
        return err.Error()
    }

    return result.String()
}

func customHTTPErrorHandler(err error, c echo.Context) {
    // Implementation
}

// func unsafe(html string) templ.Component {
//     return templ.ComponentFunc(func(ctx echo.Context, w io.Writer) (err error) {
//         _, err = io.WriteString(w, html)
//         return
//     })
// }

