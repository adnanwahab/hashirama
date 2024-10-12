;; Text
(use-package! lsp-tailwindcss)
(setq doom-modeline-enable-word-count t)

(after! org
  (setq org-agenda-files
        '("~/Documents" "~/Downloads/shit" "~/Documents/"))
  (setq org-log-done t)
  (setq org-log-into-drawer t)
  (setq org-special-ctrl-a/e t)
  (setq org-special-ctrl-k t)
  (setq org-download-method 'directory)
  (setq org-download-image-dir "images")
  (setq org-download-heading-lvl nil)
  (setq org-download-timestamp "%Y%m%d-%H%M%S_")
  (setq org-image-actual-width 300)
  (setq org-roam-directory "~/Dropbox/Personal/org-roam/")
  (setq +org-roam-open-buffer-on-find-file t)
  (setq org-attach-id-dir "~/Downloads"))

(add-hook! org-mode :append
           #'visual-line-mode
           #'variable-pitch-mode)

(add-hook! org-mode :append #'org-appear-mode)

(map! :map org-mode-map
      "C-c l a y" #'zz/org-download-paste-clipboard
      "C-M-y" #'zz/org-download-paste-clipboard)

(defun zz/org-download-paste-clipboard (&optional use-default-filename)
  (interactive "P")
  (require 'org-download)
  (let ((file
         (if (not use-default-filename)
             (read-string (format "Filename [%s]: "
                                  org-download-screenshot-basename)
                          nil nil org-download-screenshot-basename)
           nil)))
    (org-download-clipboard file)))

(map! :after counsel :map org-mode-map
      "C-c l l h" #'counsel-org-link)

(after! counsel
  (setq counsel-outline-display-style 'title))

(after! org-id
  ;; Do not create ID if a CUSTOM_ID exists
  (setq org-id-link-to-org-use-id 'create-if-interactive-and-no-custom-id))

(defun zz/make-id-for-title (title)
  "Return an ID based on TITLE."
  (let* ((new-id (replace-regexp-in-string "[^[:alnum:]]" "-" (downcase title))))
    new-id))

(defun zz/org-custom-id-create ()
  "Create and store CUSTOM_ID for current heading."
  (let* ((title (or (nth 4 (org-heading-components)) ""))
         (new-id (zz/make-id-for-title title)))
    (org-entry-put nil "CUSTOM_ID" new-id)
    (org-id-add-location new-id (buffer-file-name (buffer-base-buffer)))
    new-id))

(defun zz/org-custom-id-get-create (&optional where force)
  "Get or create CUSTOM_ID for heading at WHERE.

If FORCE is t, always recreate the property."
  (org-with-point-at where
    (let ((old-id (org-entry-get nil "CUSTOM_ID")))
      ;; If CUSTOM_ID exists and FORCE is false, return it
      (if (and (not force) old-id (stringp old-id))
          old-id
        ;; otherwise, create it
        (zz/org-custom-id-create)))))

;; Now override counsel-org-link-action
(after! counsel
  (defun counsel-org-link-action (x)
    "Insert a link to X.

X is expected to be a cons of the form (title . point), as passed
by `counsel-org-link'.

If X does not have a CUSTOM_ID, create it based on the headline
title."
    (let* ((id (zz/org-custom-id-get-create (cdr x))))
      (org-insert-link nil (concat "#" id) (car x)))))

(after! org-agenda
  (setq org-agenda-include-diary t))

(after! org-clock
  (setq org-clock-persist t)
  (org-clock-persistence-insinuate))

(defun zz/add-file-keybinding (key file &optional desc)
  (let ((key key)
        (file file)
        (desc desc))
    (map! :desc (or desc file)
          key
          (lambda () (interactive) (find-file file)))))

(zz/add-file-keybinding "C-c z w" "~/Work/work.org.gpg" "work.org")
(zz/add-file-keybinding "C-c z i" "~/org/ideas.org" "ideas.org")
(zz/add-file-keybinding "C-c z p" "~/org/projects.org" "projects.org")
(zz/add-file-keybinding "C-c z d" "~/org/diary.org" "diary.org")
