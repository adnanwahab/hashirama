;;; ../Dot-files-main/doom/+apm.el -*- lexical-binding: t; -*-
;; APM (Application Performance Management)
(require 'gptel)
(gptel-make-ollama "baka"             ;Any name of your choosing
  :host "localhost:11434"               ;Where it's running
  :stream t                             ;Stream responses
  :models '("mistral:latest"))

(setq deft-directory "~/Documents/fortress_of_solitude/")
(after! deft
  (setq deft-default-extension "org"))

(defun gptel-rewrite-and-replace (bounds &optional directive)
  (interactive
   (list
    (cond
     ((use-region-p) (cons (region-beginning) (region-end)))
     ((derived-mode-p 'text-mode)
      (list (bounds-of-thing-at-point 'sentence)))
     (t (cons (line-beginning-position) (line-end-position))))
    (read-string "write good code.")))
  (gptel-request
      (buffer-substring-no-properties (car bounds) (cdr bounds)) ;the prompt
    :system (or directive "only best code. ty.")
    :buffer (current-buffer)
    :context (cons (set-marker (make-marker) (car bounds))
                   (set-marker (make-marker) (cdr bounds)))
    :callback mydick))

;;(global-set-key (kbd "C-\\") 'gptel-rewrite-and-replace)
