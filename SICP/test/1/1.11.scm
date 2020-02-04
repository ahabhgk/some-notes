(define (f_rec n)
  (if (< n 3)
    n
    (+ (f_rec (- n 1))
      (* 2 (f_rec (- n 2)))
      (* 3 (f_rec (- n 3))))))

(define (f_iter n)
  (define (iter a b c count)
    (if (= count 0)
      a
      (iter b c (+ c (* 2 b) (* 3 a)) (- count 1))))
  (iter 0 1 2 n))

(display (f_rec 5))
(display (f_iter 5))
; (iter 0 1 2 5)
; (iter 1 2 4 4)
; (iter 2 3 11 3)
; (iter 3 11 25 2)
; (iter 11 25 58 1)
; (iter 25 58 141 0)
