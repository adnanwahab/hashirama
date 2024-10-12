;;; autoload/ui.el -*- lexical-binding: t; -*-

;;;###autoload
(defun toggle-display-line-numbers-type ()
  (interactive)
  (if display-line-numbers-type
      (setq display-line-numbers-type nil)
    (setq display-line-numbers-type t))
  (revert-buffer-no-confirm))
