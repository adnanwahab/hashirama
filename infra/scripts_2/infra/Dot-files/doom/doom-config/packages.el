;; -*- no-byte-compile: t; -*-
;;; private/my/packages.el

;; disabled packages
(disable-packages! solaire-mode
                   osx-trash
                   realgud
                   realgud-trepan-ni
                   ccls
                   tide
                   swiper
                   forge
                   code-review
                   anaconda-mode
                   company-anaconda
                   lsp-python-ms
                   pyimport)

;; text
(package! adoc-mode)
(package! tldr)
(package! edit-indirect)
(package! blog-admin :recipe (:host github :repo "codefalling/blog-admin"))
;; (package! youdao-dictionary)
(package! link-hint)
(package! symbol-overlay)
(package! pomm)
(package! org-appear)

;; misc
(package! format-all)
(package! keycast)
(package! evil-string-inflection)
(package! all-the-icons-ibuffer)
(package! dired-narrow)
(package! atomic-chrome)
(package! git-link)
(package! magit-delta)
(package! imenu-list)
;; (package! tmux-pane)
(package! rime :recipe (:host github :repo "DogLooksGood/emacs-rime" :files ("*.el" "Makefile" "lib.c")))
(package! go-translate)
;; (package! org-roam-ui)
;; (package! md-roam :recipe (:host github :repo "nobiot/md-roam"))

;; programming
(package! bazel-mode :recipe (:host github :repo "bazelbuild/emacs-bazel-mode"))
(package! graphql-mode)
(package! protobuf-mode)
(package! gn-mode)
(when (modulep! :tools lsp +eglot)
  (package! breadcrumb :recipe (:host github :repo "joaotavora/breadcrumb"))
  (package! eglot-java)
  )
(when (not (modulep! :tools lsp +eglot))
  (package! lsp-docker))
