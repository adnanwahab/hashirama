;;; ~/.doom.d/autoload/buffer.el -*- lexical-binding: t; -*-

;; Do this when you encounter "Too many open files" issue
;;;###autoload
(defun file-notify-rm-all-watches ()
  "Remove all existing file notification watches from Emacs."
  (interactive)
  (maphash
    (lambda (key _value)
      (file-notify-rm-watch key))
    file-notify-descriptors))

;;;###autoload
(defun revert-buffer-no-confirm ()
  "Revert buffer without confirmation."
  (interactive)
  (save-buffer)
  (revert-buffer :ignore-auto :noconfirm))

;;;###autoload
(defun reload-buffer-no-confirm ()
  "Revert buffer without confirmation."
  (interactive)
  (save-buffer)
  (let ((f buffer-file-name))
    (kill-this-buffer)
    (find-file f)))

;;;###autoload
(defun indent-buffer ()
  "Indent the currently visited buffer."
  (interactive)
  (indent-region (point-min) (point-max)))

;;;###autoload
(defun indent-region-or-buffer ()
  "Indent a region if selected, otherwise the whole buffer."
  (interactive)
  (save-excursion
    (if (region-active-p)
        (progn
          (indent-region (region-beginning) (region-end))
          (message "Indented selected region."))
      (progn
        (indent-buffer)
        (message "Indented buffer.")))))

;;;###autoload
(defun +my/untabify-buffer ()
  (interactive)
  (save-excursion
    (untabify (point-min) (point-max)) nil))

;;;###autoload
(defun +my/hidden-dos-eol ()
  "Do not show ^M in files containing mixed UNIX and DOS line endings."
  (interactive)
  (setq buffer-display-table (make-display-table))
  (aset buffer-display-table ?\^M []))

;;;###autoload
(defun +my/remove-dos-eol ()
  "Replace DOS eolns CR LF with Unix eolns CR"
  (interactive)
  (goto-char (point-min))
  (while (search-forward "\r" nil t) (replace-match "")))

;;;###autoload
(defun +my/insert-semicolon-at-the-end-of-this-line ()
  (interactive)
  (save-excursion
    (end-of-line)
    (insert ";")))

;;;###autoload
(defun +my/delete-semicolon-at-the-end-of-this-line ()
  (interactive)
  (save-excursion
    (end-of-line)
    (when (looking-back ";")
      (backward-char)
      (delete-char 1))))

;;;###autoload
(defun +my/check-large-buffer ()
  "Check if the buffer is large."
  (when (> (buffer-size) 1048576)       ; 1MB
    t))

;;;###autoload
(defun +my/find-file-check-make-large-file-read-only-hook ()
  "If a file is over a given size, make the buffer read only."
  (when (+my/check-large-buffer)
    (setq-local buffer-read-only t)
    (buffer-disable-undo)
    (fundamental-mode)))

;;;###autodef
(defun lsp! ()
  "Dispatch to call the currently used lsp client entrypoint"
  (interactive)
  (unless (+my/check-large-buffer)
    (if (modulep! :tools lsp +eglot)
        (eglot-ensure)
      (unless (bound-and-true-p lsp-mode)
        (lsp-deferred)))))

;;;###autodef
(defun +lsp/restart ()
  (interactive)
  (if (modulep! :tools lsp +eglot)
      (call-interactively 'eglot-reconnect)
    (call-interactively 'lsp-workspace-restart)))
