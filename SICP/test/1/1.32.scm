; (define (accumulate combiner null_value term a next b)
;   (if (> a b)
;     null_value
;     (combiner (term a) (accumulate combiner null_value term (next a) next b))))

(define (accumulate combiner null_value term a next b)
  (define (iter a result)
    (if (> a b)
      result
      (iter (next a) (combiner result (term a)))))
  (iter a null_value))

(define (sum term a next b)
  (accumulate + 0 term a next b))

(define (sum_int a b)
  (sum (lambda (x) x) a (lambda (x) (+ 1 x)) b))

(display (sum_int 1 5))
