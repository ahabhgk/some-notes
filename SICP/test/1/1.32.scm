(define (accumulate combiner null_value term a next b)
  (if (> a b)
    null_value
    (combiner (term a) (accumulate combiner null_value term (next a) next b))))

(define (sum term a next b)
  (accumulate + 0 term a next b))
