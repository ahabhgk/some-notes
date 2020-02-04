; 1.3 定义一个过程，三个参数，返回较大的两个之和
; (define (sum-of-bigger a b c)
;   (if (> a b)
;     (if (> b c)
;       (+ a b)
;       (+ a c))
;     (if (> a c)
;       (+ b a)
;       (+ b c))))

; (define (sum-of-bigger a b c)
;   (cond ((and (> a b) (> b c)) (+ a b))
;     ((and (> a b) (> c b)) (+ a c))
;     (else (+ b c))))

(define (sum-of-bigger a b c)
  (define (bigger x y)
    (if (> x y) x y))
  (define (smaller x y)
    (if (> x y) y x))
  (+ (bigger a b)
    (bigger (smaller a b) c)))

(display (sum-of-bigger 1 3 2))
