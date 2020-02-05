(define (smallest-div n) 
  (define (divides? a b) 
    (= 0 (remainder b a))) 
  (define (find-div n test) 
    (cond ((> (* test test) n) n) ((divides? test n) test) 
          (else (find-div n (+ test 1))))) 
  (find-div n 2))

(define (prime? n) 
  (if (= n 1) #f (= n (smallest-div n))))

(define (filtered_accumulate combiner null_value term a next b valid?)
  (if (> a b)
    null_value
    (combiner (if (valid? a) (term a) null_value)
      (filtered_accumulate combiner null_value term (next a) next b valid?))))

(define (primes-sum a b)
    (filtered_accumulate + 
                         0
                         (lambda (x) x)
                         a
                         (lambda (i) (+ i 1))
                         b
                         prime?))

(display (primes-sum 1 10))
