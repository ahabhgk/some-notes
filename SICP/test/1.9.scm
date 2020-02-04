(define (inc n) (+ n 1))
(define (dec n) (- n 1))

; 迭代
(define (add_two_iter a b)
  (if (= a 0)
    b
    (add_two_iter (dec a) (inc b))))

; 递归
(define (add_two_rec a b)
  (if (= a 0)
    b
    (inc (add_two_rec (dec a) b))))

(display (add_two_iter 4 5))
(display (add_two_rec 4 5))
