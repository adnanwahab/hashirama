;;; ~/.doom.d/autoload/os.el -*- lexical-binding: t; -*-

;; Copied from https://github.com/emacsorphanage/osx-trash/blob/master/osx-trash.el
(defconst os--trash-pkg-file
  (expand-file-name (if load-in-progress load-file-name (buffer-file-name)))
  "The absolute path to this file.")

(defconst os--trash-pkg-dir
  (file-name-directory os--trash-pkg-file)
  "The absolute path to the directory of this package.")

(defun os--trash-move-file-to-trash (file-name)
  "Move FILE-NAME to trash.

Try to call the `trash' utility first"
  (let ((file-name (expand-file-name file-name)))
    (with-temp-buffer
      (let ((retcode (call-process "trash" nil t nil file-name)))
        (unless (equal retcode 0)
          (error "Failed to trash %S: %S" file-name (buffer-string)))))))

;;;###autoload
(defun os--trash-setup ()
  "Provide trash support for OS X.

Provide `system-move-file-to-trash' as an alias for
`os--trash-move-file-to-trash'.

Note that you still need to set `delete-by-moving-to-trash' to a
non-nil value to enable trashing for file operations."
  (when (not (fboundp 'system-move-file-to-trash))
    (defalias 'system-move-file-to-trash
      'os--trash-move-file-to-trash)))

;;;###autoload
(defun +macos-open-with (&optional app-name path)
  "Send PATH to APP-NAME on OSX."
  (interactive)
  (let* ((path (expand-file-name
                (replace-regexp-in-string
                 "'" "\\'"
                 (or path (if (derived-mode-p 'dired-mode)
                              (dired-get-file-for-visit)
                            (buffer-file-name)))
                 nil t)))
         (command (format "open %s"
                          (if app-name
                              (format "-a %s '%s'" (shell-quote-argument app-name) path)
                            (format "'%s'" path)))))
    (message "Running: %s" command)
    (shell-command command)))

;;;###autoload
(defmacro +macos--open-with (id &optional app dir)
  `(defun ,(intern (format "+macos/%s" id)) ()
     (interactive)
     (+macos-open-with ,app ,dir)))

;;;###autoload
(defun +shell-open-with (&optional app-name args container app-window-name)
  "Open shell application."
  (interactive)
  (let* ((process-connection-type nil))
    (if (string= "" app-window-name) (setq app-window-name app-name))
    (if container
        (setq command (format "docker exec --user user %s %s %s" container app-name args))
      (setq command (format "%s %s" app-name args)))
    (async-shell-command-no-window command)
    (message command)
    (when IS-LINUX
      (shell-command (concat "wmctrl -a \"" app-window-name "\" ")))))

;;;###autoload
(defun notify-current-line-number ()
  (alert (concat "line number " (number-to-string (line-number-at-pos))) :severity 'low))

;;;###autoload
(defmacro +shell--open-with (id &optional app args)
  `(defun ,(intern (format "+shell/%s" id)) ()
     (interactive)
     (+shell-open-with ,app ,args)
     (notify-current-line-number)))

;;;###autoload
(defmacro +docker--open-with (id &optional app args container app-window-name)
  `(defun ,(intern (format "+docker/%s" id)) ()
     (interactive)
     (+shell-open-with ,app ,args ,container ,app-window-name)
     (notify-current-line-number)))

;;;###autoload
(when IS-MAC
  (defvar alacritty-bin "/Applications/Alacritty.app/Contents/MacOS/alacritty"
    "Alacritty terminal binary localtion.")
  (defvar iterm-bin "/Applications/iTerm.app/Contents/MacOS/iTerm2"
    "iTerm2 terminal binary localtion.")

  (defun +macos/reveal-in-terminal ()
    (interactive)
    (cond
     ((executable-find alacritty-bin)
      (+shell-open-with alacritty-bin (concat "--working-directory='" default-directory"'")))
     ((executable-find iterm-bin)
      (iterm-open-new-tab default-directory))))
  (defun +macos/reveal-project-in-terminal ()
    (interactive)
    (cond
     ((executable-find alacritty-bin)
      (+shell-open-with alacritty-bin (concat "--working-directory='" (or (doom-project-root) default-directory)"'")))
     ((executable-find iterm-bin)
      (iterm-open-new-tab (or (doom-project-root) default-directory))))))
