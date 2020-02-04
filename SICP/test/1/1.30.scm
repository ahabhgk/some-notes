(define (sum term a b next)
  (define (iter a result)
    (if (> a b)
      result
      (iter (next a) (+ result (term a)))))
  (iter (next a) (term a)))

(define (sum_int a b)
  (sum (lambda (x) x) a b (lambda (x) (+ 1 x))))

(display (sum_int 1 5))
