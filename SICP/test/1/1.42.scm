(define (compose f g)
  (lambda (x) (f (g x))))

(display ((compose (lambda (x) (* x x))
                   (lambda (x) (+ 1 x))) 6))
