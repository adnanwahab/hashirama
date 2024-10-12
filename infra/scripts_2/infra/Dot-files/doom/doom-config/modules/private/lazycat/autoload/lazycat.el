;;; private/lazycat/autoload/lazycat.el -*- lexical-binding: t; -*-


;;;###autoload
(defun +my/search-project ()
  (interactive)
  (if current-prefix-arg
      (color-rg-search-project)
    (+default/search-project)))
