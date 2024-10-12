;;; private/lazycat/config.el -*- lexical-binding: t; -*-

(map! :leader
      :desc "Snails" :nmv "RET" #'snails
      (:prefix "s"
       :desc "Search project" "p" #'+my/search-project
       :desc "Search project customly" "P" #'color-rg-customized-search))

(set-popup-rules! '(("^\\*color-rg\\*$" :size 0.35)))

(use-package! color-rg
  :defer t
  :custom (color-rg-mac-load-path-from-shell nil)
  :commands color-rg-search-project
  :config
  ;; https://emacs.stackexchange.com/a/10588/22102
  (evil-make-overriding-map color-rg-mode-map 'normal)
  ;; force update evil keymaps after git-timemachine-mode loaded
  (add-hook 'color-rg-mode-hook #'evil-normalize-keymaps)

  (map! (:map color-rg-mode-map
         "j" nil "k" nil "l" nil "h" nil
         "C-k" #'color-rg-jump-prev-keyword
         "C-j" #'color-rg-jump-next-keyword
         :nv "gr" #'color-rg-rerun)
        (:map color-rg-mode-edit-map
         "C-c C-k" #'color-rg-quit))

  (custom-set-faces!
    `(color-rg-font-lock-match :foreground ,(doom-color 'red))
    `(color-rg-font-lock-header-line-text :foreground ,(doom-color 'dark-cyan))
    `(color-rg-font-lock-function-location :foreground ,(doom-color 'magenta))
    `(color-rg-font-lock-header-line-keyword :foreground ,(doom-color 'magenta))
    `(color-rg-font-lock-header-line-edit-mode :foreground ,(doom-color 'magenta))))


(when (display-graphic-p)
  (use-package! snails
    :defer t
    :custom (snails-use-exec-path-from-shell nil)
    :load-path  "~/.emacs.d/.local/straight/repos/snails"
    :commands snails
    :config
    (setq snails-input-buffer-text-scale 1)
    (set-evil-initial-state!
      '(snails-mode)
      'insert)
    (map!
     (:map snails-mode-map
      :nvi "C-g" #'snails-quit
      :nvi "ESC ESC ESC" #'snail-quit
      :nvi "C-n" #'snails-select-next-item
      :nvi "C-p" #'snails-select-prev-item
      :nvi "C-v" #'snails-select-next-backend
      :nvi "M-v" #'snails-select-prev-backend
      :nvi "RET" #'snails-candidate-do
      :nvi "C-RET" #'snails-candiate-alternate-do))
    )

  (use-package! fuz
    :defer t
    :config
    (unless (require 'fuz-core nil t)
      (fuz-build-and-load-dymod))))
