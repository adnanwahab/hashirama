;;; private/my/+bindings.el -*- lexical-binding: t; -*-

(when IS-MAC (setq mac-command-modifier 'meta
                   mac-option-modifier  'alt))

;; Distinguish C-i from TAB
(when (display-graphic-p)
  (define-key input-decode-map "\C-i" [C-i])
  (map! "<C-i>" #'evil-jump-forward))

(map!
 ;; overrides other minor mode keymaps (just for non-evil)
 (:map override ;; general-override-mode-map
       "M-q"   (if (daemonp) #'delete-frame #'save-buffers-kill-terminal)
       "M-p"   (λ! (projectile-invalidate-cache nil) (projectile-find-file))
       "M-y"   #'+default/yank-pop
       "C-]"   #'yas-expand
       "C-'"   #'toggle-input-method
       "<xterm-paste>" #'xterm-paste-with-delete-region
       "C-S-j" #'evil-scroll-line-down
       "C-S-k" #'evil-scroll-line-up
       "C-S-n" #'dap-next
       "M-;"   #'+my/insert-semicolon-at-the-end-of-this-line
       "C-M-;" #'+my/delete-semicolon-at-the-end-of-this-line)
 :nv "gD" #'xref-find-definitions-other-window
 :nv "gr" #'+lookup/references
 ;; Conflict with vertico
 :g "C-SPC" nil :g "C-@" nil
 "M-`"   #'other-frame
 "C-M-o" #'other-frame
 ;; fix OS window/frame navigation/manipulation keys
 "M-w" #'delete-window
 "M-W" #'delete-frame
 "M-n" #'+default/new-buffer
 "M-N" #'make-frame
 "C-M-f" #'toggle-frame-fullscreen
 "M-t" #'transpose-words
 "M-i" #'display-which-function
 :gn "C-t" nil
 ;; Restore OS undo, save, copy, & paste keys (without cua-mode, because
 ;; it imposes some other functionality and overhead we don't need)
 "M-z" #'undo
 "M-Z" #'redo
 "M-c" (if (featurep 'evil) #'evil-yank #'copy-region-as-kill)
 "M-v" #'yank-with-delete-region
 "M-s" #'evil-write-all
 ;; frame-local font scaling
 "M-0" #'doom/reset-font-size
 "M-=" #'doom/increase-font-size
 "M--" #'doom/decrease-font-size
 ;; Conventional text-editing keys & motions
 "M-a" #'mark-whole-buffer
 :gni [M-RET]    #'+default/newline-below
 :gni [M-S-RET]  #'+default/newline-above
 :gi  [M-backspace] #'backward-kill-word
 :gi  [M-left]      #'backward-word
 :gi  [M-right]     #'forward-word
 ;; Searching
 (:when (modulep! :completion vertico)
   "M-f" #'consult-line
   "C-s" #'consult-line)
 (:when (modulep! :completion ivy)
   "M-f" #'swiper
   "C-s" #'swiper)
 "M-e"    #'persp-switch-to-buffer
 ;; "C-M-p"  #'+ivy/project-search-specific-files
 ;; Debug
 "M-u" #'dap-hydra
 ;; Help
 "C-h h"   nil
 "C-h m" #'describe-mode
 "C-h C-k" #'find-function-on-key
 "C-h C-f" #'find-function-at-point
 "C-h C-v" #'find-variable-at-point
 "<f8>"    #'describe-mode
 ;; Comment
 "M-/" (cmd! (save-excursion (comment-line 1)))
 :n "M-/" #'evilnc-comment-or-uncomment-lines
 :v "M-/" #'evilnc-comment-operator
 ;; Others
 :m [tab] nil
 "C-M-\\" #'indent-region-or-buffer
 "M-m"    #'kmacro-call-macro
 )

(if (display-graphic-p)
    (map!
     ;; M-[ does not work in terminal
     "M-[" #'better-jumper-jump-backward
     "M-]" #'better-jumper-jump-forward)
  (map!
   :g "<mouse-4>" #'evil-scroll-line-up
   :g "<mouse-5>" #'evil-scroll-line-down
   ))

(map!
 ;; Unix text-editing keys & motions
 :gi "C-n" #'next-line
 :gi "C-p" #'previous-line
 :gi "C-b" #'backward-char
 :gi "C-f" #'forward-char
 :gi "C-k" #'kill-line
 :gi "C-d" #'delete-forward-char
 ;; For terminal specific keys
 :gnmvi "<deletechar>" (kbd "C-d")

 :v "C-r"   #'+my/evil-quick-replace
 :v "DEL" (kbd "\"_d")
 :v "<del>" (kbd "\"_d")
 :v "<backspace>" (kbd "\"_d")
 :nmv "-" #'better-jumper-jump-backward
 :nmv "=" #'better-jumper-jump-forward
 :gnmvi "C-e" #'doom/forward-to-last-non-comment-or-eol
 :gnmvi "C-a" #'doom/backward-to-bol-or-indent
 :gnmvi "M-." #'+lookup/definition

 (:prefix "C-x"
  :n "e"  #'pp-eval-last-sexp)
 (:prefix "C-c"
  :desc "Text properties at point" :nmv "f" (cmd! (message "%S" (text-properties-at (point))))))

;; leader/localleader is not compatible with :gnvmi
(map! :leader
      :desc "M-x" :nmv "SPC" #'execute-extended-command
      :desc "lispyville" :n "L" (+my/prefix-M-x "lispyville ")
      :desc "Switch to last buffer" :n "l" #'evil-switch-to-windows-last-buffer
      (:prefix-map ("a" . "app")
       "s" #'prodigy
       "b" #'blog-admin-start
       :desc "List process" "p" #'list-processes
       "x" #'align-regexp)
      (:prefix "k"
               "c" #'amz-cr
               "b" #'amz-brief)
      (:prefix "b"                      ; buffer
       "m" #'list-bookmarks
       "h" #'+doom-dashboard/open
       :desc "Revert buffer" "r" #'revert-buffer-no-confirm
       :desc "Reload buffer" "R" #'reload-buffer-no-confirm
       :desc "Fix too many open files" "K" #'file-notify-rm-all-watches
       "U" #'+my/untabify-buffer)
      (:prefix "c"                      ; code
       :desc "Format-all buffer"      "f" #'format-all-buffer
       :desc "Check grammar"          "g" #'langtool-check-buffer
       :desc "Done Check grammar"     "G" #'langtool-check-done
       (:when (modulep! :tools lsp +eglot)
         :desc "Eglot workspace restart"  "R" #'eglot-reconnect
         :desc "Eglot organize imports"   "I" #'eglot-code-action-organize-imports
         :desc "Eglot quickfix" "q" #'eglot-code-action-quickfix
         )
       (:when (not (modulep! :tools lsp +eglot))
         :desc "LSP organize imports"   "I" #'lsp-organize-imports
         :desc "LSP workspace restart"  "R" #'lsp-workspace-restart
         :desc "Treemacs references"    "D" #'lsp-treemacs-references))
      (:prefix "TAB"
       :desc "Switch workspace" "TAB" #'+workspace/switch-to
       :desc "Load worksapce from file" "L" #'+workspace/load
       :desc "Swap left"  "h" #'+workspace/swap-left
       :desc "Swap right" "l" #'+workspace/swap-right)
      (:prefix "f"                      ; file
       :desc "Yank filename" "n" #'+default/yank-filename
       :desc "Save all" "s" #'evil-write-all
       :desc "Deer"     "j" #'deer)
      (:prefix "n"                      ; notes
       :desc "Take screenshot" "p" #'screenshot
       (:prefix "r"
        :desc "show graph" "g" #'org-roam-ui-open))
      (:prefix "g"                      ; git
               "s" nil
               (:after smerge-mode
                :desc "Smerge" "s" smerge-basic-map)
               :desc "Browse file or region" "oo" #'git-link
               :desc "Magit browse commit"   "oc" #'+vc/git-browse-commit
               :desc "Magit wip worktree"    "w"  #'magit-wip-log-worktree
               :desc "M-x magit-*" "*" (+my/prefix-M-x "magit-"))
      (:prefix "h"                      ; help
               "C" #'helpful-command)
      (:prefix "w"
       :desc "Pin tab" "p" (λ! (dotimes (n 50) (centaur-tabs-move-current-tab-to-left) nil)))
      (:prefix "o"                      ; open
       :desc "Kill ring"             "k" #'+default/yank-pop
       :desc "Imenu list"            "i" #'imenu-list
       :desc "Open link"             "x" #'link-hint-open-link
       :desc "Open link at point"    "X" #'link-hint-open-link-at-point
       :desc "Youdao dictionary"     "y" (if (display-graphic-p) #'youdao-dictionary-search-at-point-tooltip
                                           #'youdao-dictionary-search-at-point)
       :desc "Youdao play voice"     "Y" #'youdao-dictionary-play-voice-at-point
       :desc "Google Translate"      "g" #'go-translate
       :desc "Docker open apps"      ";" #'+docker/reveal-in-apps
       (:when IS-MAC
         :desc "Reveal in default program"  "f" #'+macos/open-in-default-program
         :desc "Reveal in Finder"           "o" #'+macos/reveal-in-finder
         :desc "Reveal project in Finder"   "O" #'+macos/reveal-project-in-finder
         :desc "Reveal in Terminal"         "t" #'+macos/reveal-in-terminal
         :desc "Reveal project in Terminal" "T" #'+macos/reveal-project-in-terminal
         :desc "Reveal file in Apps"        "," #'+shell/reveal-in-apps
         :desc "Reveal project in Apps"     "." #'+shell/reveal-project-in-apps)
       (:when IS-LINUX
         :desc "Reveal in default program"  "f" #'+shell/open-in-default-program
         :desc "Reveal in Finder"           "o" #'+shell/reveal-in-finder
         :desc "Reveal project in Finder"   "O" #'+shell/reveal-project-in-finder
         :desc "Reveal in Terminal"         "t" #'+shell/reveal-in-terminal
         :desc "Reveal project in Terminal" "T" #'+shell/reveal-project-in-terminal
         :desc "Reveal file in Apps"        "," #'+shell/reveal-in-apps
         :desc "Reveal project in Apps"     "." #'+shell/reveal-project-in-apps))
      (:prefix "i"                      ; insert
               "v" #'add-dir-local-variable
               "o" #'symbol-overlay-put
               "q" #'symbol-overlay-remove-all)
      (:prefix "p"                      ; project
       "n" #'+default/yank-project-name
       :desc "Switch projects" "p" (λ! (update-projectile-known-projects) (projectile-switch-project))
       "*" (+my/prefix-M-x "projectile-")
       :desc "Update projectile list" "u" #'update-projectile-known-projects)
      (:prefix "e"                      ;error
               "d" #'posframe-delete-all)
      (:prefix "t"                      ; toggle
       :desc "Pomodoro timer" "t" #'pomm
       "c" #'rainbow-mode
       "C" #'centered-window-mode
       "d" #'toggle-debug-on-error
       "D" #'+my/realtime-elisp-doc
       "l" #'toggle-display-line-numbers-type
       "k" #'keycast-log-mode
       "T" #'toggle-truncate-lines
       "S" #'size-indication-mode
       "i" #'highlight-indent-guides-mode
       "v" #'visual-line-mode)
      (:prefix-map ("j" . "jump")
                   "j" #'avy-goto-char-timer
                   "l" #'avy-goto-line
                   "b" #'avy-pop-mark
                   "t" #'yas-describe-tables)
      (:prefix "s"                      ; search
       :desc "Comments" "c" #'imenu-comments
       :desc "M-x amazon-search-*" "a" (+my/prefix-M-x "amazon-search-wiki")
       :desc "Search Workspace" "w" #'+default/search-workspace
       :desc "Search Project (hidden)" "h" #'+default/search-project-with-hidden-files))

(map!
 (:map prog-mode-map
  :i "TAB" #'doom/dumb-indent
  :i "<backtab>" #'doom/dumb-dedent)
 (:after ranger
         (:map ranger-normal-mode-map
               "M-1" nil "M-2" nil "M-3" nil "M-4" nil "M-5" nil "M-6" nil "M-7" nil "M-8" nil "M-9" nil "M-0" nil
               "g"   nil
               "q" #'ranger-close-and-kill-inactive-buffers
               "f" #'find-file
               "F" #'dired-narrow                 ; use `; g` to quit dired-narrow
               "M-g" #'ranger-go
               "yr" #'ranger-copy-relative-path
               "C-TAB" #'ranger-next-tab
               "C-S-TAB" #'ranger-prev-tab
               "U" #'dired-unmark-all-files
               "u" #'dired-unmark
               "(" #'dired-hide-details-mode
               "+" #'dired-create-directory))
 (:after lispy
         (:map lispy-mode-map
          :i "_" #'special-lispy-different
          :i [remap kill-line] #'lispy-kill
          :i [remap delete-backward-char] #'lispy-delete-backward
          :n "M-r" nil :n "M-s" nil :n "M-v" nil
          :n "M-<left>" #'lispy-forward-barf-sexp
          :n "M-<right>" #'lispy-forward-slurp-sexp
          :n "C-M-<left>" #'lispy-backward-slurp-sexp
          :n "C-M-<right>" #'lispy-backward-barf-sexp))
 (:after lispyville
         (:map lispyville-mode-map
          :n "M-r" nil :n "M-s" nil :n "M-v" nil
          :n "C-M-r" #'lispy-raise-sexp
          :n "C-M-s" #'lispy-splice
          :n "M-V"   #'lispy-convolute-sexp
          :n "TAB" #'lispyville-prettify))
 (:after outline
  :map outline-mode-map
  :n "C-k" nil
  :n "C-j" nil)
 (:after elisp-mode
  :map emacs-lisp-mode-map
  :n "gh" #'helpful-at-point)
 (:after lsp-ui
  :map lsp-ui-mode-map
  "C-j" #'lsp-ui-doc-mode)
 (:after lsp-ui-peek
  :map lsp-ui-peek-mode-map
  "h" #'lsp-ui-peek--select-prev-file
  "j" #'lsp-ui-peek--select-next
  "k" #'lsp-ui-peek--select-prev
  "l" #'lsp-ui-peek--select-next-file)
 :nv "gb" #'lsp-ui-peek-jump-backward
 (:after cc-mode
         (:map java-mode-map
          :localleader
          :desc "Add import" "i" #'lsp-java-add-import)
         (:map c++-mode-map
          :localleader :prefix ("t" "toggle")
          :desc "Copy lldb breakpoint" "b" #'+cc/copy-lldb-breakpoint-of-current-line))
 (:after go-mode
         (:map go-mode-map
          :localleader
          (:prefix "t"
           "y" #'+go/copy-go-test-dlv-cmd
           "Y" #'+go/copy-go-test-run-cmd
           ;; :desc "Insert breakpoint" "b" #'+go/insert-go-breakpoint
           (:prefix ("B" . "bench")
                    "s" #'+go/bench-single
                    "a" #'+go/bench-all))))
 (:after org
         (:map org-mode-map
          :localleader
          "z" #'org-add-note
          "L" #'org-toggle-link-display))
 (:after evil-vars
         (:map evil-window-map
          :leader
          (:prefix "w"
           :desc "evil-window-decrease-height" "-" (cmd! (evil-window-decrease-height 10))
           :desc "evil-window-increase-height" "+" (cmd! (evil-window-increase-height 10))
           :desc "evil-window-decrease-width" "<"  (cmd! (evil-window-decrease-width 20))
           :desc "evil-window-increase-width" ">"  (cmd! (evil-window-increase-width 20)))))
 (:after iedit
         (:map iedit-mode-occurrence-keymap
               "M-D" nil))
 (:after edebug
         (:map edebug-mode-map "c" #'edebug-go-mode))
 (:after evil-org
         (:map evil-org-mode-map
          :i "C-d" nil :i "C-t" nil :i "C-h" nil :i "C-k" nil))
 (:after markdown-mode
         (:map evil-markdown-mode-map
          :i "C-d" nil)
         (:map markdown-mode-map
          :desc "Markdown Cycle" :nv [tab] #'markdown-cycle
          :desc "Insert item below" :ni "<C-return>"  #'markdown-insert-list-item
          (:localleader
           :desc "highlight" "ih" #'+my/markdown-highlight
           (:when IS-MAC
             :desc "Reveal in Typora" "o" #'+macos/reveal-in-typora)
           (:when IS-LINUX
             :desc "Reveal in Typora" "o" #'+shell/reveal-in-typora)
           :desc "Fix Copy"           "F" #'+my/markdown-copy-fix
           :desc "Insert header line" "-" #'org-table-insert-hline
           :desc "Crete Table from region" "|" #'org-table-create-or-convert-from-region
           :desc "Edit" "x" (+my/simulate-key "C-c C-s")
           (:prefix ("i" . "Insert")
                    "r" #'markdown-table-insert-row
                    "c" #'markdown-table-insert-column))))
 (:when (modulep! :completion vertico)
   (:after vertico
    :map vertico-map
    "C-j" nil "C-k" nil
    "C-j"   #'+vertico/embark-preview
    "C-n"   #'vertico-next
    "C-M-n" #'+vertico/next-candidate-preview
    "C-S-n" #'vertico-next-group
    "C-p"   #'vertico-previous
    "A-v"   #'vertico-scroll-down
    "C-v"   #'vertico-scroll-up
    "C-M-p" #'+vertico/previous-candidate-preview
    "C-S-p" #'vertico-previous-group))
 (:when (modulep! :completion ivy)
   (:after wgrep
    :map wgrep-mode-map
    :nv "gr" #'ivy-occur-revert-buffer
    :n "RET" #'ivy-occur-press-and-switch)
   (:after ivy
    :map ivy-occur-grep-mode-map
    "<backspace>" #'ivy-occur-delete-candidate
    :nv "gr" #'ivy-occur-revert-buffer
    :map ivy-minibuffer-map
    "TAB" #'ivy-partial-or-done
    "<M-return>" #'ivy-immediate-done
    "C-b" nil
    "C-r" #'ivy-reverse-i-search      ; similar to ivy-restrict-to-matches
    "C-j" #'ivy-call-and-recenter
    "C-k" #'ivy-kill-line
    "C-v" #'ivy-scroll-up-command
    "A-v" #'ivy-scroll-down-command))
 (:after transient
  :map transient-map
  "C-p" #'transient-history-prev
  "C-n" #'transient-history-next
  "C-k" #'transient-history-prev
  "C-j" #'transient-history-next)
 (:after minibuffer
  :map minibuffer-local-map
  (:when (modulep! :completion vertico)
    "M-RET" #'vertico-exit-input)
  "C-t" #'marginalia-cycle
  "C-k" #'kill-line)
 (:after magit-mode
         (:map magit-mode-map "M-p" nil "M-n" nil "M-w" nil
          :nv "$" #'magit-process-buffer
          "C-c r" #'code-review-forge-pr-at-point))
 (:after magit-diff
         (:map magit-diff-mode-map            ; for magit diff/rev mode
               "C-o" #'magit-diff-visit-file-other-window))
 (:after magit-blame
         (:map magit-blame-mode-map
          :n "o" #'magit-blame--git-link-commit))
 (:after evil-vars
  :map evil-ex-completion-map
  "C-b" nil
  "C-k" #'kill-line
  "C-d" #'delete-forward-char)
 (:after evil-collection-info
  :map Info-mode-map
  "/" #'Info-search
  "?" #'Info-search-backward)
 (:after company
         (:map company-active-map
               "TAB" nil [tab] nil [backtab] nil
               "C-j" #'company-show-location
               "C-i" #'company-complete-selection))
 (:after adoc-mode
         (:map adoc-mode-map
          :localleader
          :desc "adoc preview" "p" (cmd! (browse-url buffer-file-name))))
 (:after vterm
         (:map vterm-mode-map
               "M-e" nil
               "M-w" #'+workspace/close-window-or-workspace))
 (:after term
         (:map term-raw-map
          :i "M-v" #'term-paste)))
