(define (sum term a next b)
  (define (iter a result)
    (if (> a b)
      result
      (iter (next a) (+ result (term a)))))
  (iter a 0))

(define (sum_int a b)
  (sum (lambda (x) x) a (lambda (x) (+ 1 x)) b))

(display (sum_int 1 5))
