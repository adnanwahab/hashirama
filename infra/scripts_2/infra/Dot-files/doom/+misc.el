;;; ../Dot-files-main/doom/+misc.el -*- lexical-binding: t; -*-
;; Miscellaneous
(use-package! visual-regexp-steroids
  :defer 3
  :config
  (require 'pcre2el)
  (setq vr/engine 'pcre2el)
  (map! "C-c s r" #'vr/replace)
  (map! "C-c s q" #'vr/query-replace))

(after! undo-fu
  (map! :map undo-fu-mode-map "C-?" #'undo-fu-only-redo))

(global-set-key (kbd "M-g g") #'avy-goto-line)
(global-set-key (kbd "M-g M-g") #'avy-goto-line)

(global-set-key (kbd "M-g o") #'counsel-outline)
(global-set-key (kbd "C-s") #'+default/search-buffer)

(defun zz/counsel-buffer-or-recentf-candidates ()
  "Return candidates for `counsel-buffer-or-recentf'."
  (require 'recentf)
  (recentf-mode)
  (let ((buffers
         (delq nil
               (mapcar (lambda (b)
                         (when (buffer-file-name b)
                           (abbreviate-file-name (buffer-file-name b))))
                       (delq (current-buffer) (buffer-list))))))
    (append
     buffers
     (cl-remove-if (lambda (f) (member f buffers))
                   (counsel-recentf-candidates)))))

(advice-add #'counsel-buffer-or-recentf-candidates
            :override #'zz/counsel-buffer-or-recentf-candidates)
(use-package! switch-buffer-functions
  :after recentf
  :preface
  (defun my-recentf-track-visited-file (_prev _curr)
    (and buffer-file-name
         (recentf-add-file buffer-file-name)))
  :init
  (add-hook 'switch-buffer-functions #'my-recentf-track-visited-file))

(map! "C-x b"   #'counsel-buffer-or-recentf
      "C-x C-b" #'counsel-switch-buffer)

(defun toggle-evil-mode ()
  "Toggle Evil mode on and off."
  (interactive)
  (if (bound-and-true-p evil-mode)
      (progn
        (evil-mode -1)
        (message "Evil mode disabled"))
    (progn
      (evil-mode 1)
      (message "Evil mode enabled"))))

(global-set-key (kbd "C-!") 'toggle-evil-mode)
