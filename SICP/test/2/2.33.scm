(define (reduce p initial ls)
  (if (null? ls)
      initial
      (p (car ls)
         (reduce p initial ls))))

(define (map p ls)
  (reduce (lambda (cur acc) (cons (p cur) acc)) '() ls))

(define (append seq1 seq2)
  (reduce cons seq2 seq1))

(define (length ls)
  (reduce (lambda (cur acc) (+ 1 acc)) 0 ls))
