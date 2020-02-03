; 1.5 确定解释器使用哪种序求值

(define (p) (p))

(define (test x y)
  (if (= x 0)
    0
    y))

(display (test 0 (p)))

; 应用序：
; (test 0 (p))
; (test 0 (p))
; ...

; 正则序
; (test 0 (p))
; (if (= 0 0) 0 (p))
; (if (#t) 0 (p))
; 0
