;;; ~/.doom.d/autoload/python.el -*- lexical-binding: t; -*-

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
                                        ;               Debugger              ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;;;###autoload
(defun +python/annotate-pdb ()
  "Highlight break point lines."
  (interactive)
  (highlight-lines-matching-regexp "breakpoint()" 'breakpoint-enabled)
  (highlight-lines-matching-regexp "import \\(pdb\\|ipdb\\|pudb\\|wdb\\)" 'breakpoint-enabled)
  (highlight-lines-matching-regexp "\\(pdb\\|ipdb\\|pudb\\|wdb\\).set_trace()" 'breakpoint-enabled)
  (highlight-lines-matching-regexp "trepan.api.debug()") 'breakpoint-enabled)

;;;###autoload
(defun +python/toggle-breakpoint ()
  "Add a break point, highlight it."
  (interactive)
  (let ((trace (cond ((executable-find "trepan3k") "import trepan.api; trepan.api.debug()")
                     ((executable-find "wdb") "import wdb; wdb.set_trace()")
                     ((executable-find "pudb") "import pudb; pudb.set_trace()")
                     ;; ((executable-find "ipdb") "import ipdb; ipdb.set_trace()")
                     ;; ((executable-find "ipdb3") "import ipdb; ipdb.set_trace()")
                     ((executable-find "pudb3") "import pudb; pu.db")
                     ;; ((executable-find "python3.7") "breakpoint()")
                     ;; ((executable-find "python3.8") "breakpoint()")
                     (t "import pdb; pdb.set_trace()")))
        (line (thing-at-point 'line)))
    (if (and line (string-match trace line))
        (kill-whole-line)
      (progn
        (back-to-indentation)
        (insert trace)
        (insert "\n")
        (python-indent-line))))
  (+python/annotate-pdb))

;;;###autoload
(defun +python/toggle-debugpy-lines ()
  "Add debugpy listen lines."
  (interactive)
  (progn
    (beginning-of-buffer)
    ;; 20,000 is roughly about 200 lines
    (if (re-search-forward "import debugpy" 20000 t)
        (progn
          (beginning-of-buffer)
          (let ((regexes '("import debugpy\n"
                           "debugpy.listen((\"0.0.0.0\", 5678))\n"
                           "debugpy.wait_for_client()\n"
                           )))
            (dolist (reg regexes)
              (if (re-search-forward reg 20000 t)
                  (replace-match "" nil nil)))))
      (insert
       "import debugpy
debugpy.listen((\"0.0.0.0\", 5678))
debugpy.wait_for_client()
"))))

;;;###autoload
(defun +python/toggle-default-breakpoint ()
  "Add a break point, highlight it."
  (interactive)
  (let ((trace (cond (t "import pdb; pdb.set_trace()")))
        (line (thing-at-point 'line)))
    (if (and line (string-match trace line))
        (kill-whole-line)
      (progn
        (back-to-indentation)
        (insert trace)
        (insert "\n")
        (python-indent-line))))
  (+python/annotate-pdb))

;;;###autoload
(defun +python/copy-pdb-breakpoint-of-current-line ()
  "Copy a pdb like breakpoint on the current line."
  (interactive)
  (kill-new
   (concat "b " (file-relative-name (buffer-file-name) (doom-project-root))
           ":" (number-to-string (line-number-at-pos)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
                                        ;               Imports               ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


;;;###autoload
(defun +python/autoflake-remove-imports ()
  "Remove unused imports."
  (interactive)
  (shell-command
   (concat "autoflake --in-place --remove-all-unused-imports " (buffer-file-name)))
  (revert-buffer-no-confirm))

;; Copy from https://github.com/Wilfred/pyimport/blob/master/pyimport.el
(defun pyimport--current-line ()
  "Return the whole line at point, excluding the trailing newline."
  (buffer-substring-no-properties (line-beginning-position) (line-end-position)))

(defun pyimport--last-line-p ()
  "Return non-nil if the current line is the last in the buffer."
  (looking-at (rx (0+ not-newline) buffer-end)))

(defun pyimport--in-string-p ()
  "Return non-nil if point is inside a string."
  (nth 3 (syntax-ppss)))

(defun pyimport--buffer-lines (buffer)
  "Return all the lines in BUFFER, ignoring lines that are within a string."
  (let (lines)
    (with-current-buffer buffer
      (save-excursion
        (goto-char (point-min))
        (while (not (eobp))
          (unless (pyimport--in-string-p)
            (push (pyimport--current-line) lines))
          (forward-line 1))))
    (nreverse lines)))

(defun pyimport--import-lines (buffer)
  "Return all the lines in this Python BUFFER that look like imports."
  (->> (pyimport--buffer-lines buffer)
       (--filter (string-match (rx (or (seq bol "from ")
                                       (seq bol "import "))) it))
       (--map (propertize it 'pyimport-path (buffer-name buffer)))))

(defmacro pyimport--for-each-line (&rest body)
  "Execute BODY for every line in the current buffer.
To terminate the loop early, throw 'break."
  (declare (indent 0))
  `(save-excursion
     (catch 'break
       (goto-char (point-min))
       (while (not (pyimport--last-line-p))
         ,@body
         (forward-line))
       ,@body)))

(defun pyimport--same-module (import1 import2)
  "Return t if both lines of Python imports are from the same module."
  (-let (((keyword1 mod1 ...) (s-split " " import1))
         ((keyword2 mod2 ...) (s-split " " import2)))
    (and (string= keyword1 "from")
         (string= keyword2 "from")
         (string= mod1 mod2))))

(defun pyimport--insert-from-symbol (symbol)
  "When point is a on an import line, add SYMBOL."
  ;; Assumes the current line is of the form 'from foo import bar, baz'.

  ;; Step past the 'from '.
  (goto-char (line-beginning-position))
  (while (not (looking-at "import "))
    (forward-char 1))
  (forward-char (length "import "))

  (insert
   (->> (delete-and-extract-region (point) (line-end-position))
        (s-split ", ")
        (cons symbol)
        (-sort #'string<)
        (-uniq)
        (s-join ", "))))

(defun pyimport--insert-import (line)
  "Insert LINE, a python import statement, in the current buffer."
  (let* ((current-lines (pyimport--import-lines (current-buffer)))
         (same-pkg-lines (--filter (pyimport--same-module it line) current-lines)))
    (if same-pkg-lines
        ;; Find the first matching line, and append there
        (pyimport--for-each-line
          (when (pyimport--same-module (pyimport--current-line) line)
            (-let [(_ _module _ name) (s-split " " line)]
              (pyimport--insert-from-symbol name))
            ;; Break from this loop.
            (throw 'break nil)))

      ;; We don't have any imports for this module yet, so just insert
      ;; LINE as-is.
      (save-excursion
        (goto-char (point-min))
        (let ((insert-pos (point)))
          (catch 'found
            ;; Find the first non-comment non-blank line.
            (dotimes (_ 30)
              (forward-line 1)
              (let* ((ppss (syntax-ppss))
                     ;; Since point is at the start of the line, we
                     ;; are outside single line comments or
                     ;; strings. However, we might be in a multiline
                     ;; comment.
                     (string-comment-p (nth 8 ppss)))
                (when (and (not (looking-at "\n"))
                           (not (looking-at "#"))
                           (not (looking-at "\""))
                           (not string-comment-p))
                  (setq insert-pos (point))
                  (throw 'found nil)))))
          (insert line "\n"))))))

(defvar +python/python-temp-import nil
  "Temporary import string.")

;;;###autoload
(defun +python/insert-temp-import ()
  "Insert temporary import string."
  (interactive)
  (require 'rx)
  (require 's)
  (require 'dash)
  (if +python/python-temp-import
      (pyimport--insert-import +python/python-temp-import)
    (message "Haven't copy the import...")))

;;;###autoload
(defun +python/yank-module-import ()
  "Copy the current module's name to the kill ring."
  (interactive)
  (if-let (import (string-join `("from"
                                 ,(replace-regexp-in-string
                                   "/" "\."
                                   (file-relative-name (or (file-name-sans-extension (buffer-file-name))
                                                           (bound-and-true-p list-buffers-directory))
                                                       (doom-project-root)))
                                 "import" ,(replace-regexp-in-string "\\..*" "" (which-function)))
                               " "))
      ;; (message (kill-new (abbreviate-file-name import)))
      (message (setq +python/python-temp-import import))
    (error "Couldn't find filename in current buffer")))

;;;###autoload
(defun +python/copy-pytest-cmd ()
  "Copy pytest cmd."
  (interactive)
  (message (kill-new
            (concat "pytest "
                    (file-relative-name (buffer-file-name) (doom-project-root))
                    "::"
                    (which-function)
                    ))))

;;;###autoload
(defun +python/copy-unittest-cmd ()
  "Copy pytest cmd."
  (interactive)
  (message (kill-new
            (concat "python "
                    (file-relative-name (buffer-file-name) (doom-project-root))
                    " "
                    (which-function)
                    ))))

;;;###autoload
(defun +python/copy-python-cmd ()
  "Copy pytest cmd."
  (interactive)
  (message (kill-new
            (concat "python3 " (file-relative-name (buffer-file-name) (doom-project-root))))))

;;;###autoload
(defun +python/copy-pudb-python-cmd ()
  "Copy pytest cmd."
  (interactive)
  (message (kill-new
            (concat "python3 -m pudb.run "
                    (file-relative-name (buffer-file-name) (doom-project-root))))))

;;;###autoload
(defun +python/copy-pudb-pytest-cmd ()
  "Copy pytest cmd."
  (interactive)
  (message (kill-new
            (concat "pytest --pdbcls pudb.debugger:Debugger --pdb --capture=no "
                    (file-relative-name (buffer-file-name) (doom-project-root))
                    "::"
                    (which-function)
                    ))))
