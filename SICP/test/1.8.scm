; cube-root

(define (square x) (* x x))
(define (cube x) (* x x x))

(define (cbrt x)
  (define (good-enough? guess)
    (< (abs (- (cube guess) x)) ; abs
      0.001))
  (define (improve guess)
    (/ (+ (/ x (square guess))
        (* 2 guess))
      3))
  (define (try guess)
    (if (good-enough? guess)
      guess
      (try (improve guess))))
  (try 1))

; 使用浮点数
(display (cbrt (cube 3.0)))
