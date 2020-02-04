; new-if

(define (new-if predicate then-case else-case)
  (cond
    (predicate then-case)
    (else else-case)))

; 使用 new-if 重写求平方根或出现什么结果？
; 由于是应用序，不断调用自身，爆栈
; 说明 if cond 都是特殊情况
