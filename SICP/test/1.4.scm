; 返回过程（闭包）

(define (a-plus-abs-b a b)
  ((if (> b 0) + -) a b))

(display (a-plus-abs-b 1 -3))
