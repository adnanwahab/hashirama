;;; private/my-transient/amz-cr.el -*- lexical-binding: t; -*-

(require 'transient)
(require 'magit-base)

(defun transient-read-amz-workspace-projects (prompt initial-input history)
  (magit-completing-read-multiple
   prompt
   (mapcar (lambda (line)
             (save-excursion
               (list line)))
           (directory-files
            (file-name-directory (directory-file-name (doom-project-root)))
            nil "^[^.]"))
   nil nil initial-input history))

(transient-define-argument amz-cr:-i ()
  :description "Include packages"
  :class 'transient-option
  :key "-i"
  :argument "--include="
  :reader #'transient-read-amz-workspace-projects
  :multi-value t)

(transient-define-argument amz-cr:-r ()
  :description "Update exsting review."
  :class 'transient-option
  :key "-r"
  :argument "--update-review=")

(defun amz-cr--create-cr ()
  "Amazon CR create CR."
  (interactive)
  (let ((cmd '("cr")))
    (dolist (args
             ;; Testing args
             ;; '(("--include=" "p1" "p2") "--yes" "--all")
             (transient-args 'amz-cr)
             )
      (if (listp args)
          (progn
            (setq arg (car args))
            (setq args (cdr args))
            (dolist (element args)
              (appendq! cmd (list (concat arg element)))))
        (if (string= args "--yes")
            (pushnew! cmd "yes | ")
          (appendq! cmd (list args))))
      )
    (let* ((default-directory (doom-project-root)))
      (async-shell-command (string-join cmd " "))
      )))


;; Reference magit-log.el https://github.com/magit/magit/blob/main/lisp/magit-log.el
(transient-define-prefix amz-cr ()
  "Create Amazon CR."
  ["Arguments"
   (amz-cr:-i)
   (amz-cr:-r)
   ("-A" "Include all modified packages" (nil "--all"))
   ("-N" "New review" (nil "--new-review"))
   ("-y" "Yes" (nil "--yes"))
   ]
  [["Amazon CR"
    ("c" "Create CR" amz-cr--create-cr)
    ]]
  )

(provide 'amz-cr)
