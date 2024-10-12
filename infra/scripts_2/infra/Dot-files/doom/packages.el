;; -*- no-byte-compile: t; -*-
;;; $DOOMDIR/packages.el

;; To install a package with Doom you must declare them here and run 'doom sync'
;; on the command line, then restart Emacs for the changes to take effect -- or
;; use 'M-x doom/reload'.


;; To install SOME-PACKAGE from MELPA, ELPA or emacsmirror:
;; (package! some-package)

;; To install a package directly from a remote git repo, you must specify a
;; `:recipe'. You'll find documentation on what `:recipe' accepts here:
;; https://github.com/radian-software/straight.el#the-recipe-format
;; (package! another-package
;;   :recipe (:host github :repo "username/repo"))

;; If the package you are trying to install does not contain a PACKAGENAME.el
;; file, or is located in a subdirectory of the repo, you'll need to specify
;; `:files' in the `:recipe':
;; (package! this-package
;;   :recipe (:host github :repo "username/repo"
;;            :files ("some-file.el" "src/lisp/*.el")))

;; If you'd like to disable a package included with Doom, you can do so here
;; with the `:disable' property:
;; (package! builtin-package :disable t)

;; You can override the recipe of a built in package without having to specify
;; all the properties for `:recipe'. These will inherit the rest of its recipe
;; from Doom or MELPA/ELPA/Emacsmirror:
;; (package! builtin-package :recipe (:nonrecursive t))
;; (package! builtin-package-2 :recipe (:repo "myfork/package"))

;; Specify a `:branch' to install a package from a particular branch or tag.
;; This is required for some packages whose default branch isn't 'master' (which
;; our package manager can't deal with; see radian-software/straight.el#279)
;; (package! builtin-package :recipe (:branch "develop"))

;; Use `:pin' to specify a particular commit to install.
;; (package! builtin-package :pin "1a2b3c4d5e")


;; Doom's packages are pinned to a specific commit and updated from release to
;; release. The `unpin!' macro allows you to unpin single packages...
;; (unpin! pinned-package)
;; ...or multiple packages
;; (unpin! pinned-package another-pinned-package)
;; ...Or *all* packages (NOT RECOMMENDED; will likely break things)
;; (unpin! t)

;; (package! org-cliplink)
;; (package! org-download)
;; (package! org-modern)
;; (package! org-mime)
;; (package! org-pomodoro)
;; (package! org-present)
;; (package! org-projectile)
;; (package! org-ql)
;; (package! org-rich-yank)
;(package! codeium :recipe (:host github :repo "Exafunction/codeium.el"))
(package! lsp-tailwindcss :recipe (:host github :repo "merrickluo/lsp-tailwindcss"))
(package! gptel)
;https://github.com/ahyatt/emacs-websocket
;https://github.com/jwiegley/alert

;(add-to-list 'load-path "~/.emacs.d/atomic-chrome/")
;(require 'atomic-chrome)
;(atomic-chrome-start-server)




;things to do in emacs
;
;; org mode
;; deft
;; syncthing
;; calendar
;; email
;; LLM
;; evil toggle  - revan
;; fzf
;; apm
;; sqlite
;; ansible
;; docker
;; prodigy
;; taskruner
;;
;; terraform??!?!?
;; TMUX???
;; UPLOADY?
(package! spacemacs-theme)
(package! switch-buffer-functions)
(package! pcre2el)
(package! visual-regexp-steroids)
(package! org-appear
  :recipe (:host github
           :repo "awth13/org-appear"))

(package! org-download)
(package! org-super-agenda)
(package! org-gtd)

(package! mexican-holidays)
(package! swiss-holidays)
(package! org-cv
  :recipe (:host gitlab
           :repo "Titan-C/org-cv"))

;;https://melpa.org/#/org-journal
;;https://melpa.org/#/?q=org&sort=downloads&asc=false
;;https://emacsdocs.org/docs/emacs/The-Emacs-Editor
;;
(package! bazel-mode :recipe (:host github :repo "bazelbuild/emacs-bazel-mode"))
(package! org-appear)
;
;(package! graphql-mode)
(package! protobuf-mode)
(package! gn-mode)
(when (modulep! :tools lsp +eglot)
  (package! breadcrumb :recipe (:host github :repo "joaotavora/breadcrumb"))
  (package! eglot-java)
  )

(when (not (modulep! :tools lsp +eglot))
  (package! lsp-docker))

(package! nano-emacs
  :recipe (:host github :repo "rougier/nano-emacs"))
;; (straight-use-package
;;   '(nano :type git :host github :repo "rougier/nano-emacs"))


;; disabled packages
;; (disable-packages! solaire-mode
;;                    osx-trash
;;                    realgud
;;                    realgud-trepan-ni
;;                    ccls
;;                    tide
;;                    swiper
;;                    forge
;;                    code-review
;;                    anaconda-mode
;;                    company-anaconda
;;                    lsp-python-ms
;;                    pyimport)
