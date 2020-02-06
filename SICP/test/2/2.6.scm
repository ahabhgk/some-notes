; Church 计数

(define zero (lambda (f) (lambda (x) x)))

(define (inc n)
  (lambda (f) (lambda (x) (f ((n f) x)))))

(define one (inc zero))

(define two (inc one))
