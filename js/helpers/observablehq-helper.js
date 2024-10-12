const { serve } = require('bun');


const testKeyBinds = function ( ) {

    const actions = [
      "Select next cell", // Navigate to the next cell
      "Select previous cell", // Navigate to the previous cell
      "Select current and downstream cells", // Select the current and downstream cells
      "Insert cell below", // Insert a new cell below
      "Run cell" // Run the cell
    ];
  
  
    for (let i = 0; i < 2; i++) {
      sendMessage({keybind: actions})
    }
    
  }
  
  //
  // make keybinds clickable - 
  function keyBinds(action) {
  
  
    const keyBindDictionary= {
      "Navigating between cells": {
        "Focus next cell": "⌥⇥",
        "Focus previous cell": "⌥⇧⇥",
        "At cell reference, jump to definition": "⌘J",
        "Jump to previously-focused cell": "⇧⌘J",
        "Move cell down": "⌃⇧↓",
        "Move cell up": "⌃⇧↑",
        "Blur cell": "⎋"
      },
      "Inserting and deleting cells": {
        "Insert cell below": "⌘↩︎",
        "Insert cell above": "⇧⌘↩︎",
        "Split cell, then focus below": "⌥↩︎",
        "Split cell, then focus above": "⌥⇧↩︎",
        "At cell start, merge with cell above": "⌥⌫",
        "At cell end, merge with cell below": "⌃⌥D",
        "Copy cell and insert it below": "⌥⇧⌘↓",
        "Copy cell and insert it above": "⌥⇧⌘↑"
      },
      "Editing text": {
        "Run cell": "⇧↩︎",
        "Upload a file": "⇧⌘U",
        "Show code suggestions": "⌃Space",
        "Accept code suggestion": "⇥",
        "Pin or unpin editor": "⌘.",
        "Show or hide output": "⌘,",
        "Format code automatically": "⌥⇧F",
        "Indent automatically": "⌘⌥\\",
        "Indent more": "⌘]",
        "Indent less": "⌘[",
        "Comment lines": "⌘/",
        "Delete character before cursor": "⌫",
        "Delete character after cursor": "fn⌫",
        "Delete to start of word before cursor": "⌥⌫",
        "Delete to start of word after cursor": "⌥fn⌫",
        "Delete to start of line": "⌘⌫",
        "Delete to end of line": "⌘fn⌫",
        "Swap characters around cursor": "⌃T",
        "Insert a new line, and indent": "↩︎",
        "Insert a new line": "⌃O",
        "Delete line": "⇧⌘K",
        "Move line up": "⌥↑",
        "Move line down": "⌥↓",
        "Copy line up": "⌥⇧↑",
        "Copy line down": "⌥⇧↓"
      },
      "Editing prose": {
        "Bold": "⌘B",
        "Italic": "⌘I",
        "Strikethrough": "⇧⌘X",
        "Link": "⌘K",
        "Numbered list": "⇧⌘7",
        "Bulleted list": "⇧⌘8",
        "Heading 1 (or 2, 3, etc.)": "⌥⌘1…6",
        "Clear heading": "⌥⌘0",
        "Monospaced font (code)": "⇧⌘C"
      },
      "Navigating text": {
        "Move caret to…": "←→↑↓",
        "Start of next word": "⌥→",
        "Start of previous word": "⌥←",
        "Start of line": "fn←",
        "End of line": "fn→",
        "Start of line, without wrapping": "⌘←",
        "End of line, without wrapping": "⌘→",
        "Start of cell": "⌘↑",
        "End of cell": "⌘↓",
        "Previous screen": "fn↑",
        "Next screen": "fn↓"
      },
      "Multiple carets": {
        "Add caret": "⌘+ Click",
        "Clear additional carets": "⎋"
      },
      "Selecting text": {
        "Extend selection to…": "⇧←→↑↓",
        "Start of previous word": "⌥⇧←",
        "End of next word": "⌥⇧→",
        "Start of current line": "⇧fn←",
        "End of current line": "⇧fn→",
        "Start of current line without wrapping": "⇧⌘←",
        "End of current line without wrapping": "⇧⌘→",
        "Start of current cell": "⇧⌘↑",
        "End of current cell": "⇧⌘↓",
        "Previous screen": "⇧fn↑",
        "Next screen": "⇧fn↓",
        "Select all": "⌘A",
        "Select next occurrence": "⌘D",
        "Add cursor at end of selected lines": "⇧⌥I",
        "Clear selection": "⎋"
      },
      "Multiple selections": {
        "Add range selection": "⌘+ Drag",
        "Add box selection": "⌥⌘+ Drag",
        "Replace selection with box selection": "⌥+ Drag",
        "Clear additional selections": "⎋"
      },
      "Selecting cells": {
        "In left margin, select cell": "⌘+ Click",
        "Cut cells": "⌘X",
        "Copy cells": "⌘C",
        "Paste cells": "⌘V",
        "Select next cell": "↑",
        "Select previous cell": "↓",
        "Select next and current cell": "⇧↑",
        "Select previous and current cell": "⇧↓",
        "Select next cell": "J",
        "Select previous cell": "K",
        "Select next and current cell": "⇧J",
        "Select previous and current cell": "⇧K",
        "Select current and upstream cells": "⇧←",
        "Select current and downstream cells": "⇧→",
        "Select or unselect current cell": "X",
        "Run cells": "⇧↩︎",
        "Move cells up": "⌥↑",
        "Move cells down": "⌥↓",
        "Duplicate cells up": "⌥⇧↑",
        "Duplicate cells down": "⌥⇧↓",
        "Pin or unpin cells": ".",
        "Show or hide outputs": ",",
        "Delete cells": "D",
        "Add comment": "C",
        "Insert cell below": "O",
        "Insert cell above": "⇧O",
        "Insert cell of same type below": "⌥↩︎",
        "Insert cell of same type above": "⌥⇧↩︎",
        "Select all": "⇧A",
        "Clear selection": "⎋"
      },
      "Find and replace": {
        "Open find pane": "⇧⌘F",
        "Find next occurrence": "⌘G",
        "Find previous occurrence": "⇧⌘G",
        "In find input, find next occurrence": "↩︎",
        "In find input, find previous occurrence": "Shift+Enter",
        "In replace input, replace current occurrence": "↩︎"
      },
      "Site Navigation": {
        "Open help pane": "⇧?",
        "Open search modal": "/",
        "Exit current pane / modal": "⎋",
        "Enter fullscreen": "F",
        "Enter Tinker mode": "T"
      }
    }
  
    const keyCodeMap = {
      "⌥⇥": "Alt+Tab",
      "⌥⇧⇥": "Alt+Shift+Tab",
      "⌘J": "Meta+J",
      "⇧⌘J": "Shift+Meta+J",
      "⌃⇧↓": "Control+Shift+ArrowDown",
      "⌃⇧↑": "Control+Shift+ArrowUp",
      "⎋": "Escape",
      "⌘↩︎": "Meta+Enter",
      "⇧⌘↩︎": "Shift+Meta+Enter",
      "⌥↩︎": "Alt+Enter",
      "⌥⇧↩︎": "Alt+Shift+Enter",
      "⌥⌫": "Alt+Backspace",
      "⌃⌥D": "Control+Alt+D",
      "⌥⇧⌘↓": "Alt+Shift+Meta+ArrowDown",
      "⌥⇧⌘↑": "Alt+Shift+Meta+ArrowUp",
      "⇧↩︎": "Shift+Enter",
      "⇧⌘U": "Shift+Meta+U",
      "⌃Space": "Control+Space",
      "⇥": "Tab",
      "⌘.": "Meta+.",
      "⌘,": "Meta+,",
      "⌥⇧F": "Alt+Shift+F",
      "⌘⌥\\": "Meta+Alt+\\",
      "⌘]": "Meta+]",
      "⌘[": "Meta+[",
      "⌘/": "Meta+/",
      "⌫": "Backspace",
      "fn⌫": "Fn+Backspace",
      "⌥fn⌫": "Alt+Fn+Backspace",
      "⌘⌫": "Meta+Backspace",
      "⌘fn⌫": "Meta+Fn+Backspace",
      "⌃T": "Control+T",
      "↩︎": "Enter",
      "⌃O": "Control+O",
      "⇧⌘K": "Shift+Meta+K",
      "⌥↑": "Alt+ArrowUp",
      "⌥↓": "Alt+ArrowDown",
      "⌥⇧↑": "Alt+Shift+ArrowUp",
      "⌥⇧↓": "Alt+Shift+ArrowDown",
      "⌘B": "Meta+B",
      "⌘I": "Meta+I",
      "⇧⌘X": "Shift+Meta+X",
      "⌘K": "Meta+K",
      "⇧⌘7": "Shift+Meta+7",
      "⇧⌘8": "Shift+Meta+8",
      "⌥⌘1…6": "Alt+Meta+1…6",
      "⌥⌘0": "Alt+Meta+0",
      "⇧⌘C": "Shift+Meta+C",
      "←→↑↓": "ArrowKeys",
      "⌥→": "Alt+ArrowRight",
      "⌥←": "Alt+ArrowLeft",
      "fn←": "Fn+ArrowLeft",
      "fn→": "Fn+ArrowRight",
      "⌘←": "Meta+ArrowLeft",
      "⌘→": "Meta+ArrowRight",
      "⌘↑": "Meta+ArrowUp",
      "⌘↓": "Meta+ArrowDown",
      "fn↑": "Fn+ArrowUp",
      "fn↓": "Fn+ArrowDown",
      "⌘+ Click": "Meta+Click",
      "⇧←→↑↓": "Shift+ArrowKeys",
      "⌥⇧←": "Alt+Shift+ArrowLeft",
      "⌥⇧→": "Alt+Shift+ArrowRight",
      "⇧fn←": "Shift+Fn+ArrowLeft",
      "⇧fn→": "Shift+Fn+ArrowRight",
      "⇧⌘←": "Shift+Meta+ArrowLeft",
      "⇧⌘→": "Shift+Meta+ArrowRight",
      "⇧⌘↑": "Shift+Meta+ArrowUp",
      "⇧⌘↓": "Shift+Meta+ArrowDown",
      "⇧fn↑": "Shift+Fn+ArrowUp",
      "⇧fn↓": "Shift+Fn+ArrowDown",
      "⌘A": "Meta+A",
      "⌘D": "Meta+D",
      "⇧⌥I": "Shift+Alt+I",
      "⌘+ Drag": "Meta+Drag",
      "⌥⌘+ Drag": "Alt+Meta+Drag",
      "⌥+ Drag": "Alt+Drag",
      "⌘X": "Meta+X",
      "⌘C": "Meta+C",
      "⌘V": "Meta+V",
      "J": "J",
      "K": "K",
      "⇧J": "Shift+J",
      "⇧K": "Shift+K",
      "⇧←": "Shift+ArrowLeft",
      "⇧→": "Shift+ArrowRight",
      "X": "X",
      "D": "D",
      "C": "C",
      "O": "O",
      "⇧O": "Shift+O",
      "⇧A": "Shift+A",
      "⇧⌘F": "Shift+Meta+F",
      "⌘G": "Meta+G",
      "⇧⌘G": "Shift+Meta+G",
      "Shift+Enter": "Shift+Enter",
      "⇧?": "Shift+?",
      "/": "/",
      "F": "F",
      "T": "T",
      ".": "Meta+.",
      ",": "Meta+,",
    };
  
  const keyBindOfAction = keyBindDictionary[action];
  const keyCode = keyCodeMap[keyBindOfAction]
  return keyCode
  }

  function isAgentDashboard() {
    return window.location.href === 'https://observablehq.com/@roboticsuniversity/agent-dashboard';
  }
  


  function checkKeyBinds(keyBindDictionary, keyCodeMap) {
    const missingKeyBinds = [];
  
    for (const category in keyBindDictionary) {
      for (const action in keyBindDictionary[category]) {
        const keyBind = keyBindDictionary[category][action];
        if (!keyCodeMap.hasOwnProperty(keyBind)) {
          missingKeyBinds.push({ action, keyBind });
        }
      }
    }
  
    if (missingKeyBinds.length > 0) {
      console.log("Missing key-binds in keyCodeMap:");
      missingKeyBinds.forEach(({ action, keyBind }) => {
        console.log(`missing Action: ${action}, Key-bind: ${keyBind}`);
      });
    } else {
      console.log("All key-binds are present in keyCodeMap.");
    }
  }






const wsServer = serve({
  port: 3000,
  websocket: {
    open(ws) {
      console.log('A client connected.');
      ws.send('Welcome to the Bun WebSocket server!');

      setInterval(() => {
        const randomMessage = Math.random().toString(36).substring(2, 15);
        ws.send(JSON.stringify({ message: randomMessage }));
        console.log(`Sent random message: ${randomMessage}`);
      }, 1000);

      setInterval(() => {
        ws.send(JSON.stringify({ 
          command: "getContent",
          selector: '.entity-result__title-text'
        }));  
      }, 1000);

      // New interval to scroll to the bottom and send a selector for '*'
      setInterval(() => {
        ws.send(JSON.stringify({
          command: "scrollToBottom"
        }));
        ws.send(JSON.stringify({
          command: "getContent",
          selector: '*'
        }));
        console.log('Scrolled to bottom and sent selector for *');
      }, 5000);
    },
    message(ws, message) {
      console.log('Received message from client:', message);
      ws.send(`Server response to: ${message}`);
    },
    close(ws) {
      console.log('A client disconnected.');
    },
  },
});
console.log(wsServer);
console.log('WebSocket server is running on ws://localhost:3000');




//conect to ws-clietn//
