;;; private/my-transient/config.el -*- lexical-binding: t; -*-

(let ((amz-cr-path (file-name-directory load-file-name)))
  (add-load-path! amz-cr-path)
  (use-package! amz-cr
    :commands (amz-cr)
    :defer t)
  )
