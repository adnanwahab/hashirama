;;; ../Dot-files-main/doom/autoload/apm.el -*- lexical-binding: t; -*-

;;; autoload/apm.el -*- lexical-binding: t; -*-

;;;###autoload
(defun awahab-senju ()
  (interactive)
  (if display-line-numbers-type
      (setq display-line-numbers-type nil)
    (setq display-line-numbers-type t))
  (revert-buffer-no-confirm))
