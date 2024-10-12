;;; ../Dot-files-main/doom/+prog.el -*- lexical-binding: t; -*-
;; Programming
(require 'gptel)
(gptel-make-ollama "baka"             ;Any name of your choosing
  :host "localhost:11434"               ;Where it's running
  :stream t                             ;Stream responses
  :models '("mistral:latest"))
(setq deft-directory "~/Documents/fortress_of_solitude/")
(after! deft
  (setq deft-default-extension "org"))

(defvar mydick (lambda (response info)
                (if (not response)
                    (message "ChatGPT response failed with: %s" (plist-get info :status))
                  (let* ((bounds (plist-get info :context))
                         (beg (car bounds))
                         (end (cdr bounds))
                         (buf (plist-get info :buffer)))
                    (with-current-buffer buf
                      (save-excursion
                        (goto-char beg)
                        (kill-region beg end)
                        (insert response)
                        (set-marker beg nil)
                        (set-marker end nil)
                        (message "Rewrote line. Original line saved to kill-ring."))))))

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
