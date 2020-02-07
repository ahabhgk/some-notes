(define (for-each proc ls)
  (if (not (null? ls))
      (begin ; 特殊形式 begin 可以确保多条表达式按顺序求值，它可以将多条表达式当作一条表达式来运行，因此可以用在只支持单条表达式的 if 形式里。
        (proc (car ls))
        (for-each proc (cdr ls)))))

; 使用 cond 也可以
; (define (for-each p lst)
;     (cond ((not (null? lst))
;             (p (car lst))
;             (for-each p (cdr lst)))))

(for-each (lambda (x) (newline) (display x)) (list 1 2 3))
