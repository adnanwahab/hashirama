package main

type Agent struct {
    Name string `json:"name" form:"name"`
    Type string `json:"type" form:"type"`
}

type Theme struct {
    Name  string
    Tools []string
}

var agents []Agent

var themes = []Theme{
    {
        Name:  "On Device / On Prem AI / consumer creative AI",
        Tools: []string{"linux-intelligence", "apm.el", "kyubii"},
    },
    {
        Name:  "Robotics + ML",
        Tools: []string{"multiplayer-command-and-control", "continuous-eval", "simulation-pixel-streaming", "auto-labeling"},
    },
    {
        Name:  "Domain Knowledge / Expertise",
        Tools: []string{"agent-playground", "dating-photos", "robot-doctor"},
    },
}
