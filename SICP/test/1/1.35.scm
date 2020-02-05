(define (fixed_point f first_guess)
  (define (close_enough? v1 v2)
    (< (abs (- v1 v2)) 0.00001))
  (define (try guess)
    (let ((next (f guess)))
      (if (close_enough? guess next)
        next
        (try next))))
  (try first_guess))

(display (fixed_point (lambda (x) (+ 1 (/ 1 x))) 1.0))
