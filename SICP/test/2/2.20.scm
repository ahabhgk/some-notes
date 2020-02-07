(define (same_parity first . rest)
  (filter (if (odd? first)
            odd?
            even?)
          (cons first rest)))

(display (same_parity 1 2 3 4 5 6 7))
