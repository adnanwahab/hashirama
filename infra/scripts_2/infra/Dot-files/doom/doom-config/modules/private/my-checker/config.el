;;; private/my-checker/config.el -*- lexical-binding: t; -*-

;; Disable warning left fringe indicator
(setq flymake-warning-bitmap nil)

(if (modulep! :checkers syntax)
    (map! :leader
          (:prefix-map ("e" . "error")
           :desc "Next error"      "n" #'flycheck-next-error
           :desc "Previous error"  "p" #'flycheck-previous-error
           :desc "Explain error"   "e" #'flycheck-explain-error-at-point
           :desc "List errors"     "l" #'flycheck-list-errors
           :desc "Lsp list errors" "L" #'consult-lsp-diagnostics
           :desc "Verify setup"    "v" #'flycheck-verify-setup))
  (map! :leader
        (:prefix-map ("e" . "error")
         :desc "Next error"      "n" #'flymake-goto-next-error
         :desc "Previous error"  "p" #'flymake-goto-prev-error
         :desc "Explain error"   "e" #'flymake-show-diagnostic
         :desc "List errors"     "l" #'flymake-show-buffer-diagnostics
         :desc "Lsp list errors" "L" #'consult-flymake
         :desc "List project error" "P" #'flymake-show-project-diagnostics
         :desc "Verify setup"    "v" #'flymake-running-backends)))
(map! :leader
      (:prefix "c"
       :desc "Cspell check all changed files" "c" #'cspell-check-diff-from-HEAD
       :desc "Cspell check buffer"    "C" #'cspell-check-buffer))

(use-package flymake-cspell
  :when (executable-find "cspell")
  :hook (prog-mode . flymake-cspell-setup))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Cspell
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defvar cspell-base-program "cspell")
(defvar cspell-config-file-path (concat "'" (expand-file-name  "~/.config/cspell/cspell.json") "'"))
(defvar cspell-args (string-join `("--config" ,cspell-config-file-path) " "))
(defun cspell-check-buffer ()
  (interactive)
  (if cspell-base-program
      (let* ((file-name (concat "'" (file-name-nondirectory (buffer-file-name)) "'"))
             (command (string-join `(,cspell-base-program ,cspell-args ,file-name) " ")))
        (compilation-start command 'grep-mode))
    (message "Cannot find cspell, please install with `npm install -g cspell`")
    ))

(defun cspell-check-diff-from-HEAD ()
  (interactive)
  (if cspell-base-program
      (let* ((default-directory (doom-project-root))
             (command (string-join `("git diff --name-only HEAD | xargs -I{}" ,cspell-base-program ,cspell-args "'{}'") " ")))
        (compilation-start command 'grep-mode))
    (message "Cannot find cspell, please install with `npm install -g cspell`")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; FLYCHECK
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; (use-package! wucuo
;;   :defer t
;;   :init
;;   (add-hook! (js2-mode rjsx-mode go-mode c-mode c++-mode) #'wucuo-start))


(after! flycheck
  (setq-default flycheck-disabled-checkers
                '(
                  typescript-tslint javascript-jshint handlebars
                  eglot json-jsonlist json-python-json
                  c/c++-clang c/c++-cppcheck c/c++-gcc c/c++-googlelint
                  python-mypy python-pylint python-pycompile
                  ;; Disable Perl for Coral Config file
                  perl
                  ))

  ;; customize flycheck temp file prefix
  (setq-default flycheck-temp-prefix ".flycheck")

  ;; ======================== JS & TS ========================
  ;; https://github.com/hlissner/doom-emacs/blob/c2f8476c8641fcc9a1371d873ed3b5924952a059/modules/lang/javascript/config.el#L109

  ;; ======================== CC ========================
  (require 'flycheck-google-cpplint)
  (setq flycheck-c/c++-googlelint-executable "cpplint")
  (flycheck-add-next-checker 'c/c++-gcc '(t . c/c++-googlelint))

  (setq flycheck-c/c++-gcc-executable "gcc-7"
        flycheck-gcc-include-path '("/usr/local/inclue"))

  (add-hook! c++-mode-hook
    (setq flycheck-gcc-language-standard "c++11"
          flycheck-clang-language-standard "c++11"))
  )

;; (defun disable-flycheck-mode ()
;;   (flycheck-mode -1))
;; (add-hook! (emacs-lisp-mode) 'disable-flycheck-mode)
