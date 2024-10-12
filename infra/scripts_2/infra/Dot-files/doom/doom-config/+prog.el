;;; ~/.doom.d/+prog.el -*- lexical-binding: t; -*-

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; MISC
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(add-hook! compilation-mode #'visual-line-mode)

(use-package! format-all
  ;; :hook (emacs-lisp-mode . format-all-mode)
  :defer t)


(use-package! which-func
  :defer t
  :commands which-function)


(after! company
  ;; (setq company-idle-delay 0.2)
  (setq company-format-margin-function #'company-detect-icons-margin))


(use-package! graphql-mode
  :defer t
  :init
  (add-to-list 'auto-mode-alist '("\\.graphqls\\'" . graphql-mode)))


(use-package! protobuf-mode
  :defer t)


(use-package! gn-mode
  :defer t
  :init
  (add-to-list 'auto-mode-alist '("\\.gni?\\'" . gn-mode)))

(add-hook! 'go-mode-hook (setq-local format-all-formatters '(("Go" gofmt))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; CC
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(use-package! bazel-mode
  :defer t)

(add-to-list 'auto-mode-alist '("\\.inl\\'" . +cc-c-c++-objc-mode))
(add-to-list 'auto-mode-alist '("\\.inc\\'" . +cc-c-c++-objc-mode))

(defun +cc/copy-lldb-breakpoint-of-current-line ()
  "Copy a pdb like breakpoint on the current line."
  (interactive)
  (kill-new
   (concat "b " (file-name-nondirectory (buffer-file-name))
           " : " (number-to-string (line-number-at-pos)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; JS, WEB
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(add-hook! '(web-mode-hook html-mode-hook) (setq-local format-all-formatters '(("HTML" prettier))))
(add-hook! 'typescript-mode-hook (setq-local format-all-formatters '(("TypeScript" prettier))))
(add-hook! 'rjsx-mode-hook (setq-local format-all-formatters '(("JavaScript" prettier))))

(after! web-mode
  (web-mode-toggle-current-element-highlight)
  (web-mode-dom-errors-show))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; JAVA
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


;; (set-formatter! 'google-java-format "google-java-format -" :modes '(java-mode))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; DEBUG & RUN
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(after! quickrun
  (quickrun-add-command "c++/c1z"
    '((:command . "clang++")
      (:exec    . ("%c -std=c++1z %o -o %e %s"
                   "%e %a"))
      (:remove  . ("%e")))
    :default "c++"))


(after! realgud (advice-remove #'realgud:terminate #'+debugger--cleanup-after-realgud-a))


(when (modulep! :tools debugger)
  (defun +my/dap-start ()
    (interactive)
    (dap-mode 1)
    (call-interactively #'dap-debug))

  (defun +my/dap-delete-output-and-stderr-buffers ()
    (doom/kill-matching-buffers " stderr*" (buffer-list))
    (doom/kill-matching-buffers " out*" (buffer-list)))

  ;; Tooltip doesn't work well in terminal
  (unless (display-graphic-p)
    (remove-hook! 'dap-mode-hook #'dap-tooltip-mode))

  (after! dap-mode
    ;; (setq dap-auto-configure-features '(sessions locals expressions controls tooltip))
    (setq lsp-enable-dap-auto-configure nil)

    ;; use M-u to exit dap-hydra
    (after! dap-hydra
      (defhydra+ dap-hydra () ("M-u" nil)))

    ;; Toggle dap-hydra whenever breakpoint is triggered
    ;; (add-hook 'dap-stopped-hook
    ;;           (lambda (arg) (call-interactively #'dap-hydra)))
    )

  (defun +my/dap-breakpoint-toggle ()
    (interactive)
    (dap-breakpoint-toggle)
    (+go/write-project-breakpoints))
  (defun +my/dap-breakpoint-delete-all ()
    (interactive)
    (dap-breakpoint-delete-all)
    (+go/write-project-breakpoints))

  (map! :leader
        (:prefix ("d" . "debug")
         :desc "Start debugger" "d" #'+my/dap-start
         :desc "Start last debugger" "D" #'dap-debug-last
         :desc "Remove DAP outpput buffers" "K" #'+my/dap-delete-output-and-stderr-buffers
         :desc "dap breakpoint toggle" "b" #'+my/dap-breakpoint-toggle
         :desc "dap breakpoint delete all" "C" #'+my/dap-breakpoint-delete-all
         :desc "dap breakpoint condition" "c" #'dap-breakpoint-condition
         :desc "dap breakpoint hit count" "h" #'dap-breakpoint-hit-condition
         :desc "dap breakpoint log message" "l" #'dap-breakpoint-log-message
         "B" #'dap-ui-breakpoints
         "h" #'dap-hydra
         "r" #'dap-debug-restart
         "l" #'dap-ui-locals
         "e" #'dap-ui-expressions
         "a" #'dap-ui-expressions-add
         "R" #'dap-ui-expressions-remove
         "f" #'dap-switch-stack-frame
         "q" #'dap-disconnect
         "s" #'dap-ui-sessions
         "k" #'dap-delete-session
         "K" #'dap-delete-all-sessions
         "S" #'realgud-short-key-mode)))

(add-hook! 'go-mode-hook (add-hook! 'after-save-hook :local #'+go/write-project-breakpoints))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; LANGUAGE CUSTOMIZATION
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-generic-mode sxhkd-mode
  '(?#)
  '("alt" "Escape" "super" "bspc" "ctrl" "space" "shift") nil
  '("sxhkdrc") nil
  "Simple mode for sxhkdrc files.")
