father(a, b).
father(b, c).
father(c, d).
father(d, e).

ancestor(X, Y) :- father(X, Y).
ancestor(X, Y) :- father(X, Z), ancestor(Z, Y).