;;; ../Dot-files-main/doom/+org.el -*- lexical-binding: t; -*-
(setq org-directory "~/Documents/fortress_of_solitude")

;; (add-hook! 'org-mode-hook #'mixed-pitch-mode)
;; (add-hook! 'org-mode-hook #'solaire-mode)
;; (setq mixed-pitch-variable-pitch-cursor nil)
;; (setq org-directory "~/Documents/")
;; (after! org (setq org-hide-emphasis-markers t))
;; (after! org (setq org-insert-heading-respect-content nil))
;; (after! org
;;   (setq org-log-done t)
;;   (setq org-log-into-drawer t))



;; (after! org
;;   (setq org-special-ctrl-a/e t)
;;   (setq org-special-ctrl-k t))

;; (add-hook! org-mode :append
;;            #'visual-line-mode
;;            #'variable-pitch-mode)



;; (add-hook! org-mode :append #'org-appear-mode)
;; (after! org
;;   (setq org-agenda-files
;;         '("~/Documents" "~/Downloads/shit" "~/Documents/")))
;; (defun zz/add-file-keybinding (key file &optional desc)
;;   (let ((key key)
;;         (file file)
;;         (desc desc))
;;     (map! :desc (or desc file)
;;           key
;;           (lambda () (interactive) (find-file file)))))
;; (zz/add-file-keybinding "C-c z w" "~/Work/work.org.gpg" "work.org")
;; (zz/add-file-keybinding "C-c z i" "~/org/ideas.org" "ideas.org")
;; (zz/add-file-keybinding "C-c z p" "~/org/projects.org" "projects.org")
;; (zz/add-file-keybinding "C-c z d" "~/org/diary.org" "diary.org")
;; (setq org-roam-directory "~/Dropbox/Personal/org-roam/")
;; (setq +org-roam-open-buffer-on-find-file t)
;; (setq org-attach-id-dir "~/Downloads")
;; (defun zz/org-download-paste-clipboard (&optional use-default-filename)
;;   (interactive "P")
;;   (require 'org-download)
;;   (let ((file
;;          (if (not use-default-filename)
;;              (read-string (format "Filename [%s]: "
;;                                   org-download-screenshot-basename)
;;                           nil nil org-download-screenshot-basename)
;;            nil)))
;;     (org-download-clipboard file)))

;; (after! org
;;   (setq org-download-method 'directory)
;;   (setq org-download-image-dir "images")
;;   (setq org-download-heading-lvl nil)
;;   (setq org-download-timestamp "%Y%m%d-%H%M%S_")
;;   (setq org-image-actual-width 300)
;;   (map! :map org-mode-map
;;         "C-c l a y" #'zz/org-download-paste-clipboard
;;         "C-M-y" #'zz/org-download-paste-clipboard))




;;     (let* ((id (zz/org-custom-id-get-create (cdr x))))
;;       (org-insert-link nil (concat "#" id) (car x)))))

;; ;; (when IS-MAC
;; ;;   (use-package! org-mac-link
;; ;;     :after org
;; ;;     :config
;; ;;     (setq org-mac-grab-Acrobat-app-p nil) ; Disable grabbing from Adobe Acrobat
;; ;;     (setq org-mac-grab-devonthink-app-p nil) ; Disable grabbinb from DevonThink
;; ;;     (map! :map org-mode-map
;; ;;           "C-c g"  #'org-mac-grab-link)))





;; (after! org-agenda
;;   ;; (setq org-agenda-prefix-format
;;   ;;       '((agenda . " %i %-12:c%?-12t% s")
;;   ;;         ;; Indent todo items by level to show nesting
;;   ;;         (todo . " %i %-12:c%l")
;;   ;;         (tags . " %i %-12:c")
;;   ;;        (search . " %i %-12:c")))
;;   (setq org-agenda-include-diary t))


;; ;; (use-package! holidays
;; ;;   :after org-agenda
;; ;;   :config
;; ;;   (require 'mexican-holidays)
;; ;;   (require 'swiss-holidays)
;; ;;   (setq swiss-holidays-zh-city-holidays
;; ;;         '((holiday-float 4 1 3 "Sechseläuten")
;; ;;           (holiday-float 9 1 3 "Knabenschiessen")))
;; ;;   (setq calendar-holidays
;; ;;         (append '((holiday-fixed 1 1 "New Year's Day")
;; ;;                   (holiday-fixed 2 14 "Valentine's Day")
;; ;;                   (holiday-fixed 4 1 "April Fools' Day")
;; ;;                   (holiday-fixed 10 31 "Halloween")
;; ;;                   (holiday-easter-etc)
;; ;;                   (holiday-fixed 12 25 "Christmas")
;; ;;                   (solar-equinoxes-solstices))
;; ;;                 swiss-holidays
;; ;;                 swiss-holidays-labour-day
;; ;;                 swiss-holidays-catholic
;; ;;                 swiss-holidays-zh-city-holidays
;; ;;                 holiday-mexican-holidays)))



;; ;; (use-package! org-super-agenda
;; ;;   :after org-agenda
;; ;;   :config
;; ;;   (setq org-super-agenda-groups '((:auto-dir-name t)))
;; ;;   (org-super-agenda-mode))

;; ;; (use-package! org-archive
;; ;;   :after org
;; ;;   :config
;; ;;   (setq org-archive-location "archive.org::datetree/"))

;; ;; (use-package! org-gtd
;; ;;   :after org
;; ;;   :config
;; ;;   ;; where org-gtd will put its files. This value is also the default one.
;; ;;   ;;(setq org-gtd-directory "~/gtd/")
;; ;;   ;; package: https://github.com/Malabarba/org-agenda-property
;; ;;   ;; this is so you can see who an item was delegated to in the agenda
;; ;;   (setq org-agenda-property-list '("DELEGATED_TO"))
;; ;;   ;; I think this makes the agenda easier to read
;; ;;   (setq org-agenda-property-position 'next-line)
;; ;;   ;; package: https://www.nongnu.org/org-edna-el/
;; ;;   ;; org-edna is used to make sure that when a project task gets DONE,
;; ;;   ;; the next TODO is automatically changed to NEXT.
;; ;;   (setq org-edna-use-inheritance t)
;; ;;   (org-edna-load)
;; ;;   :bind
;; ;;   (("C-c d c" . org-gtd-capture) ;; add item to inbox
;; ;;    ("C-c d a" . org-agenda-list) ;; see what's on your plate today
;; ;;    ("C-c d p" . org-gtd-process-inbox) ;; process entire inbox
;; ;;    ("C-c d n" . org-gtd-show-all-next) ;; see all NEXT items
;; ;;    ;; see projects that don't have a NEXT item
;; ;;    ("C-c d s" . org-gtd-show-stuck-projects)
;; ;;    ;; the keybinding to hit when you're done editing an item in the
;; ;;    ;; processing phase
;; ;;    ("C-c d f" . org-gtd-clarify-finalize)))

;; (defadvice! +zz/load-org-gtd-before-capture (&optional goto keys)
;;     :before #'org-capture
;;     (require 'org-capture)
;;     (require 'org-gtd))

;; ;;https://ox-hugo.scripter.co/
;; ;;(after! ox-hugo
;; ;  (setq org-hugo-use-code-for-kbd t))
;; (defun zz/org-reformat-buffer ()
;;   (interactive)
;;   (when (y-or-n-p "Really format current buffer? ")
;;     (let ((document (org-element-interpret-data (org-element-parse-buffer))))
;;       (erase-buffer)
;;       (insert document)
;;       (goto-char (point-min)))))

;; (after! org-clock
;;   (setq org-clock-persist t)
;;   (org-clock-persistence-insinuate))

;; ;; (defun zz/adjust-org-company-backends ()
;; ;;   (remove-hook 'after-change-major-mode-hook '+company-init-backends-h)
;; ;;   (setq-local company-backends nil))
;; ;; (add-hook! org-mode (zz/adjust-org-company-backends))

;; ;;(add-hook! org-mode (electric-indent-local-mode -1))
;; ;; (after! org
;; ;;   (setq org-use-speed-commands
;; ;;         (lambda ()
;; ;;           (and (looking-at org-outline-regexp)
;; ;;                (looking-back "^\**")))))


;;   ;; (setq org-modern-star '("◉" "○" "◈" "◇" "*"))

;; ;; (setq
;; ;;  ;; Edit settings
;; ;;  org-auto-align-tags nil
;; ;;  org-tags-column 0
;; ;;  org-catch-invisible-edits 'show-and-error
;; ;;  org-special-ctrl-a/e t
;; ;;  org-insert-heading-respect-content t

;; ;;  ;; Org styling, hide markup etc.
;; ;;  org-hide-emphasis-markers t
;; ;;  org-pretty-entities t
;; ;;  org-ellipsis "…"

;; ;;  ;; Agenda styling
;; ;;  org-agenda-tags-column 0
;; ;;  org-agenda-block-separator ?─
;; ;;  org-agenda-time-grid
;; ;;  '((daily today require-timed)
;; ;;    (800 1000 1200 1400 1600 1800 2000)
;; ;;    " ┄┄┄┄┄ " "┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄")
;; ;;  org-agenda-current-time-string
;; ;;  "⭠ now ─────────────────────────────────────────────────")

;; ;; ;; Global
;; ;; (global-org-modern-mode)

;; ;; (after! org
;; ;;   (setq org-agenda-deadline-leaders
;; ;;           '("" "" "%2d d. ago: ")
;; ;;         org-deadline-warning-days 0
;; ;;         org-agenda-span 7
;; ;;         org-agenda-start-day "-0d"
;; ;;         org-agenda-skip-function-global
;; ;;           '(org-agenda-skip-entry-if 'todo 'done)
;; ;;         org-log-done 'time)
;; ;; )



;; ;; (defun open-markdown-as-org ()
;; ;;   "Open Markdown files as Org mode."
;; ;;   (when (string-equal (file-name-extension buffer-file-name) "md")
;; ;;     (org-mode)))
;; ;; (add-to-list 'auto-mode-alist '("\\.md\\'" . open-markdown-as-org))
;; ;; (defun meta-s-keybind()
;; ;;   "If a region is active and non-empty, kill the region. Otherwise, kill the word backward."
;; ;;   (interactive)
;; ;;   (if (use-region-p)
;; ;;       (kill-regiion-save (region-beginning) (region-end))
;; ;;     (+workspace/close-window-or-workspace)))
