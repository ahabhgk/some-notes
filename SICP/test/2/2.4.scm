(define (cons x y)
  (lambda (m) (m x y)))

(define (car pair)
  (pair (lambda (x y) x)))

(define (cdr pair)
  (pair (lambda (x y) y)))

(define pair (cons 3 4))
(display (car pair))
(display (cdr pair))
