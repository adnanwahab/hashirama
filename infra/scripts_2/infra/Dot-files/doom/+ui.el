;;; ../Dot-files-main/doom/+ui.el -*- lexical-binding: t; -*-
;; UI
(setq doom-font (font-spec :family "FiraCode Nerd Font" :size 18)
      doom-variable-pitch-font (font-spec :family "Alegreya" :size 18))

(add-hook! 'org-mode-hook #'mixed-pitch-mode)
(add-hook! 'org-mode-hook #'solaire-mode)
(setq mixed-pitch-variable-pitch-cursor nil)

(setq doom-theme 'spacemacs-light)

(after! counsel
  (setq counsel-outline-display-style 'title))

(defun zz/org-reformat-buffer ()
  (interactive)
  (when (y-or-n-p "Really format current buffer? ")
    (let ((document (org-element-interpret-data (org-element-parse-buffer))))
      (erase-buffer)
      (insert document)
      (goto-char (point-min)))))

;; Scratch frame
(defvar +hlissner--scratch-frame nil)

(defun cleanup-scratch-frame (frame)
  (when (eq frame +hlissner--scratch-frame)
    (with-selected-frame frame
      (setq doom-fallback-buffer-name (frame-parameter frame 'old-fallback-buffer))
      (remove-hook 'delete-frame-functions #'cleanup-scratch-frame))))

;;;###autoload
(defun awahab-open-scratch-frame (&optional fn)
  "Opens the org-capture window in a floating frame that cleans itself up once
you're done. This can be called from an external shell script."
  (interactive)
  (let* ((frame-title-format "")
         (preframe (cl-loop for frame in (frame-list)
                            if (equal (frame-parameter frame 'name) "xst-scratch")
                            return frame))
         (frame (unless preframe
                  (make-frame `((name . "xst-scratch")
                                (width . 140)
                                (height . 34)
                                (transient . t)
                                (internal-border-width . 10)
                                (left-fringe . 0)
                                (right-fringe . 0)
                                (undecorated . t)
                                ,(if IS-LINUX '(display . ":0")))))))
    (setq +hlissner--scratch-frame (or frame posframe))
    (select-frame-set-input-focus +hlissner--scratch-frame)
    (when frame
      (with-selected-frame frame
        (if fn
            (call-interactively fn)
          (with-current-buffer (switch-to-buffer "*scratch*")
            ;; (text-scale-set 2)
            (when (eq major-mode 'fundamental-mode)
              (emacs-lisp-mode)))
          (redisplay)
          (set-frame-parameter frame 'old-fallback-buffer doom-fallback-buffer-name)
          (setq doom-fallback-buffer-name "*scratch*")
          (add-hook 'delete-frame-functions #'cleanup-scratch-frame))))))

(defun my-block-saving-in-org-mode ()
 "Prevent saving in Org mode."
 (when (eq major-mode 'org-mode)
   (error "Saving is blocked in Org mode")))

(defun enable-block-saving-in-org-mode ()
 "Enable blocking of saving in Org mode."
 (add-hook 'before-save-hook 'my-block-saving-in-org-mode))

(defun disable-block-saving-in-org-mode ()
 "Disable blocking of saving in Org mode."
 (remove-hook 'before-save-hook 'my-block-saving-in-org-mode))

(enable-block-saving-in-org-mode)
