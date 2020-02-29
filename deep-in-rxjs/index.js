const { Observable, of } = require("rxjs");
// type OperatorFunction<T, R> = (source: Observable<T>) => Observable<R>

function map(project) {
  return function mapOperation(source$) {
    if (typeof project !== "function") {
      throw new TypeError("argument is not a function...");
    }
    return Observable.create((observer) => {
      const subscription = source$.subscribe({
        next: value => {
          try {
            observer.next(project(value));
          } catch (e) {
            observer.error(e);
          }
        },
        error: observer.error,
        complete: () => observer.complete(),
      });
      return () => {
        subscription.unsubscribe();
      };
    });
  };
}

const source$ = of(1, 2, 3);
const sub = map((x) => x * x)(source$).subscribe(console.log);
