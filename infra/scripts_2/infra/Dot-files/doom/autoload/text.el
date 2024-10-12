;;; autoload/text.el -*- lexical-binding: t; -*-

(defun +my/markdown-highlight ()
  "Surround each line of the current REGION with a start/end tag."
  (interactive)
  (let ((delim "=="))
    (markdown--insert-common delim delim markdown-regex-bold 2 4 'markdown-bold-face t)))

;;;###autoload
(defun +my/markdown-highlight-using-html-mark ()
  "Surround each line of the current REGION with a start/end tag."
  (interactive)
  (require 'web-mode)
  (when mark-active
    (let (beg end line-beg line-end pos tag tag-start tag-end)
      (save-excursion
        (combine-after-change-calls
          (setq tag "mark"
                tag-start (concat "<" tag ">")
                tag-end (concat "</" tag ">")
                pos (point)
                beg (region-beginning)
                end (region-end)
                line-beg (web-mode-line-number beg)
                line-end (web-mode-line-number end))
          (goto-char end)
          (unless (bolp)
            (insert tag-end)
            (back-to-indentation)
            (when (> beg (point))
              (goto-char beg))
            (insert tag-start))
          (while (> line-end line-beg)
            (forward-line -1)
            (setq line-end (1- line-end))
            (unless (looking-at-p "[[:space:]]*$")
              (end-of-line)
              (insert tag-end)
              (back-to-indentation)
              (when (> beg (point))
                (goto-char beg))
              (insert tag-start))
            )                           ;while
          (deactivate-mark)
          )                             ;combine-after-change-calls
        )                               ;save-excursion
      )))
