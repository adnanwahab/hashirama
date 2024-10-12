;; -*- no-byte-compile: t; -*-
;;; private/my-checker/packages.el

;; (package! wucuo)
(when (modulep! :checkers syntax)
  (package! flycheck-google-cpplint :recipe (:host github :repo "flycheck/flycheck-google-cpplint")))
(package! flymake-cspell)
