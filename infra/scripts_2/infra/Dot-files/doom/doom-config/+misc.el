;;; ~/.doom.d/+misc.el -*- lexical-binding: t; -*-

;; Use chrome to browse
(setq browse-url-browser-function 'browse-url-generic
      browse-url-generic-program
      (cond
       ;; https://github.com/ztlevi/dotty-config/blob/main/bin/launch-browser
       ((executable-find "launch-browser"  "launch-browser"))
       ((executable-find "google-chrome-stable") "google-chrome-stable")
       ((executable-find "/opt/google/chrome/chrome") "/opt/google/chrome/chrome")
       ((executable-find "google-chrome") "google-chrome")))

;; Set personal ispell dictionary file
(when (file-exists-p (expand-file-name "~/.aspell.en.pws"))
  (setq ispell-personal-dictionary (expand-file-name "~/.aspell.en.pws")))

(use-package! screenshot
  :defer t)

(defun az-vpn ()
  (interactive)
  (async-shell-command "/opt/cisco/anyconnect/bin/vpn connect 'Automatic Selection (Route53)'")
  )

(after! centaur-tabs
  (centaur-tabs-group-by-projectile-project))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; INPUT METHOD
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(use-package! rime
  :defer t
  :custom
  (rime-user-data-dir (expand-file-name "~/.config/fcitx/emacs-rime"))
  (default-input-method "rime")
  (rime-show-candidate 'posframe)
  (rime-disable-predicates
   '(rime-predicate-evil-mode-p
     rime-predicate-after-alphabet-char-p
     rime-predicate-prog-in-code-p))
  (rime-inline-ascii-trigger 'shift-l)
  :bind
  ;; C-\ to toggle-input-method
  ;; C-` to toggle
  ;; , and . to page up and down
  (:map rime-mode-map
        ;; open rime menu
        ("C-`" . 'rime-send-keybinding))
  (:map rime-active-mode-map
        ("C-j" . 'rime-inline-ascii))
  :config
  (custom-set-faces!
    `(rime-default-face :background ,(doom-blend 'blue 'base0 0.15)))

  (when IS-MAC
    (setq rime-librime-root "~/.config/fcitx/librime/dist"))

  ;; Set Nixos env
  (when (and IS-LINUX (executable-find "nix"))
    (setq rime-emacs-module-header-root
          (concat (shell-command-to-string "nix eval --raw 'nixpkgs#emacs.outPath'") "/include")
          rime-librime-root
          (shell-command-to-string "nix eval --raw 'nixpkgs#librime.outPath'")
          rime-share-data-dir
          (concat (shell-command-to-string "nix eval --raw 'nixpkgs#brise.outPath'") "/share/rime-data"))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; LOG
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(use-package! keycast
  :defer t)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; SSH
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(after! ssh-deploy
  (setq ssh-deploy-automatically-detect-remote-changes 1))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; NAVIGATION
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(setq evil-cross-lines t
      evil-split-window-below t
      evil-vsplit-window-right t
      ;; Implicit /g flag on evil ex substitution, because I less often want the
      ;; default behavior.
      evil-ex-substitute-global t)

(after! evil
  (evil-define-text-object evil-inner-buffer (count &optional beg end type)
    (list (point-min) (point-max)))
  (define-key evil-inner-text-objects-map "g" 'evil-inner-buffer))


(after! evil-snipe
  (setq evil-snipe-scope 'buffer
        evil-snipe-repeat-scope 'buffer)
  (push 'prodigy-mode evil-snipe-disabled-modes))


;; This package provides the g~ operator to transform CamelCase words into snake_case. You can customize the binding.
;; Try using g~io
(use-package! evil-string-inflection :after evil)


;; (use-package! tmux-pane
;;   :unless (display-graphic-p)
;;   :defer t
;;   :config
;;   (defvar my-tmux-pane-mode-map
;;     (let ((map (make-sparse-keymap)))
;;       (define-key map (kbd "C-t k")
;;         (lambda () (interactive) (tmux-pane--windmove "up"  "-U")))
;;       (define-key map (kbd "C-t j")
;;         (lambda () (interactive) (tmux-pane--windmove "down"  "-D")))
;;       (define-key map (kbd "C-t h")
;;         (lambda () (interactive) (tmux-pane--windmove "left" "-L")))
;;       (define-key map (kbd "C-t l")
;;         (lambda () (interactive) (tmux-pane--windmove "right" "-R")))
;;       (define-key map (kbd "C-t C-k")
;;         (lambda () (interactive) (tmux-pane--windmove "up"  "-U")))
;;       (define-key map (kbd "C-t C-j")
;;         (lambda () (interactive) (tmux-pane--windmove "down"  "-D")))
;;       (define-key map (kbd "C-t C-h")
;;         (lambda () (interactive) (tmux-pane--windmove "left" "-L")))
;;       (define-key map (kbd "C-t C-l")
;;         (lambda () (interactive) (tmux-pane--windmove "right" "-R")))
;;       map))
;;
;;   (define-minor-mode my-tmux-pane-mode
;;     "Seamlessly navigate between tmux pane and emacs window"
;;     :init-value nil
;;     :global t
;;     :keymap 'my-tmux-pane-mode-map)
;;
;;   :hook (after-init . my-tmux-pane-mode))


(use-package! imenu-list
  :defer t
  :config
  (set-popup-rules! '(("^\\*Ilist\\*" :side right :size 40 :select t))))


(add-hook! 'better-jumper-post-jump-hook #'recenter)

(after! nav-flash
  (defun +advice/nav-flash-show (orig-fn &rest args)
    (ignore-errors (apply orig-fn args)))
  (advice-add 'nav-flash-show :around #'+advice/nav-flash-show))

;; Use ) key to toggle it
(after! dired
  ;; Rust version ls
  (when-let (exa (executable-find "exa"))
    (setq insert-directory-program exa)
    (setq dired-listing-switches (string-join (list "-ahl" "--group-directories-first") " ")))
  )

(after! ranger
  (setq ranger-hide-cursor t
        ranger-show-hidden 'format
        ranger-deer-show-details nil)

  (defun ranger-copy-relative-path ()
    "Copy the current file path relative to `default-directory path."
    (interactive)
    (let ((current-prefix-arg 1))
      (call-interactively 'dired-copy-filename-as-kill)))

  (defun ranger-close-and-kill-inactive-buffers ()
    "ranger close current buffer and kill inactive ranger buffers"
    (interactive)
    (ranger-close)
    (ranger-kill-buffers-without-window))
  ;; do not kill buffer if exists in windows
  (defun ranger-disable ()
    "Interactively disable ranger-mode."
    (interactive)
    (ranger-revert)))


(after! dash-docs
  (setq dash-docs-use-workaround-for-emacs-bug nil)
  (setq dash-docs-browser-func 'browse-url-generic))


(remove-hook! '(prog-mode-hook text-mode-hook conf-mode-hook) #'highlight-indent-guides-mode)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; TRANSLATE
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


(use-package! go-translate
  :defer t
  :config
  (setq gts-translate-list '(("en" "zh-CN")))
  (setq gts-default-translator
        (gts-translator
         :picker (gts-prompt-picker)
         :engines (list (gts-google-engine) (gts-google-rpc-engine))
         :render (gts-buffer-render)))
  ;; For China user
  ;; (setq go-translate-base-url "https://translate.google.cn")
  )


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; QUICKRUN
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(after! quickrun
  ;; quickrun--language-alist
  (when IS-LINUX
    (quickrun-set-default "c++" "c++/g++")))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; PROJECTILE
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(after! projectile
  (setq compilation-read-command nil)   ; no prompt in projectile-compile-project
  ;; . -> Build
  (projectile-register-project-type 'cmake '("CMakeLists.txt")
                                    :configure "cmake %s"
                                    :compile "cmake --build build --config Debug --target all -j 14 --"
                                    :test "ctest -j14 -C Debug -T test --output-on-failure")

  ;; set projectile-known-projects after magit
  (after! magit
    (update-projectile-known-projects))
  )


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; COMPLETION
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(when (modulep! :completion vertico)
  ;; Fix jump issue for vertico, https://github.com/hlissner/doom-emacs/issues/5386
  (dolist (func '(+default/search-project))
    (advice-add func :around #'doom-set-jump-a)))

(when (modulep! :completion ivy)
  (after! (:and ivy ivy-prescient)
    (setq ivy-prescient-retain-classic-highlighting t))

  (after! ivy-posframe
    (setq ivy-posframe-border-width 5)

    ;; Use minibuffer to display ivy functions
    (dolist (fn '(+ivy/switch-workspace-buffer
                  ivy-switch-buffer))
      (setf (alist-get fn ivy-posframe-display-functions-alist) #'ivy-display-function-fallback)))

  (after! ivy-rich
    (plist-put! ivy-rich-display-transformers-list
                'ivy-switch-buffer
                '(:columns
                  ((ivy-switch-buffer-transformer (:width 60))
                   (ivy-rich-switch-buffer-size (:width 7))
                   (ivy-rich-switch-buffer-indicators (:width 4 :face error :align right))
                   (ivy-rich-switch-buffer-major-mode (:width 12 :face warning))
                   (ivy-rich-switch-buffer-project (:width 15 :face success))
                   (ivy-rich-switch-buffer-path (:width (lambda (x) (ivy-rich-switch-buffer-shorten-path x (ivy-rich-minibuffer-width 0.3))))))
                  :predicate
                  (lambda (cand) (get-buffer cand)))))

  (after! counsel
    ;; counsel-rg-base-command is configurable
    (setq counsel-find-file-ignore-regexp "\\(?:^[#.]\\)\\|\\(?:[#~]$\\)\\|\\(?:^Icon?\\)"
          counsel-describe-function-function 'helpful-callable
          counsel-describe-variable-function 'helpful-variable)))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; ATOMIC CHROME
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(use-package! atomic-chrome
  :defer 3
  :when (display-graphic-p)
  :preface
  (defun +my/atomic-chrome-server-running-p ()
    (cond ((executable-find "lsof")
           (zerop (call-process "lsof" nil nil nil "-i" ":64292")))
          ((executable-find "netstat")  ; Windows
           (zerop (call-process-shell-command "netstat -aon | grep 64292")))))
  :hook
  (atomic-chrome-edit-mode . +my/atomic-chrome-mode-setup)
  (atomic-chrome-edit-done . +my/window-focus-default-browser)
  :config
  (progn
    (setq atomic-chrome-buffer-open-style 'full) ;; or frame, split
    (setq atomic-chrome-url-major-mode-alist
          '(("github\\.com"        . gfm-mode)
            ("swagger"             . yaml-mode)
            ("emacs-china\\.org"   . gfm-mode)
            ("stackexchange\\.com" . gfm-mode)
            ("stackoverflow\\.com" . gfm-mode)
            ("discordapp\\.com"    . gfm-mode)
            ("coderpad\\.io"       . c++-mode)
            ;; jupyter notebook
            ("localhost\\:8888"    . python-mode)
            ("lintcode\\.com"      . python-mode)
            ("leetcode-cn\\.com"   . python-mode)
            ("leetcode\\.com"      . python-mode)))

    (defun +my/atomic-chrome-mode-setup ()
      (setq header-line-format
            (substitute-command-keys
             "Edit Chrome text area.  Finish \
`\\[atomic-chrome-close-current-buffer]'.")))

    (if (+my/atomic-chrome-server-running-p)
        (message "Can't start atomic-chrome server, because port 64292 is already used")
      (atomic-chrome-start-server))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; PRODIGY
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(after! prodigy
  (set-evil-initial-state!
    '(prodigy-mode)
    'normal)

  (prodigy-define-tag
    :name 'jekyll
    :env '(("LANG" "en_US.UTF-8")
           ("LC_ALL" "en_US.UTF-8")))

  (prodigy-define-service
    :name "Hexo Blog Server"
    :command "hexo"
    :args '("server" "-p" "4000")
    :cwd blog-admin-backend-path
    :tags '(hexo server)
    :init (lambda () (browse-url "http://localhost:4000"))
    :kill-signal 'sigkill
    :kill-process-buffer-on-stop t)

  (prodigy-define-service
    :name "Hexo Blog Deploy"
    :command "hexo"
    :args '("deploy" "--generate")
    :cwd blog-admin-backend-path
    :tags '(hexo deploy)
    :kill-signal 'sigkill
    :kill-process-buffer-on-stop t)

  (defun refresh-chrome-current-tab (beg end length-before)
    (call-interactively '+my/browser-refresh--chrome-applescript))
  ;; add watch for prodigy-view-mode buffer change event
  (add-hook 'prodigy-view-mode-hook
            #'(lambda() (set (make-local-variable 'after-change-functions) #'refresh-chrome-current-tab))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; TERM
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(after! eshell
  ;; eshell-mode imenu index
  (add-hook! 'eshell-mode-hook (setq-local imenu-generic-expression '(("Prompt" " λ \\(.*\\)" 1))))

  (defun eshell/l (&rest args) (eshell/ls "-l" args))
  (defun eshell/e (file) (find-file file))
  (defun eshell/md (dir) (eshell/mkdir dir) (eshell/cd dir))
  (defun eshell/ft (&optional arg) (treemacs arg))

  (defun eshell/up (&optional pattern)
    (let ((p (locate-dominating-file
              (f-parent default-directory)
              (lambda (p)
                (if pattern
                    (string-match-p pattern (f-base p))
                  t)))
             ))
      (eshell/pushd p)))
  )


(after! term
  ;; term-mode imenu index
  (add-hook! 'term-mode-hook (setq-local imenu-generic-expression '(("Prompt" "➜\\(.*\\)" 1)))))
