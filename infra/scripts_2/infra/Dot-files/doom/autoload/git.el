;;; autoload/git.el -*- lexical-binding: t; -*-

;;; Add support for Amazon code repos
;;;###autoload
(defun git-link-amazon-code (_hostname dirname filename branch commit start end)
  (require 's)
  (format "https://code.amazon.com/packages/%s/blobs/%s/--/%s"
          ;; The dirname here is user/repo-name. Just pick the repo-name.
          (nth 1 (s-split "/" dirname))
          (or commit branch)
          (concat filename
                  (when start
                    (concat "#"
                            (if end
                                (format "L%s-L%s" start end)
                              (format "L%s" start)))))))

;;;###autoload
(defun git-link-commit-amazon-code (_hostname dirname commit)
  (require 's)
  (format "https://code.amazon.com/packages/%s/commits/%s#"
          (nth 1 (s-split "/" dirname))
          commit))

;;;###autoload
(defun git-link-aws-codecommit (hostname dirname filename branch commit start end)
  (require 's)
  (format "https://console.aws.amazon.com/codesuite/codecommit/repositories/%s/browse/refs/heads/%s/--/%s?region=%s&lines=%s-%s"
          (nth 2 (s-split "\\/" dirname))
          (or branch commit)
          filename
          (nth 1 (s-split "\\." hostname))
          (or start "")
          (or end start "")))

;;;###autoload
(defun git-link-commit-aws-codecommit (hostname dirname commit)
  (require 's)
  (require 'magit-git)
  (format "https://console.aws.amazon.com/codesuite/codecommit/repositories/%s/commit/%s?region=%s"
          (nth 2 (s-split "\\/" dirname))
          (magit-rev-parse commit)
          (nth 1 (s-split "\\." hostname))))

;;;###autoload
(defun +vc/git-browse-commit (arg)
  "Open the website for the current version controlled file. Fallback to
repository root."
  (interactive "P")
  (require 'git-link)
  (let ((git-link-open-in-browser (not arg)))
    (git-link-commit (git-link--select-remote))))

;;;###autoload
(defun git-link-github-http (hostname dirname filename branch commit start end)
  (format "http://%s/%s/blob/%s/%s"
          hostname
          dirname
          (or branch commit)
          (concat filename
                  (when start
                    (concat "#"
                            (if end
                                (format "L%s-%s" start end)
                              (format "L%s" start)))))))

;;;###autoload
(defun git-link-commit-github-http (hostname dirname commit)
  (format "http://%s/%s/commit/%s"
          hostname
          dirname
          commit))

(defun magit-blame-get-hash ()
  "Code copied from magit-blame-copy-hash"
  (oref (magit-current-blame-chunk) orig-rev))

;;;###autoload
(defun magit-blame--git-link-commit (arg)
  "Git link commit go to current line's magit blame's hash"
  (interactive "P")
  (require 'git-link)
  (cl-letf (((symbol-function 'word-at-point)
             (symbol-function 'magit-blame-get-hash)))
    (let ((git-link-open-in-browser (not arg)))
      (git-link-commit (git-link--read-remote)))))


(defvar forge-show-all-issues-and-pullreqs t
  "If nil, only show issues and pullreqs assigned to me.")

;;;###autoload
(defun +my/forge-toggle-all-issues-and-pullreqs ()
  "Toggle the forge section which only shows the issues and pullreqs assigned to me."
  (interactive)
  (setq forge-insert-default '(forge-insert-pullreqs forge-insert-issues))
  (setq forge-insert-assigned '(forge-insert-assigned-pullreqs forge-insert-assigned-issues))
  (if forge-show-all-issues-and-pullreqs
      (progn
        (setq forge-show-all-issues-and-pullreqs nil)
        (remove-hook! 'magit-status-sections-hook #'forge-insert-issues nil t)
        (remove-hook! 'magit-status-sections-hook #'forge-insert-pullreqs nil t)
        (magit-add-section-hook 'magit-status-sections-hook 'forge-insert-assigned-pullreqs nil t)
        (magit-add-section-hook 'magit-status-sections-hook 'forge-insert-assigned-issues nil t))
    (progn
      (setq forge-show-all-issues-and-pullreqs t)
      (remove-hook! 'magit-status-sections-hook #'forge-insert-assigned-issues nil t)
      (remove-hook! 'magit-status-sections-hook #'forge-insert-assigned-pullreqs nil t)
      (magit-add-section-hook 'magit-status-sections-hook 'forge-insert-pullreqs nil t)
      (magit-add-section-hook 'magit-status-sections-hook 'forge-insert-issues nil t)))

  ;; refresh magit-status buffer
  (magit-refresh))
